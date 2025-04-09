
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AssessmentResult } from '@/types';

interface AssessmentSummaryReportProps {
  assessments: AssessmentResult[];
}

const AssessmentSummaryReport = ({ assessments }: AssessmentSummaryReportProps) => {
  if (assessments.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No assessment data available for the selected period.</p>
      </div>
    );
  }
  
  // Sort assessments by date
  const sortedAssessments = [...assessments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Format data for chart
  const chartData = sortedAssessments.map(assessment => ({
    date: new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    depression: assessment.depression.probability * 100,
    anxiety: assessment.anxiety.probability * 100,
  }));
  
  // Get latest assessment
  const latestAssessment = sortedAssessments[sortedAssessments.length - 1];
  
  // Helper functions for risk indicators
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRiskDescription = (risk: string, condition: string) => {
    switch (risk) {
      case 'low':
        return `Your ${condition} risk appears to be low. Continue monitoring your symptoms and using healthy coping strategies.`;
      case 'moderate':
        return `Your ${condition} risk is moderate. Consider discussing these symptoms with a mental health professional.`;
      case 'high':
        return `Your ${condition} risk is high. It's recommended to consult with a mental health professional about your symptoms.`;
      default:
        return `Unable to determine ${condition} risk level.`;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-2">Assessment Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="depression" 
                  name="Depression" 
                  stroke="#9b87f5" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="anxiety" 
                  name="Anxiety" 
                  stroke="#6E59A5" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Probability trends over {assessments.length} assessments
          </p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Depression</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(latestAssessment.depression.risk)}`}>
                {latestAssessment.depression.risk.toUpperCase()} RISK
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Latest Score:</span>
                <span className="font-medium">{latestAssessment.depression.score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Latest Probability:</span>
                <span className="font-medium">{Math.round(latestAssessment.depression.probability * 100)}%</span>
              </div>
            </div>
            <p className="text-sm mt-4">
              {getRiskDescription(latestAssessment.depression.risk, 'depression')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Anxiety</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(latestAssessment.anxiety.risk)}`}>
                {latestAssessment.anxiety.risk.toUpperCase()} RISK
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Latest Score:</span>
                <span className="font-medium">{latestAssessment.anxiety.score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Latest Probability:</span>
                <span className="font-medium">{Math.round(latestAssessment.anxiety.probability * 100)}%</span>
              </div>
            </div>
            <p className="text-sm mt-4">
              {getRiskDescription(latestAssessment.anxiety.risk, 'anxiety')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentSummaryReport;
