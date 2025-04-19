
import * as tf from '@tensorflow/tfjs';

// Sample data format:
// Each feature corresponds to:
// [sleep, appetite, focus, fatigue, mood_swings, social_interaction, 
//  stress, irritability, physical_symptoms, self_esteem, crying_spells,
//  suicidal_thoughts, motivation, daily_functioning, panic_attacks]

// Default feature names for reference
export const featureNames = [
  'sleep', 'appetite', 'focus', 'fatigue', 'mood_swings', 
  'social_interaction', 'stress', 'irritability', 'physical_symptoms',
  'self_esteem', 'crying_spells', 'suicidal_thoughts', 'motivation',
  'daily_functioning', 'panic_attacks'
];

// Store the model globally
let model: tf.LayersModel | null = null;

// Create a simple sequential neural network model
export function createModel() {
  // A simple feedforward neural network
  const newModel = tf.sequential();
  
  // Input layer (15 features)
  newModel.add(tf.layers.dense({
    inputShape: [15],
    units: 10,
    activation: 'relu'
  }));
  
  // Hidden layer
  newModel.add(tf.layers.dense({
    units: 6,
    activation: 'relu'
  }));
  
  // Output layer (2 outputs: depression and anxiety scores)
  newModel.add(tf.layers.dense({
    units: 2,
    activation: 'sigmoid' // Outputs between 0 and 1 for probability
  }));
  
  // Compile the model
  newModel.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });
  
  return newModel;
}

// Parse CSV data and train model
export async function trainModelFromCSV(csvString: string) {
  try {
    // Parse CSV data
    const rows = csvString.split('\n');
    const headers = rows[0].split(',').map(h => h.trim());
    
    // Validate headers
    const requiredHeaders = [
      'sleep', 'appetite', 'focus', 'fatigue', 'mood_swings',
      'social_interaction', 'stress', 'irritability', 'physical_symptoms',
      'self_esteem', 'crying_spells', 'suicidal_thoughts', 'motivation',
      'daily_functioning', 'panic_attacks', 'depression', 'anxiety'
    ];
    
    // Check if all required headers are present
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }
    
    // Extract feature indices (to handle any order of columns)
    const featureIndices = featureNames.map(name => headers.indexOf(name));
    const depressionIndex = headers.indexOf('depression');
    const anxietyIndex = headers.indexOf('anxiety');
    
    if (depressionIndex === -1 || anxietyIndex === -1) {
      throw new Error('CSV must contain depression and anxiety columns');
    }
    
    // Extract and normalize data
    const featuresData: number[][] = [];
    const labelsData: number[][] = [];
    
    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue; // Skip empty rows
      
      const values = row.split(',').map(v => parseFloat(v.trim()));
      
      // Extract features
      const features = featureIndices.map(index => values[index]);
      
      // Extract labels
      const depression = values[depressionIndex];
      const anxiety = values[anxietyIndex];
      
      // Skip rows with invalid data
      if (features.some(isNaN) || isNaN(depression) || isNaN(anxiety)) {
        console.warn('Skipping row with invalid data:', row);
        continue;
      }
      
      featuresData.push(features);
      labelsData.push([depression, anxiety]);
    }
    
    // Create a new model
    model = createModel();
    
    // Convert to tensors
    const xs = tf.tensor2d(featuresData);
    const ys = tf.tensor2d(labelsData);
    
    // Train the model
    await model.fit(xs, ys, {
      epochs: 100,
      verbose: 1,
      batchSize: 8,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
          }
        }
      }
    });
    
    // Clean up tensors
    xs.dispose();
    ys.dispose();
    
    // Save the model to localStorage
    await saveModel();
    
    return model;
  } catch (error) {
    console.error("Error training model from CSV:", error);
    throw error;
  }
}

// Function to train the model with sample data (fallback)
export async function trainModel() {
  // Create model if it doesn't exist
  if (!model) {
    model = createModel();
  }
  
  // Sample training data
  const sampleFeatures = [
    [0.1, 0.2, 0.1, 0.2, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.0, 0.0, 0.1, 0.1, 0.1], // Healthy
    [0.2, 0.3, 0.2, 0.3, 0.2, 0.2, 0.3, 0.2, 0.2, 0.2, 0.1, 0.0, 0.2, 0.2, 0.2], // Mild
    [0.5, 0.4, 0.6, 0.5, 0.5, 0.6, 0.7, 0.5, 0.4, 0.6, 0.3, 0.1, 0.6, 0.5, 0.4], // Moderate
    [0.7, 0.6, 0.8, 0.7, 0.7, 0.8, 0.8, 0.7, 0.6, 0.9, 0.7, 0.3, 0.8, 0.7, 0.3], // Severe depr
    [0.6, 0.4, 0.7, 0.6, 0.8, 0.6, 0.9, 0.8, 0.7, 0.5, 0.4, 0.1, 0.6, 0.6, 0.9], // Severe anx
    [0.9, 0.8, 0.9, 0.9, 0.8, 0.9, 0.9, 0.8, 0.7, 0.9, 0.8, 0.7, 0.9, 0.9, 0.8], // Both severe
    [0.3, 0.2, 0.3, 0.3, 0.2, 0.2, 0.3, 0.2, 0.1, 0.3, 0.1, 0.0, 0.3, 0.2, 0.5], // Mild anx
    [0.4, 0.5, 0.3, 0.4, 0.3, 0.3, 0.4, 0.3, 0.3, 0.5, 0.4, 0.1, 0.4, 0.4, 0.2], // Mild depr
  ];
  
  // Sample labels [depression, anxiety] where each is 0-1 probability
  const sampleLabels = [
    [0.05, 0.05], // Healthy
    [0.15, 0.15], // Mild symptoms of both
    [0.55, 0.45], // Moderate both, more depression
    [0.80, 0.30], // Severe depression, mild anxiety
    [0.35, 0.85], // Mild depression, severe anxiety
    [0.90, 0.85], // Severe both
    [0.15, 0.60], // Mild depression, moderate anxiety
    [0.65, 0.20], // Moderate depression, mild anxiety
  ];
  
  // Convert to tensors
  const xs = tf.tensor2d(sampleFeatures);
  const ys = tf.tensor2d(sampleLabels);
  
  // Train the model
  await model.fit(xs, ys, {
    epochs: 100,
    verbose: 0
  });
  
  // Clean up tensors to prevent memory leaks
  xs.dispose();
  ys.dispose();
  
  // Save the model to localStorage
  await saveModel();
  
  return model;
}

// Save the model to localStorage
export async function saveModel() {
  if (model) {
    try {
      await model.save('localstorage://mental-health-model');
      return true;
    } catch (error) {
      console.error('Error saving model:', error);
      return false;
    }
  }
  return false;
}

// Load the model from localStorage
export async function loadModel() {
  try {
    model = await tf.loadLayersModel('localstorage://mental-health-model');
    if (model) {
      model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });
      return model;
    }
  } catch (error) {
    console.log('No saved model found, creating a new one');
    model = createModel();
    await trainModel();
  }
  return model;
}

// Make predictions with the model
export async function predict(features: number[]) {
  // Ensure model is loaded
  if (!model) {
    await loadModel();
  }
  
  // Make prediction
  const input = tf.tensor2d([features]);
  const prediction = model?.predict(input) as tf.Tensor;
  const results = await prediction.data();
  
  // Clean up tensors
  input.dispose();
  prediction.dispose();
  
  // Return probabilities for depression and anxiety
  return {
    depression: {
      probability: results[0],
      risk: getRisk(results[0])
    },
    anxiety: {
      probability: results[1],
      risk: getRisk(results[1])
    }
  };
}

// Helper function to interpret probability as risk level
function getRisk(probability: number): 'low' | 'moderate' | 'high' {
  if (probability < 0.3) return 'low';
  if (probability < 0.7) return 'moderate';
  return 'high';
}
