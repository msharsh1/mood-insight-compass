
// This file simulates a machine learning model for predicting depression and anxiety risks
// In a real-world application, this would use a properly trained model
// or an API call to a service like TensorFlow.js

/**
 * Simple logistic regression model to predict depression probability
 * Based on PHQ-9 scoring guidelines
 * @param scores - Array of scores from depression-related questions (0-3 each)
 * @returns Probability of depression (0-1)
 */
export function predictDepression(scores: number[]): number {
  // Calculate total score (simple sum)
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  
  // Convert to probability using sigmoid function
  // Parameters chosen to roughly align with PHQ-9 guidelines
  const maxScore = scores.length * 3; // Maximum possible score
  const midPoint = maxScore * 0.4; // Score at which probability = 0.5
  const steepness = 0.3; // Controls how quickly probability changes with score
  
  return sigmoid((totalScore - midPoint) * steepness);
}

/**
 * Simple logistic regression model to predict anxiety probability
 * Based on GAD-7 scoring guidelines
 * @param scores - Array of scores from anxiety-related questions (0-3 each)
 * @returns Probability of anxiety (0-1)
 */
export function predictAnxiety(scores: number[]): number {
  // Calculate total score (simple sum)
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  
  // Convert to probability using sigmoid function
  // Parameters chosen to roughly align with GAD-7 guidelines
  const maxScore = scores.length * 3; // Maximum possible score
  const midPoint = maxScore * 0.35; // Score at which probability = 0.5
  const steepness = 0.35; // Controls how quickly probability changes with score
  
  return sigmoid((totalScore - midPoint) * steepness);
}

/**
 * Determine risk level based on score
 * @param score - Total score from questionnaire
 * @param maxPossible - Maximum possible score
 * @returns Risk level as 'low', 'moderate', or 'high'
 */
export function getRiskLevel(score: number, maxPossible: number): 'low' | 'moderate' | 'high' {
  const percentage = score / maxPossible;
  
  if (percentage < 0.33) return 'low';
  if (percentage < 0.67) return 'moderate';
  return 'high';
}

/**
 * Sigmoid function to convert scores to probability
 * @param x - Input value
 * @returns Probability between 0 and 1
 */
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}
