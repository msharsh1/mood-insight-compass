
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mood, AssessmentResult } from '@/types';

interface ClinicalReportProps {
  moods: Mood[];
  assessments: AssessmentResult[];
}

const ClinicalReport = ({ moods, assessments }: ClinicalReportProps) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Helper function to count mood occurrences
  const countMoods = () => {
    return moods.reduce((counts, mood) => {
      counts[mood.mood] = (counts[mood.mood] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  };
  
  // Calculate mood distribution
  const moodCounts = countMoods();
  const totalMoods = moods.length;
  
  // Calculate average mood factors if they exist
  const averageFactors: Record<string, number> = {};
  const factorCounts: Record<string, number> = {};
  
  moods.forEach(mood => {
    if (!mood.factors) return;
    
    Object.entries(mood.factors).forEach(([factor, value]) => {
      averageFactors[factor] = (averageFactors[factor] || 0) + value;
      factorCounts[factor] = (factorCounts[factor] || 0) + 1;
    });
  });
  
  Object.keys(averageFactors).forEach(factor => {
    if (factorCounts[factor]) {
      averageFactors[factor] = averageFactors[factor] / factorCounts[factor];
    }
  });
  
  // Get the latest assessment
  const latestAssessment = assessments.length > 0
    ? assessments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
  
  if (moods.length === 0 && assessments.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No data available for the clinical report.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 print:text-black">
      <div className="text-left border-b pb-4">
        <h2 className="text-2xl font-bold">Mental Health Clinical Report</h2>
        <p className="text-muted-foreground">Generated on {currentDate}</p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Patient Information</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Patient ID</TableCell>
              <TableCell>MH-12345</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Report Period</TableCell>
              <TableCell>{moods.length > 0 ? `${moods[0].date} to ${moods[moods.length - 1].date}` : 'No data'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total Mood Entries</TableCell>
              <TableCell>{moods.length}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Assessments Taken</TableCell>
              <TableCell>{assessments.length}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      {moods.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Mood Statistics</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mood State</TableHead>
                  <TableHead>Occurrences</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(moodCounts).map(([mood, count]) => (
                  <TableRow key={mood}>
                    <TableCell className="capitalize">{mood.replace('-', ' ')}</TableCell>
                    <TableCell>{count}</TableCell>
                    <TableCell>{((count / totalMoods) * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {Object.keys(averageFactors).length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium mb-3">Average Factor Ratings</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factor</TableHead>
                      <TableHead>Average Rating (1-10)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(averageFactors).map(([factor, average]) => (
                      <TableRow key={factor}>
                        <TableCell className="capitalize">{factor}</TableCell>
                        <TableCell>{average.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {latestAssessment && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Mental Health Assessment Results</h3>
            <p className="mb-2 text-sm">Latest assessment from {new Date(latestAssessment.date).toLocaleDateString()}</p>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Condition</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Depression</TableCell>
                  <TableCell>{latestAssessment.depression.score}</TableCell>
                  <TableCell>{(latestAssessment.depression.probability * 100).toFixed(1)}%</TableCell>
                  <TableCell className="capitalize">{latestAssessment.depression.risk}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Anxiety</TableCell>
                  <TableCell>{latestAssessment.anxiety.score}</TableCell>
                  <TableCell>{(latestAssessment.anxiety.probability * 100).toFixed(1)}%</TableCell>
                  <TableCell className="capitalize">{latestAssessment.anxiety.risk}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-8 border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Clinical Notes</h3>
        <p className="text-sm mb-2">
          This report is generated from self-reported data and should be used as a supplementary
          tool in clinical assessment. The risk levels and probabilities are calculated using
          a simple machine learning model based on PHQ-9 and GAD-7 scoring guidelines.
        </p>
        <p className="text-sm">
          It's recommended to review this data alongside a clinical interview and other
          assessment methods for a comprehensive evaluation of the patient's mental health status.
        </p>
      </div>
    </div>
  );
};

export default ClinicalReport;
