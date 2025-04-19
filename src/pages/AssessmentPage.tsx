
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssessmentForm from '@/components/assessment/AssessmentForm';
import AssessmentResults from '@/components/assessment/AssessmentResults';
import DetailedAssessmentForm from '@/components/assessment/DetailedAssessmentForm';
import { Button } from '@/components/ui/button';
import { loadModel } from '@/utils/tfjs-model';

const AssessmentPage = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize the ML model
  const initializeModel = async () => {
    setIsLoading(true);
    try {
      await loadModel();
      setIsInitialized(true);
    } catch (error) {
      console.error("Error loading model:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-mental-purple to-mental-deep-purple bg-clip-text text-transparent">
          Mental Health Assessment
        </h1>
        <p className="text-muted-foreground mt-2 animate-fade-in">
          Complete an assessment to evaluate your mental health and track changes over time
        </p>
      </div>
      
      <Tabs defaultValue="take-assessment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="take-assessment">Standard Assessment</TabsTrigger>
          <TabsTrigger value="ml-assessment">ML Assessment</TabsTrigger>
          <TabsTrigger value="view-results">View Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="take-assessment">
          <AssessmentForm />
        </TabsContent>
        
        <TabsContent value="ml-assessment">
          {isInitialized ? (
            <DetailedAssessmentForm />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
              <h3 className="text-lg font-medium mb-3">ML Model Setup Required</h3>
              <p className="text-muted-foreground mb-6 text-center">
                To use the ML-based assessment, we need to initialize the machine learning model.
                This will take a few seconds.
              </p>
              <Button 
                onClick={initializeModel} 
                className="btn-gradient text-white"
                disabled={isLoading}
              >
                {isLoading ? "Loading Model..." : "Initialize ML Model"}
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="view-results">
          <AssessmentResults />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default AssessmentPage;
