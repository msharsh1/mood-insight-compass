
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useMentalHealth } from '@/contexts/MentalHealthContext';
import { mockAssessmentQuestions } from '@/data/mockData';
import { AssessmentQuestion } from '@/types';
import { predictAnxiety, predictDepression, getRiskLevel } from '@/utils/ml';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AssessmentForm = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addAssessmentResult } = useMentalHealth();
  
  const questions = mockAssessmentQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: parseInt(value),
    });
    
    // Move to next question or complete if last
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const calculateResults = async () => {
    setIsSubmitting(true);
    
    // Wait a bit to simulate ML processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get all answers sorted by question ID
    const sortedAnswers = questions.map(question => answers[question.id] || 0);
    
    // Filter questions for each condition
    const depressionQuestions = questions.filter(q => q.factor === 'depression' || q.factor === 'both');
    const anxietyQuestions = questions.filter(q => q.factor === 'anxiety' || q.factor === 'both');
    
    // Get answers for each condition
    const depressionAnswers = depressionQuestions.map(q => answers[q.id] || 0);
    const anxietyAnswers = anxietyQuestions.map(q => answers[q.id] || 0);
    
    // Calculate total scores
    const depressionScore = depressionAnswers.reduce((sum, score) => sum + score, 0);
    const anxietyScore = anxietyAnswers.reduce((sum, score) => sum + score, 0);
    
    // Use ML model to predict probabilities
    const depressionProbability = predictDepression(depressionAnswers);
    const anxietyProbability = predictAnxiety(anxietyAnswers);
    
    // Get risk levels
    const depressionRisk = getRiskLevel(
      depressionScore, 
      depressionQuestions.length * 3
    );
    
    const anxietyRisk = getRiskLevel(
      anxietyScore,
      anxietyQuestions.length * 3
    );
    
    // Create assessment result
    const result = {
      date: new Date().toISOString().split('T')[0],
      depression: {
        score: depressionScore,
        risk: depressionRisk,
        probability: parseFloat(depressionProbability.toFixed(2)),
      },
      anxiety: {
        score: anxietyScore,
        risk: anxietyRisk,
        probability: parseFloat(anxietyProbability.toFixed(2)),
      },
    };
    
    addAssessmentResult(result);
    setIsSubmitting(false);
    
    toast({
      title: "Assessment Complete",
      description: "Your mental health assessment has been saved and analyzed.",
    });
    
    // Reset form
    setCurrentQuestionIndex(0);
    setAnswers({});
  };
  
  // Determine if all questions have been answered
  const allQuestionsAnswered = questions.every(q => answers[q.id] !== undefined);
  
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Mental Health Assessment</CardTitle>
        <CardDescription>
          Please answer honestly based on your experiences over the past 2 weeks.
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h3>
            <p className="text-base mt-2">{currentQuestion.question}</p>
          </div>
          
          <RadioGroup
            value={answers[currentQuestion.id]?.toString()}
            onValueChange={handleAnswer}
          >
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/30 transition-colors"
                >
                  <RadioGroupItem 
                    value={option.value.toString()} 
                    id={`option-${option.value}`} 
                    className="peer"
                  />
                  <Label 
                    htmlFor={`option-${option.value}`}
                    className="flex-grow cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        {isLastQuestion && allQuestionsAnswered ? (
          <Button onClick={calculateResults} disabled={isSubmitting} className="btn-gradient text-white">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              'Complete Assessment'
            )}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default AssessmentForm;
