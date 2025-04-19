
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Check } from 'lucide-react';
import { featureNames, predict } from '@/utils/tfjs-model';
import { useMentalHealth } from '@/contexts/MentalHealthContext';

const DetailedAssessmentForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [features, setFeatures] = useState<number[]>(Array(15).fill(0));
  const { addAssessmentResult } = useMentalHealth();
  
  const featureLabels = [
    'Sleep Problems', 'Appetite Changes', 'Focus Difficulties', 'Fatigue Level', 
    'Mood Swings', 'Social Interaction', 'Stress Level', 'Irritability', 
    'Physical Symptoms', 'Self Esteem', 'Crying Spells', 'Suicidal Thoughts', 
    'Motivation Level', 'Daily Functioning', 'Panic Attacks'
  ];
  
  // Update a specific feature's value
  const updateFeature = (index: number, value: number[]) => {
    const newFeatures = [...features];
    newFeatures[index] = value[0];
    setFeatures(newFeatures);
  };
  
  // Process the assessment
  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      // Get predictions from model
      const results = await predict(features);
      
      // Create assessment result
      const result = {
        date: new Date().toISOString().split('T')[0],
        depression: {
          score: Math.round(results.depression.probability * 100),
          risk: results.depression.risk,
          probability: results.depression.probability,
        },
        anxiety: {
          score: Math.round(results.anxiety.probability * 100),
          risk: results.anxiety.risk,
          probability: results.anxiety.probability,
        },
      };
      
      // Add to context
      addAssessmentResult(result);
      
      toast({
        title: "Assessment Complete",
        description: "Your ML-based assessment has been analyzed.",
      });
    } catch (error) {
      console.error('Error processing assessment:', error);
      toast({
        title: "Processing Error",
        description: "There was an error analyzing your assessment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>ML-Based Mental Health Assessment</CardTitle>
        <CardDescription>
          Rate each factor from 0 (no problem) to 10 (severe problem)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {featureLabels.map((label, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm">{Math.round(features[index] * 10)}/10</span>
              </div>
              <Slider
                defaultValue={[0]}
                max={1}
                step={0.1}
                value={[features[index]]}
                onValueChange={(value) => updateFeature(index, value)}
              />
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={isProcessing}
          className="btn-gradient text-white w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Complete Assessment
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DetailedAssessmentForm;
