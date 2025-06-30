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
  X,
  Smartphone,
  Share2,
  Download,
  RefreshCw,
  Bell,
  Search,
  Filter,
  MoreVertical
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
    recruiterEmail: "recruiter@talentcore.com",
    jobType: "general",
    customMessage: ""
  });
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'generate' | 'applications' | 'links'>('overview');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'used'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showEmailTemplates, setShowEmailTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("general");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  // Email templates for different job types
  const emailTemplates = {
    general: {
      subject: "Application Opportunity - TalentCore Staffing",
      message: "We have an exciting opportunity that matches your profile. Please complete your application using the secure link below."
    },
    warehouse: {
      subject: "Warehouse Position Available - TalentCore Staffing",
      message: "We have warehouse positions available that offer competitive pay and benefits. Complete your application to get started with your new career."
    },
    manufacturing: {
      subject: "Manufacturing Role - TalentCore Staffing",
      message: "Join our manufacturing team! We're looking for dedicated individuals for immediate placement. Please fill out your application below."
    },
    construction: {
      subject: "Construction Opportunity - TalentCore Staffing",
      message: "Construction positions available with competitive wages and growth opportunities. Complete your application to join our team."
    },
    office: {
      subject: "Office Position - TalentCore Staffing", 
      message: "Professional office positions available. We're seeking qualified candidates for immediate placement. Please complete your application."
    }
  };

  // Quick apply presets for common application scenarios
  const quickApplyPresets = {
    warehouse: {
      jobType: "warehouse",
      transportation: "own-vehicle",
      hasSafetyShoes: true,
      safetyShoeType: "steel-toe",
      liftingCapability: "50lbs",
      backgroundCheckConsent: true,
      legalStatus: "citizen"
    },
    manufacturing: {
      jobType: "manufacturing", 
      transportation: "own-vehicle",
      hasSafetyShoes: true,
      safetyShoeType: "composite-toe",
      liftingCapability: "40lbs",
      backgroundCheckConsent: true,
      legalStatus: "citizen"
    },
    office: {
      jobType: "office",
      transportation: "public-transit",
      hasSafetyShoes: false,
      liftingCapability: "25lbs",
      backgroundCheckConsent: true,
      legalStatus: "citizen"
    }
  };

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

  // PWA Install prompt
  const handleInstallPWA = () => {
    // This would be handled by the browser's install prompt
    if ('serviceWorker' in navigator) {
      toast({
        title: "Install App",
        description: "Add TalentCore to your home screen for quick access",
      });
    }
  };

  // Share functionality for mobile
  const shareLink = async (url: string, email: string) => {
    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: 'TalentCore Application Link',
          text: `Application link for ${email}`,
          url: url,
        });
      } catch (err) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  // Pull to refresh
  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["/api/applications", newLinkData.recruiterEmail] });
    await queryClient.invalidateQueries({ queryKey: ["/api/tokens", newLinkData.recruiterEmail] });
    toast({
      title: "Refreshed",
      description: "Data updated successfully",
    });
  };

  // Swipe gestures for mobile tabs
  const handleSwipe = (direction: 'left' | 'right') => {
    if (!isMobile) return;
    
    const tabs = ['overview', 'generate', 'applications', 'links'] as const;
    const currentIndex = tabs.indexOf(activeTab);
    
    if (direction === 'left' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Filter tokens for mobile search
  const filteredTokens = tokens.filter((token: any) => {
    const matchesSearch = token.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'used' && token.usedAt) || 
      (filterStatus === 'active' && !token.usedAt);
    return matchesSearch && matchesFilter;
  });

  // Apply quick preset to application link
  const applyQuickPreset = (presetType: keyof typeof quickApplyPresets) => {
    const preset = quickApplyPresets[presetType];
    const template = emailTemplates[presetType as keyof typeof emailTemplates];
    
    setNewLinkData(prev => ({
      ...prev,
      jobType: preset.jobType,
      customMessage: template.message
    }));
    setSelectedTemplate(presetType);
    
    toast({
      title: "Quick Apply Preset Applied",
      description: `${presetType.charAt(0).toUpperCase() + presetType.slice(1)} settings have been applied.`,
    });
  };

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
                {isMobile ? 'TalentCore' : 'Recruiter Dashboard'}
              </h1>
            </div>
            
            {/* Mobile action buttons */}
            {isMobile && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  className="p-2"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleInstallPWA}
                  className="p-2"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            )}

            {/* Desktop actions */}
            {!isMobile && (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Link href="/">
                  <Button variant="outline">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="bg-white border-b">
          {/* Search and Filter Bar */}
          {(activeTab === 'applications' || activeTab === 'links') && (
            <div className="px-4 py-2 border-b">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-8 text-sm"
                  />
                </div>
                {activeTab === 'links' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {/* Filter dropdown for links */}
              {showFilters && activeTab === 'links' && (
                <div className="mt-2 flex space-x-2">
                  {(['all', 'active', 'used'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                      className="text-xs px-3 py-1"
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Tab Navigation */}
          <div 
            className="flex overflow-x-auto"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              // Store initial touch position for swipe detection
            }}
            onTouchEnd={(e) => {
              // Detect swipe direction and change tabs
            }}
          >
            {navTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 px-3 py-3 text-center border-b-2 transition-colors relative ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">{tab.label}</span>
                  {/* Notification badge for applications */}
                  {tab.id === 'applications' && applications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {applications.length}
                    </span>
                  )}
                  {/* Badge for active links */}
                  {tab.id === 'links' && tokens.filter((t: any) => !t.usedAt).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {tokens.filter((t: any) => !t.usedAt).length}
                    </span>
                  )}
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
              <CardContent className="space-y-6">
                {/* Quick Apply Magic Buttons */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Quick Apply Magic ✨</Label>
                  <div className={`${isMobile ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-3 gap-3'}`}>
                    {Object.keys(quickApplyPresets).map((presetType) => {
                      const preset = quickApplyPresets[presetType as keyof typeof quickApplyPresets];
                      return (
                        <Button
                          key={presetType}
                          variant={selectedTemplate === presetType ? "default" : "outline"}
                          size="sm"
                          onClick={() => applyQuickPreset(presetType as keyof typeof quickApplyPresets)}
                          className={`${isMobile ? 'h-10 text-sm' : 'h-8 text-xs'} transition-all`}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          {presetType.charAt(0).toUpperCase() + presetType.slice(1)}
                        </Button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Auto-fills common details like transportation, safety requirements, and email templates
                  </p>
                </div>

                {/* Standard Form Fields */}
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

                {/* Email Template Customization */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Email Template</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmailTemplates(!showEmailTemplates)}
                      className="text-xs"
                    >
                      {showEmailTemplates ? 'Hide' : 'Customize'}
                    </Button>
                  </div>
                  
                  {showEmailTemplates && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-sm">Subject</Label>
                        <Input
                          value={emailTemplates[selectedTemplate as keyof typeof emailTemplates].subject}
                          readOnly
                          className="text-sm bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Message</Label>
                        <textarea
                          value={newLinkData.customMessage || emailTemplates[selectedTemplate as keyof typeof emailTemplates].message}
                          onChange={(e) => setNewLinkData({...newLinkData, customMessage: e.target.value})}
                          rows={3}
                          className="w-full p-2 text-sm border rounded-md bg-white"
                          placeholder="Custom message for the applicant..."
                        />
                      </div>
                    </div>
                  )}
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
                {filteredTokens.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {tokens.length === 0 ? 'No application links generated yet' : 'No links match your search'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTokens.map((token: any) => (
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
                              <div className="mt-2 space-y-2">
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => shareLink(token.applicationUrl, token.applicantEmail)}
                                    className="flex-1 h-10"
                                  >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(token.applicationUrl)}
                                    className="flex-1 h-10"
                                  >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy
                                  </Button>
                                </div>
                                <Link href={`/apply/${token.token}`} className="block">
                                  <Button size="sm" variant="ghost" className="w-full h-8 text-xs">
                                    <Eye className="mr-1 h-3 w-3" />
                                    Preview Form
                                  </Button>
                                </Link>
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
