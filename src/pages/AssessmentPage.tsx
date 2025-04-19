
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssessmentForm from '@/components/assessment/AssessmentForm';
import AssessmentResults from '@/components/assessment/AssessmentResults';
import DetailedAssessmentForm from '@/components/assessment/DetailedAssessmentForm';
import { Button } from '@/components/ui/button';
import { loadModel, trainModelFromCSV } from '@/utils/tfjs-model';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Check, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

const AssessmentPage = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [modelTrained, setModelTrained] = useState(false);
  const [activeTab, setActiveTab] = useState('take-assessment');
  const [csvContent, setCsvContent] = useState('');
  
  // Initialize the ML model
  const initializeModel = async () => {
    setIsLoading(true);
    try {
      await loadModel();
      setIsInitialized(true);
      toast({
        title: "Model Initialized",
        description: "The ML model has been loaded successfully.",
      });
    } catch (error) {
      console.error("Error loading model:", error);
      toast({
        title: "Error",
        description: "Failed to load the ML model.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Admin login handler
  const handleAdminLogin = () => {
    if (username === 'mag' && password === 'mag') {
      setIsAdminLoggedIn(true);
      setActiveTab('admin');
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard.",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
  };

  // Handle CSV file upload and training
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
          setModelTrained(true);
          setIsInitialized(true);
          toast({
            title: "Model Training Complete",
            description: "The ML model has been trained successfully with your data.",
          });
        } catch (error) {
          console.error("Error training model:", error);
          toast({
            title: "Training Error",
            description: "Failed to train the model with the provided CSV. Make sure it's tab-separated with the correct headers.",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        toast({
          title: "File Read Error",
          description: "Failed to read the CSV file.",
          variant: "destructive",
        });
        setIsUploading(false);
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
  
  // Handle direct CSV input
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
      setModelTrained(true);
      setIsInitialized(true);
      toast({
        title: "Model Training Complete",
        description: "The ML model has been trained successfully with your data.",
      });
    } catch (error) {
      console.error("Error training model:", error);
      toast({
        title: "Training Error",
        description: "Failed to train the model with the provided CSV. Make sure it's tab-separated with the correct headers.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Logout handler
  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setUsername('');
    setPassword('');
    setActiveTab('take-assessment');
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
      
      <div className="mb-6 flex justify-end">
        {!isAdminLoggedIn ? (
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('admin-login')}
            className="text-sm"
          >
            Admin Login
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-sm"
          >
            Logout
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="take-assessment">Standard Assessment</TabsTrigger>
          <TabsTrigger value="ml-assessment">ML Assessment</TabsTrigger>
          <TabsTrigger value="view-results">View Results</TabsTrigger>
          {isAdminLoggedIn && <TabsTrigger value="admin">Admin Panel</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="admin-login">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>
                Please enter your admin credentials to access the admin panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAdminLogin} className="w-full btn-gradient text-white">
                Login
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
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
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Model...
                  </>
                ) : (
                  "Initialize ML Model"
                )}
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="view-results">
          <AssessmentResults />
        </TabsContent>
        
        {isAdminLoggedIn && (
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>
                  Upload a CSV dataset to train the ML model for depression and anxiety prediction.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border border-dashed rounded-lg p-8 text-center space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">Upload CSV Dataset</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      The CSV should contain <strong>tab-separated</strong> columns for: sleep, appetite, focus, fatigue, mood_swings,
                      social_interaction, stress, irritability, physical_symptoms, self_esteem,
                      crying_spells, suicidal_thoughts, motivation, daily_functioning, panic_attacks,
                      depression, anxiety
                    </p>
                    <div className="relative">
                      <Input 
                        id="csv-upload" 
                        type="file" 
                        accept=".csv,.tsv,.txt"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading & Training...
                          </>
                        ) : (
                          "Select CSV File"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="csv-input">Or paste tab-separated CSV data directly:</Label>
                  <Textarea
                    id="csv-input"
                    placeholder="Paste your tab-separated CSV data here..."
                    className="h-64 font-mono text-sm"
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                  />
                  <Button 
                    onClick={handleDirectCsvTraining} 
                    className="w-full"
                    disabled={isUploading || !csvContent}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Training Model...
                      </>
                    ) : (
                      "Train Model with This Data"
                    )}
                  </Button>
                </div>
                
                <div className={`p-4 rounded-lg ${modelTrained ? 'bg-green-100 dark:bg-green-900/20' : 'bg-amber-100 dark:bg-amber-900/20'} flex items-center space-x-2`}>
                  {modelTrained ? (
                    <>
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span>Model has been trained successfully and is ready to use.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <span>Model has not been trained with a custom dataset yet.</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </Layout>
  );
};

export default AssessmentPage;
