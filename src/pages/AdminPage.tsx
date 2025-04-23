
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { trainModelFromCSV } from '@/utils/tfjs-model';

const AdminPage = () => {
  const [csvContent, setCsvContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const csvData = event.target?.result as string;
        setCsvContent(csvData);
        
        try {
          await trainModelFromCSV(csvData);
          toast({
            title: "Model Training Complete",
            description: "The ML model has been trained successfully with your data.",
          });
        } catch (error) {
          console.error("Error training model:", error);
          toast({
            title: "Training Error",
            description: "Failed to train the model with the provided CSV.",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("File processing error:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing the file.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const handleDirectCsvTraining = async () => {
    if (!csvContent.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter CSV data before training.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      await trainModelFromCSV(csvContent);
      toast({
        title: "Model Training Complete",
        description: "The ML model has been trained successfully with your data.",
      });
    } catch (error) {
      console.error("Error training model:", error);
      toast({
        title: "Training Error",
        description: "Failed to train the model with the provided CSV.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-mental-purple to-mental-deep-purple bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Train the machine learning model with new datasets
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>ML Model Training</CardTitle>
          <CardDescription>
            Upload a CSV file to train the machine learning model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border border-dashed rounded-lg p-8 text-center space-y-4">
            <Input 
              id="csv-upload" 
              type="file" 
              accept=".csv,.tsv,.txt"
              onChange={handleFileUpload}
              className="mb-4"
              disabled={isUploading}
            />
          </div>
          
          <div className="space-y-4">
            <Input
              placeholder="Paste tab-separated CSV data here..."
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              className="h-64"
              disabled={isUploading}
            />
            <Button 
              onClick={handleDirectCsvTraining} 
              className="w-full"
              disabled={isUploading || !csvContent}
            >
              {isUploading ? "Training Model..." : "Train Model with This Data"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AdminPage;
