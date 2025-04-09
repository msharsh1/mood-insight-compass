
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssessmentForm from '@/components/assessment/AssessmentForm';
import AssessmentResults from '@/components/assessment/AssessmentResults';

const AssessmentPage = () => {
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="take-assessment">Take Assessment</TabsTrigger>
          <TabsTrigger value="view-results">View Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="take-assessment">
          <AssessmentForm />
        </TabsContent>
        
        <TabsContent value="view-results">
          <AssessmentResults />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default AssessmentPage;
