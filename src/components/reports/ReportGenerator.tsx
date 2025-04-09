
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMentalHealth } from '@/contexts/MentalHealthContext';
import { format, sub } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { DownloadIcon, Share2, Printer, Loader2 } from 'lucide-react';
import MoodSummaryReport from './MoodSummaryReport';
import AssessmentSummaryReport from './AssessmentSummaryReport';
import ClinicalReport from './ClinicalReport';

const ReportGenerator = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('month');
  const [isGenerating, setIsGenerating] = useState(false);
  const { moods, assessmentResults } = useMentalHealth();
  
  const getDateRange = () => {
    const endDate = format(new Date(), 'yyyy-MM-dd');
    let startDate;
    
    switch (dateRange) {
      case 'week':
        startDate = format(sub(new Date(), { weeks: 1 }), 'yyyy-MM-dd');
        break;
      case 'month':
        startDate = format(sub(new Date(), { months: 1 }), 'yyyy-MM-dd');
        break;
      case 'all':
      default:
        startDate = '2000-01-01'; // A date far in the past to include all records
        break;
    }
    
    return { startDate, endDate };
  };
  
  const filteredMoods = moods.filter(mood => {
    const { startDate, endDate } = getDateRange();
    return mood.date >= startDate && mood.date <= endDate;
  });
  
  const filteredAssessments = assessmentResults.filter(assessment => {
    const { startDate, endDate } = getDateRange();
    return assessment.date >= startDate && assessment.date <= endDate;
  });
  
  const handleDownload = (reportType: 'mood' | 'assessment' | 'clinical') => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: 'Report Downloaded',
        description: `Your ${reportType} report has been downloaded.`,
      });
    }, 1500);
  };
  
  const handleShare = () => {
    // This would typically open a sharing dialog or copy a link
    toast({
      title: 'Share Link Copied',
      description: 'A secure link to this report has been copied to your clipboard.',
    });
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mental Health Reports</CardTitle>
        <CardDescription>Generate reports to track your mental health or share with healthcare providers</CardDescription>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
          <Tabs value={dateRange} onValueChange={(v) => setDateRange(v as any)}>
            <TabsList>
              <TabsTrigger value="week">Past Week</TabsTrigger>
              <TabsTrigger value="month">Past Month</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              className="flex items-center gap-1"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mood" className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="mood" className="flex-1">Mood Summary</TabsTrigger>
            <TabsTrigger value="assessment" className="flex-1">Assessment Summary</TabsTrigger>
            <TabsTrigger value="clinical" className="flex-1">Clinical Report</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mood" className="pt-2">
            <MoodSummaryReport moods={filteredMoods} />
            <div className="mt-6 flex justify-center">
              <Button 
                className="btn-gradient text-white" 
                onClick={() => handleDownload('mood')}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download Mood Report
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="assessment" className="pt-2">
            <AssessmentSummaryReport assessments={filteredAssessments} />
            <div className="mt-6 flex justify-center">
              <Button 
                className="btn-gradient text-white" 
                onClick={() => handleDownload('assessment')}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download Assessment Report
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="clinical" className="pt-2">
            <ClinicalReport moods={filteredMoods} assessments={filteredAssessments} />
            <div className="mt-6 flex justify-center">
              <Button 
                className="btn-gradient text-white" 
                onClick={() => handleDownload('clinical')}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download Clinical Report
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
