import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Phone, BookOpen, PlayCircle, Users, MessageCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ResourcesPage = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-mental-purple to-mental-deep-purple bg-clip-text text-transparent">
          Mental Health Resources
        </h1>
        <p className="text-muted-foreground mt-2 animate-fade-in">
          Explore helpful resources for your mental wellbeing journey
        </p>
      </div>
      
      <Tabs defaultValue="crisis" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="crisis" className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span>Crisis Help</span>
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Articles</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-1">
            <PlayCircle className="h-4 w-4" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Support Groups</span>
          </TabsTrigger>
          <TabsTrigger value="therapy" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>Find Therapy</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Tools</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="crisis">
          <Card>
            <CardHeader>
              <CardTitle>Crisis Support</CardTitle>
              <CardDescription>Immediate help for mental health emergencies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-lg text-red-700">Emergency: 911</CardTitle>
                    <CardDescription>For immediate life-threatening emergencies</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-4">
                      Call 911 immediately if you or someone you know is in danger of harming themselves or others.
                    </p>
                    <Button variant="destructive" size="sm" className="w-full">
                      Call 911
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-lg text-blue-700">988 Crisis Lifeline</CardTitle>
                    <CardDescription>24/7 support for suicidal crisis or emotional distress</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-4">
                      Call or text 988 to connect with trained counselors who can provide support during a mental health crisis.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">Call 988</Button>
                      <Button variant="outline" size="sm">Text 988</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-purple-50">
                    <CardTitle className="text-lg text-purple-700">Crisis Text Line</CardTitle>
                    <CardDescription>Text HOME to 741741 for crisis support</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-4">
                      Text with trained crisis counselors for any type of crisis. Available 24/7.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">Text Crisis Line</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-lg text-green-700">Warmline Directory</CardTitle>
                    <CardDescription>Non-crisis emotional support by state</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-4">
                      Find a warmline in your state for non-emergency support from peers with lived mental health experience.
                    </p>
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                      Find a Warmline <ExternalLink className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>Mental Health Articles</CardTitle>
              <CardDescription>Evidence-based reading materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-32 bg-purple-100"></div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-lg mb-1">Understanding Anxiety and Depression</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Learn about the symptoms, causes and treatments for common mental health conditions.
                      </p>
                      <Button variant="link" className="p-0 h-auto flex items-center gap-1">
                        Read Article <ExternalLink className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Mental Health Videos</CardTitle>
              <CardDescription>Educational videos about mental wellbeing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="relative overflow-hidden rounded-lg">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <PlayCircle className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium">Meditation Techniques for Anxiety</h4>
                      <p className="text-xs text-muted-foreground mt-1">10:25 • Mindfulness Channel</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>Support Groups</CardTitle>
              <CardDescription>Connect with others facing similar challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="text-lg">Anxiety Support Group</CardTitle>
                      <CardDescription>Weekly meetings on Thursdays at 7pm ET</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">
                        A safe space to discuss anxiety challenges and coping strategies with others who understand.
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" className="btn-gradient text-white">Join Group</Button>
                        <Button size="sm" variant="outline">Learn More</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="therapy">
          <Card>
            <CardHeader>
              <CardTitle>Find a Therapist</CardTitle>
              <CardDescription>Connect with mental health professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Find the right support for you</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <input type="text" placeholder="Enter ZIP code" className="w-full mt-1 p-2 border rounded" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Specialization</label>
                    <select className="w-full mt-1 p-2 border rounded">
                      <option>Any Specialization</option>
                      <option>Depression</option>
                      <option>Anxiety</option>
                      <option>Trauma</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full btn-gradient text-white">Search</Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 bg-gray-100 flex items-center justify-center p-4">
                        <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                      </div>
                      <CardContent className="flex-1 p-4">
                        <h3 className="font-semibold text-lg">Dr. Sarah Johnson</h3>
                        <p className="text-sm text-muted-foreground">Licensed Psychologist • 5 miles away</p>
                        <div className="flex gap-2 mt-2 mb-3">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Depression</span>
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Anxiety</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">CBT</span>
                        </div>
                        <p className="text-sm mb-4">
                          Specializing in anxiety disorders, depression, and stress management using evidence-based approaches.
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" className="btn-gradient text-white">Book Consultation</Button>
                          <Button size="sm" variant="outline">View Profile</Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Mental Wellness Tools</CardTitle>
              <CardDescription>Interactive tools to support your mental health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="overflow-hidden border-2 border-mental-purple">
                  <div className="h-32 bg-mental-purple/20 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-mental-purple" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg mb-1">Guided Meditation</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Follow guided meditation sessions to reduce stress and improve mindfulness.
                    </p>
                    <Button className="w-full btn-gradient text-white">Start Now</Button>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="h-32 bg-blue-100 flex items-center justify-center">
                    <Users className="h-12 w-12 text-blue-500" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg mb-1">Breathing Exercises</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Simple breathing techniques to help manage anxiety and stress in the moment.
                    </p>
                    <Button className="w-full" variant="outline">Try Exercise</Button>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="h-32 bg-green-100 flex items-center justify-center">
                    <MessageCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg mb-1">Thought Journal</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Record and challenge negative thoughts to improve your thinking patterns.
                    </p>
                    <Button className="w-full" variant="outline">Open Journal</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default ResourcesPage;
