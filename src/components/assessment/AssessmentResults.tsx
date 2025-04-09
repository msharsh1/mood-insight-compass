
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useMentalHealth } from '@/contexts/MentalHealthContext';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';

const AssessmentResults = () => {
  const { assessmentResults } = useMentalHealth();
  
  if (assessmentResults.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
          <CardDescription>
            You haven't taken any assessments yet. Take your first assessment to see your results.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link to="/assessment">
            <Button className="btn-gradient text-white">Take Assessment</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }
  
  // Sort results by date (newest first)
  const sortedResults = [...assessmentResults].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const latestResult = sortedResults[0];
  
  // Format dates for chart
  const chartData = sortedResults.reverse().map(result => ({
    date: new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    depression: result.depression.probability * 100,
    anxiety: result.anxiety.probability * 100,
  }));
  
  // Helper function to determine risk color
  const getRiskColor = (risk: 'low' | 'moderate' | 'high') => {
    switch (risk) {
      case 'low':
        return 'text-green-500';
      case 'moderate':
        return 'text-orange-500';
      case 'high':
        return 'text-red-500';
      default:
        return '';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Latest Assessment Results</CardTitle>
          <CardDescription>
            {formatDate(latestResult.date)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium">Depression</h3>
                <p className={`text-sm font-medium ${getRiskColor(latestResult.depression.risk)}`}>
                  {latestResult.depression.risk.charAt(0).toUpperCase() + latestResult.depression.risk.slice(1)} Risk
                </p>
              </div>
              <p className="text-2xl font-bold">{Math.round(latestResult.depression.probability * 100)}%</p>
            </div>
            <Progress value={latestResult.depression.probability * 100} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium">Anxiety</h3>
                <p className={`text-sm font-medium ${getRiskColor(latestResult.anxiety.risk)}`}>
                  {latestResult.anxiety.risk.charAt(0).toUpperCase() + latestResult.anxiety.risk.slice(1)} Risk
                </p>
              </div>
              <p className="text-2xl font-bold">{Math.round(latestResult.anxiety.probability * 100)}%</p>
            </div>
            <Progress value={latestResult.anxiety.probability * 100} className="h-2" />
          </div>
          
          <div className="pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">What these results mean:</h3>
            <p className="text-sm">
              These percentages represent the likelihood of clinical depression or anxiety based on
              your answers. Results of 60% or higher may indicate symptoms that warrant a discussion
              with a mental health professional. Remember, this is not a clinical diagnosis.
            </p>
            <p className="text-sm mt-2">
              If you're concerned about your mental health, please consult with a healthcare provider.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {assessmentResults.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
            <CardDescription>
              Track how your scores have changed over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorDepression" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorAnxiety" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6E59A5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6E59A5" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis 
                    domain={[0, 100]} 
                    tickFormatter={(value) => `${value}%`}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Area 
                    type="monotone" 
                    dataKey="depression" 
                    name="Depression"
                    stroke="#9b87f5" 
                    fillOpacity={1} 
                    fill="url(#colorDepression)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="anxiety" 
                    name="Anxiety"
                    stroke="#6E59A5" 
                    fillOpacity={1} 
                    fill="url(#colorAnxiety)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center">
              <Link to="/assessment">
                <Button className="btn-gradient text-white">Take New Assessment</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssessmentResults;
