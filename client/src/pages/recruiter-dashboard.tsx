import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Users, Home, Link as LinkIcon, BarChart3, NotebookPen, Eye } from "lucide-react";
import type { Application } from "@shared/schema";

interface GeneratedLink {
  id: number;
  token: string;
  applicantEmail: string;
  recruiterEmail: string;
  generatedAt: string;
  expiresAt: string;
  used: boolean;
  link: string;
}

export default function RecruiterDashboard() {
  const [newLinkData, setNewLinkData] = useState({
    applicantEmail: "",
    recruiterEmail: "recruiter@talentcore.com"
  });
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications", newLinkData.recruiterEmail],
    queryFn: async () => {
      const response = await fetch(`/api/applications?recruiterEmail=${newLinkData.recruiterEmail}`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      return response.json();
    }
  });

  const { data: tokens = [] } = useQuery({
    queryKey: ["/api/tokens", newLinkData.recruiterEmail],
    queryFn: async () => {
      const response = await fetch(`/api/tokens/${encodeURIComponent(newLinkData.recruiterEmail)}`);
      if (!response.ok) throw new Error('Failed to fetch tokens');
      return response.json();
    }
  });

  const generateLinkMutation = useMutation({
    mutationFn: async (data: { applicantEmail: string; recruiterEmail: string }) => {
      const response = await apiRequest("POST", "/api/generate-link", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tokens", newLinkData.recruiterEmail] });
      const newLink: GeneratedLink = {
        id: Date.now(),
        token: data.token,
        applicantEmail: newLinkData.applicantEmail,
        recruiterEmail: newLinkData.recruiterEmail,
        generatedAt: new Date().toISOString(),
        expiresAt: data.expiresAt,
        used: false,
        link: data.applicationUrl
      };
      
      setGeneratedLinks([newLink, ...generatedLinks]);
      setNewLinkData({ ...newLinkData, applicantEmail: "" });
      
      toast({
        title: "Success",
        description: `Secure application link generated for ${newLink.applicantEmail}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate secure link",
        variant: "destructive",
      });
    }
  });

  const handleGenerateLink = () => {
    if (!newLinkData.applicantEmail) {
      toast({
        title: "Error",
        description: "Please enter an applicant email address",
        variant: "destructive",
      });
      return;
    }
    generateLinkMutation.mutate(newLinkData);
  };

  const stats = {
    total: applications.length,
    completed: applications.filter(app => app.status === "completed").length,
    pending: applications.filter(app => app.status === "pending").length,
    avgScore: applications.length > 0 ? (applications.reduce((sum, app) => sum + app.aptitudeScore, 0) / applications.length).toFixed(1) : "0"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Users className="text-2xl text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
            </div>
            <Link href="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Generate Secure Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="mr-3 text-primary" />
                Generate Secure Application Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recruiterEmail">Recruiter Email</Label>
                <Input
                  id="recruiterEmail"
                  value={newLinkData.recruiterEmail}
                  onChange={(e) => setNewLinkData({...newLinkData, recruiterEmail: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="applicantEmail">Applicant Email</Label>
                <Input
                  id="applicantEmail"
                  placeholder="applicant@example.com"
                  value={newLinkData.applicantEmail}
                  onChange={(e) => setNewLinkData({...newLinkData, applicantEmail: e.target.value})}
                />
              </div>
              <Button 
                onClick={handleGenerateLink}
                disabled={!newLinkData.applicantEmail || generateLinkMutation.isPending}
                className="w-full"
              >
                <NotebookPen className="mr-2 h-4 w-4" />
                {generateLinkMutation.isPending ? "Generating..." : "Generate & Send Secure Link"}
              </Button>
            </CardContent>
          </Card>

          {/* Application Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-3 text-success" />
                Application Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Applications</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-success">{stats.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-warning">{stats.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.avgScore}</div>
                  <div className="text-sm text-gray-600">Avg Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-3 text-gray-600" />
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No applications submitted yet</div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((app) => (
                  <Card key={app.id} className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">{app.fullName}</h4>
                        <p className="text-sm text-gray-600">{app.email} | {app.mobileNumber}</p>
                        <p className="text-sm text-gray-600">SIN: {app.sinNumber}</p>
                        <p className="text-sm text-gray-600">
                          Legal Status: {app.legalStatus} | Transport: {app.transportation}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex justify-end items-center space-x-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            app.aptitudeScore >= 8 ? 'bg-green-100 text-green-800' :
                            app.aptitudeScore >= 6 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Score: {app.aptitudeScore}/10
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            app.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Submitted: {new Date(app.submittedAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Job Type: {app.jobType} | Lifting: {app.liftingCapability}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Safety Shoes:</span>
                          <span className="ml-1">{app.hasSafetyShoes ? `Yes ${app.safetyShoeType ? `(${app.safetyShoeType})` : ''}` : 'No'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Forklift:</span>
                          <span className="ml-1">{app.hasForklifCert ? 'Certified' : 'No'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Background Check:</span>
                          <span className="ml-1">{app.backgroundCheckConsent ? 'Consented' : 'Declined'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Documents:</span>
                          <span className="ml-1">0 files</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LinkIcon className="mr-3 text-blue-600" />
              Generated Application Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tokens.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No application links generated yet</div>
            ) : (
              <div className="space-y-4">
                {tokens.map((token: any) => (
                  <div key={token.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{token.applicantEmail}</p>
                        <p className="text-sm text-gray-600 font-mono break-all">{token.applicationUrl}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Generated: {new Date(token.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          token.usedAt ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {token.usedAt ? 'Used' : 'Active'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {new Date(token.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link href={`/apply/${token.token}`}>
                      <Button size="sm" variant="outline" className="mt-3">
                        <Eye className="mr-1 h-3 w-3" />
                        View Application Form
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
