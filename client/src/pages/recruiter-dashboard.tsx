import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Users, 
  Home, 
  Link as LinkIcon, 
  BarChart3, 
  NotebookPen, 
  Eye, 
  Plus,
  Copy,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Menu,
  X
} from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'generate' | 'applications' | 'links'>('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

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

  // Copy to clipboard function for mobile
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast({
          title: "Copied!",
          description: "Link copied to clipboard",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive",
        });
      }
      document.body.removeChild(textArea);
    }
  };

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

  // Mobile navigation tabs
  const navTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'generate', label: 'Generate', icon: Plus },
    { id: 'applications', label: 'Applications', icon: NotebookPen },
    { id: 'links', label: 'Links', icon: LinkIcon },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Users className={`${isMobile ? 'text-xl' : 'text-2xl'} text-primary mr-2`} />
              <h1 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900`}>
                {isMobile ? 'Recruiter' : 'Recruiter Dashboard'}
              </h1>
            </div>
            {!isMobile && (
              <Link href="/">
                <Button variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            )}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="bg-white border-b">
          <div className="flex overflow-x-auto">
            {navTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 px-3 py-3 text-center border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={`${isMobile ? 'px-4 py-4' : 'container mx-auto px-4 py-8'}`}>
        {/* Mobile Menu Overlay */}
        {isMobile && mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-white w-64 h-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Overview Tab - Stats Cards */}
        {(!isMobile || activeTab === 'overview') && (
          <div className={`${isMobile ? 'space-y-4' : 'grid lg:grid-cols-2 gap-8'} mb-8`}>
            {/* Stats Grid */}
            <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-2 gap-4'}`}>
              <Card>
                <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                  <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-primary mb-2`}>{stats.total}</div>
                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Total Applications</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                  <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-green-600 mb-2`}>{stats.completed}</div>
                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                  <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-yellow-600 mb-2`}>{stats.pending}</div>
                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                  <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-blue-600 mb-2`}>{stats.avgScore}</div>
                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Avg Score</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Generate Link Tab */}
        {(!isMobile || activeTab === 'generate') && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center`}>
                  <Plus className="mr-2 text-primary" />
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
                    className={isMobile ? 'text-base' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="applicantEmail">Applicant Email</Label>
                  <Input
                    id="applicantEmail"
                    placeholder="applicant@example.com"
                    value={newLinkData.applicantEmail}
                    onChange={(e) => setNewLinkData({...newLinkData, applicantEmail: e.target.value})}
                    className={isMobile ? 'text-base' : ''}
                  />
                </div>
                <Button 
                  onClick={handleGenerateLink}
                  disabled={!newLinkData.applicantEmail || generateLinkMutation.isPending}
                  className={`w-full ${isMobile ? 'h-12 text-base' : ''}`}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {generateLinkMutation.isPending ? "Generating..." : "Generate & Send Secure Link"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Applications Tab */}
        {(!isMobile || activeTab === 'applications') && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center`}>
                  <NotebookPen className="mr-2 text-primary" />
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
                    {applications.slice(0, isMobile ? 3 : 5).map((app) => (
                      <Card key={app.id} className={`${isMobile ? 'p-3' : 'p-6'}`}>
                        <div className={`${isMobile ? 'space-y-3' : 'grid md:grid-cols-2 gap-6'}`}>
                          <div>
                            <h4 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900`}>{app.fullName}</h4>
                            <div className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-600 space-y-1`}>
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {app.email}
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {app.mobileNumber}
                              </div>
                              {!isMobile && (
                                <>
                                  <p>SIN: {app.sinNumber}</p>
                                  <p>Legal Status: {app.legalStatus} | Transport: {app.transportation}</p>
                                </>
                              )}
                            </div>
                          </div>
                          <div className={`${isMobile ? 'flex justify-between items-center' : 'text-right'}`}>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                app.aptitudeScore >= 8 ? 'bg-green-100 text-green-800' :
                                app.aptitudeScore >= 6 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                <Star className="h-3 w-3 inline mr-1" />
                                {app.aptitudeScore}/10
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                app.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            {!isMobile && (
                              <div>
                                <p className="text-xs text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(app.submittedAt).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {app.jobType} | {app.liftingCapability}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Links Tab */}
        {(!isMobile || activeTab === 'links') && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center`}>
                  <LinkIcon className="mr-2 text-primary" />
                  Generated Application Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tokens.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No application links generated yet</div>
                ) : (
                  <div className="space-y-4">
                    {tokens.map((token: any) => (
                      <Card key={token.id} className={`${isMobile ? 'p-3' : 'p-4'} border border-gray-200`}>
                        <div className={`${isMobile ? 'space-y-3' : 'flex justify-between items-start'}`}>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-900`}>
                                {token.applicantEmail}
                              </p>
                              <span className={`px-2 py-1 rounded text-xs ${
                                token.usedAt ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {token.usedAt ? 'Used' : 'Active'}
                              </span>
                            </div>
                            {isMobile ? (
                              <div className="mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(token.applicationUrl)}
                                  className="w-full h-10"
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy Link
                                </Button>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-600 font-mono break-all mt-1">{token.applicationUrl}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Created: {new Date(token.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                Expires: {new Date(token.expiresAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {!isMobile && (
                            <div className="ml-4 flex flex-col space-y-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(token.applicationUrl)}
                              >
                                <Copy className="mr-1 h-3 w-3" />
                                Copy
                              </Button>
                              <Link href={`/apply/${token.token}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="mr-1 h-3 w-3" />
                                  View
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
