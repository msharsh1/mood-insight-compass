
import React from 'react';
import Layout from '@/components/layout/Layout';
import ReportGenerator from '@/components/reports/ReportGenerator';

const ReportsPage = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-mental-purple to-mental-deep-purple bg-clip-text text-transparent">
          Mental Health Reports
        </h1>
        <p className="text-muted-foreground mt-2 animate-fade-in">
          Generate comprehensive reports to track your mental health or share with healthcare providers
        </p>
      </div>
      
      <ReportGenerator />
    </Layout>
  );
};

export default ReportsPage;
