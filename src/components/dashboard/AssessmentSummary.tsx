
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useMentalHealth } from '@/contexts/MentalHealthContext';
import { Link } from 'react-router-dom';

const AssessmentSummary = () => {
  const { getLatestAssessmentResult } = useMentalHealth();
  const latestResult = getLatestAssessmentResult();
  
  const getRiskColor = (risk: 'low' | 'moderate' | 'high') => {
    switch (risk) {
      case 'low':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-orange-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!latestResult) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Mental Health Assessment</CardTitle>
          <CardDescription>You haven't taken an assessment yet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-center mb-4 text-muted-foreground">
            Take a quick assessment to get insights about your mental health
          </p>
          <Link to="/assessment">
            <Button className="btn-gradient text-white">
              Take Assessment
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Latest Assessment</CardTitle>
        <CardDescription>
          {formatDate(latestResult.date)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium">Depression</p>
              <p className="text-sm font-medium capitalize">{latestResult.depression.risk} risk</p>
            </div>
            <Progress 
              value={latestResult.depression.probability * 100} 
              className={`h-2 ${getRiskColor(latestResult.depression.risk)}`}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium">Anxiety</p>
              <p className="text-sm font-medium capitalize">{latestResult.anxiety.risk} risk</p>
            </div>
            <Progress 
              value={latestResult.anxiety.probability * 100} 
              className={`h-2 ${getRiskColor(latestResult.anxiety.risk)}`}
            />
          </div>
          
          <div className="pt-2 flex justify-center">
            <Link to="/assessment">
              <Button variant="outline" className="text-mental-deep-purple hover:bg-mental-deep-purple/10 hover:text-mental-deep-purple">
                Take New Assessment
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentSummary;
