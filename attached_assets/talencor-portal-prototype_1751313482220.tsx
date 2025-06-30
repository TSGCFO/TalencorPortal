import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Upload, Users, FileText, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Demo App Component
const TalentCorePortal = () => {
  const [currentView, setCurrentView] = useState('home');
  const [applications, setApplications] = useState([]);
  const [generatedLinks, setGeneratedLinks] = useState([]);

  // Home/Landing Page
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TalentCore Staffing</h1>
          <p className="text-xl text-gray-600 mb-8">Secure Employment Application Portal</p>
          
          <div className="flex justify-center space-x-4">
            <Button onClick={() => setCurrentView('recruiter')} className="bg-blue-600 hover:bg-blue-700">
              <Users className="mr-2 h-4 w-4" />
              Recruiter Dashboard
            </Button>
            <Button 
              onClick={() => setCurrentView('apply')} 
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <FileText className="mr-2 h-4 w-4" />
              Demo Application Form
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" />
                Secure Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Token-based secure links ensure only authorized applicants can access forms.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-600" />
                Complete Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Comprehensive form with enhanced UX while maintaining all required fields.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-purple-600" />
                Integrated Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Built-in aptitude test with automatic scoring and evaluation.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Recruiter Dashboard
  const RecruiterDashboard = () => {
    const [newLinkData, setNewLinkData] = useState({
      applicantEmail: '',
      recruiterEmail: 'recruiter@talentcore.com'
    });

    const generateSecureLink = () => {
      const token = 'tk_' + Math.random().toString(36).substr(2, 16);
      const newLink = {
        id: Date.now(),
        token,
        applicantEmail: newLinkData.applicantEmail,
        recruiterEmail: newLinkData.recruiterEmail,
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        link: `https://portal.talentcore.com/apply/${token}`
      };
      
      setGeneratedLinks([newLink, ...generatedLinks]);
      setNewLinkData({ ...newLinkData, applicantEmail: '' });
      
      // Simulate email sending
      alert(`Secure application link sent to ${newLinkData.applicantEmail}\n\nLink: ${newLink.link}\n\nThis would normally be sent via email service.`);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
              <Button variant="outline" onClick={() => setCurrentView('home')}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Generate New Link */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Secure Application Link</CardTitle>
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
                  onClick={generateSecureLink}
                  disabled={!newLinkData.applicantEmail}
                  className="w-full"
                >
                  Generate & Send Secure Link
                </Button>
              </CardContent>
            </Card>

            {/* Applications Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No applications submitted yet</p>
                ) : (
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((app) => (
                      <Card key={app.id} className="p-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-lg">{app.fullName}</h4>
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
                        
                        <div className="mt-3 pt-3 border-t">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div>
                              <span className="font-medium">Safety Shoes:</span>
                              <span className="ml-1">{app.hasSafetyShoes ? `Yes (${app.safetyShoeType})` : 'No'}</span>
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
                              <span className="ml-1">{app.uploadedDocuments?.length || 0} files</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generated Links */}
          {generatedLinks.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Generated Application Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedLinks.map((link) => (
                    <div key={link.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{link.applicantEmail}</p>
                          <p className="text-sm text-gray-600 font-mono">{link.link}</p>
                          <p className="text-xs text-gray-500">
                            Generated: {new Date(link.generatedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs ${
                            link.used ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {link.used ? 'Used' : 'Active'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Expires: {new Date(link.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setCurrentView('apply')}
                      >
                        Preview Application Form
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  // Application Form Component
  const ApplicationForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
      // Personal Information
      fullName: '',
      dateOfBirth: '',
      sinNumber: '',
      streetAddress: '',
      city: '',
      province: '',
      postalCode: '',
      majorIntersection: '',
      
      // Contact Information
      mobileNumber: '',
      whatsappNumber: '',
      email: '',
      emergencyName: '',
      emergencyContact: '',
      emergencyRelationship: '',
      
      // Legal Status & Education
      legalStatus: '',
      classSchedule: {
        mon: '', tue: '', wed: '', thurs: '', fri: '', sat: '', sun: ''
      },
      
      // Transportation & Equipment
      transportation: '',
      hasSafetyShoes: false,
      safetyShoeType: '',
      hasForklifCert: false,
      forkliftValidity: '',
      backgroundCheckConsent: false,
      
      // Work History
      lastCompanyName: '',
      companyType: '',
      jobResponsibilities: '',
      agencyOrDirect: '',
      reasonForLeaving: '',
      
      // Physical & Job Preferences
      liftingCapability: '',
      jobType: '',
      commitmentMonths: '',
      morningDays: [],
      afternoonDays: [],
      nightDays: [],
      
      // Referral
      referralSource: '',
      referralPersonName: '',
      referralPersonContact: '',
      referralRelationship: '',
      referralInternetSource: '',
      
      // Aptitude Test
      aptitudeAnswers: {},
      
      // Documents
      uploadedDocuments: [],
      
      // Terms and Agreement
      agreementName: '',
      agreementDate: '',
      termsAccepted: false
    });
    
    const [validationErrors, setValidationErrors] = useState({});

    const totalSteps = 7; // Added document upload step
    const progress = (currentStep / totalSteps) * 100;

    // Validation functions
    const validateFullName = (name) => {
      const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
      if (!name.trim()) return "Full name is required";
      if (name.trim().length < 2) return "Full name must be at least 2 characters";
      if (!nameRegex.test(name)) return "Full name can only contain letters, spaces, hyphens, and apostrophes";
      return "";
    };

    const validateSIN = (sin) => {
      const sinClean = sin.replace(/\D/g, '');
      if (!sinClean) return "Social Insurance Number is required";
      if (sinClean.length !== 9) return "SIN must be exactly 9 digits";
      return "";
    };

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) return "Email is required";
      if (!emailRegex.test(email)) return "Please enter a valid email address";
      return "";
    };

    const validatePhone = (phone) => {
      const phoneClean = phone.replace(/\D/g, '');
      if (!phone.trim()) return "Phone number is required";
      if (phoneClean.length !== 10) return "Phone number must be 10 digits";
      return "";
    };

    const validatePostalCode = (postal) => {
      const postalRegex = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;
      if (!postal.trim()) return "Postal code is required";
      if (!postalRegex.test(postal)) return "Please enter a valid Canadian postal code (A1A 1A1)";
      return "";
    };

    const formatSIN = (value) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 9)}`;
    };

    const formatPhone = (value) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    };

    const formatPostalCode = (value) => {
      const clean = value.replace(/\s/g, '').toUpperCase();
      if (clean.length <= 3) return clean;
      return `${clean.slice(0, 3)} ${clean.slice(3, 6)}`;
    };

    const aptitudeQuestions = [
      {
        id: 1,
        question: "How many vacation days do I _____ left this year?",
        options: ["have", "has"],
        correct: "have"
      },
      {
        id: 2,
        question: "At _____ hotel will I be staying during the conference?",
        options: ["which", "what"],
        correct: "which"
      },
      {
        id: 3,
        question: "Don't forget that the deadline _____ coming up in three days.",
        options: ["is", "be"],
        correct: "is"
      },
      {
        id: 4,
        question: "Is the firm's disaster plan sufficient to ensure that we are prepared _____ a hurricane?",
        options: ["from", "for"],
        correct: "for"
      },
      {
        id: 5,
        question: "Employees should not perform safety assessments alone. We need to assign them to work in _____.",
        options: ["pairs", "pares"],
        correct: "pairs"
      },
      {
        id: 6,
        question: "Your company has 200 employees. You have received 180 responses to the company's employee satisfaction surveys. What percent of the workforce participated in the survey?",
        options: ["75%", "90%"],
        correct: "90%"
      },
      {
        id: 7,
        question: "Employees are awarded 10 days of personal time off (PTO) on January 1 of each year. Sam missed three days of work in February because of an illness and he took four days off to go on a trip during June. On October 1, Sam asks you how many PTO days he has left to use between the present time and December 31?",
        options: ["3 days", "5 days"],
        correct: "3 days"
      },
      {
        id: 8,
        question: "You are responsible for making sure to keep half as many laser cartridges on hand as there are always printers in your facility to minimize the risk of ever being unable to replace an empty cartridge when a machine runs out of toner. Your company has 16 printers. When you are preparing the office supply order, you notice that there are 3 toner cartridges in the supply closet. How many toner cartridges do you need to order?",
        options: ["5 toner cartridges", "8 toner cartridges"],
        correct: "5 toner cartridges"
      },
      {
        id: 9,
        question: "A customer purchases 15 widgets that cost $13 each. The applicable sales tax rate is 9 percent. What is the total cost of the customer's order?",
        options: ["$212.55", "$215.75"],
        correct: "$212.55"
      },
      {
        id: 10,
        question: "Employees at your company pay 2.4 percent of their weekly salary for long-term disability insurance coverage. An employee who earns a weekly salary of $575 asks you how much will be deducted from his pay each week if he purchases the coverage?",
        options: ["$13.80", "$18.30"],
        correct: "$13.80"
      }
    ];

    const updateFormData = (field, value) => {
      // Format certain fields
      let formattedValue = value;
      if (field === 'sinNumber') {
        formattedValue = formatSIN(value);
      } else if (field === 'mobileNumber' || field === 'whatsappNumber' || field === 'emergencyContact' || field === 'referralPersonContact') {
        formattedValue = formatPhone(value);
      } else if (field === 'postalCode') {
        formattedValue = formatPostalCode(value);
      }
      
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
      
      // Clear validation error when user starts typing
      if (validationErrors[field]) {
        setValidationErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

    const validateCurrentStep = () => {
      const errors = {};
      
      if (currentStep === 1) {
        errors.fullName = validateFullName(formData.fullName);
        errors.sinNumber = validateSIN(formData.sinNumber);
        errors.postalCode = validatePostalCode(formData.postalCode);
        if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
        if (!formData.streetAddress.trim()) errors.streetAddress = "Street address is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.province) errors.province = "Province is required";
        if (!formData.majorIntersection.trim()) errors.majorIntersection = "Major intersection is required";
      } else if (currentStep === 2) {
        errors.mobileNumber = validatePhone(formData.mobileNumber);
        errors.email = validateEmail(formData.email);
        errors.emergencyName = validateFullName(formData.emergencyName);
        errors.emergencyContact = validatePhone(formData.emergencyContact);
        if (!formData.emergencyRelationship.trim()) errors.emergencyRelationship = "Emergency relationship is required";
      } else if (currentStep === 3) {
        if (!formData.legalStatus) errors.legalStatus = "Legal status is required";
        if (!formData.transportation) errors.transportation = "Transportation method is required";
      } else if (currentStep === 4) {
        if (!formData.liftingCapability) errors.liftingCapability = "Lifting capability is required";
      } else if (currentStep === 5) {
        if (!formData.jobType) errors.jobType = "Job type preference is required";
        if (!formData.commitmentMonths) errors.commitmentMonths = "Commitment period is required";
        if (!formData.referralSource) errors.referralSource = "Referral source is required";
      } else if (currentStep === 7) {
        if (!formData.agreementName.trim()) errors.agreementName = "Digital signature (full name) is required";
        if (!formData.agreementDate) errors.agreementDate = "Agreement date is required";
        if (!formData.termsAccepted) errors.termsAccepted = "You must agree to the terms and conditions";
      }
      
      const validErrors = Object.fromEntries(
        Object.entries(errors).filter(([_, value]) => value !== '')
      );
      
      setValidationErrors(validErrors);
      return Object.keys(validErrors).length === 0;
    };

    const calculateAptitudeScore = () => {
      let score = 0;
      aptitudeQuestions.forEach(q => {
        if (formData.aptitudeAnswers[q.id] === q.correct) {
          score++;
        }
      });
      return score;
    };

    const submitApplication = () => {
      const score = calculateAptitudeScore();
      const application = {
        id: Date.now(),
        ...formData,
        aptitudeScore: score,
        submittedAt: new Date().toISOString(),
        status: 'completed'
      };
      
      setApplications(prev => [application, ...prev]);
      
      // Mark the link as used (simulate)
      const currentLink = generatedLinks.find(link => !link.used);
      if (currentLink) {
        setGeneratedLinks(prev => 
          prev.map(link => 
            link.id === currentLink.id 
              ? { ...link, used: true, usedAt: new Date().toISOString() }
              : link
          )
        );
      }
      
      alert(`Application submitted successfully!\n\nYour application has been received and stored in our database.\nA recruiter will review your application and contact you soon.\n\nThank you for applying with TalentCore Staffing!`);
      setCurrentView('home');
    };

    const renderStep = () => {
      switch(currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">*Full Name (as per passport)</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value.toUpperCase())}
                    placeholder="FULL NAME"
                    className={`uppercase ${validationErrors.fullName ? 'border-red-500' : ''}`}
                    required
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">*Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                    className={validationErrors.dateOfBirth ? 'border-red-500' : ''}
                    required
                  />
                  {validationErrors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.dateOfBirth}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="sinNumber">*Social Insurance Number</Label>
                  <Input
                    id="sinNumber"
                    value={formData.sinNumber}
                    onChange={(e) => updateFormData('sinNumber', e.target.value)}
                    placeholder="123-456-789"
                    maxLength="11"
                    className={validationErrors.sinNumber ? 'border-red-500' : ''}
                    required
                  />
                  {validationErrors.sinNumber && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.sinNumber}</p>
                  )}
                </div>
              </div>
              
              <h4 className="text-md font-medium mt-6 mb-3">*Current Address</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="streetAddress">*Street Address</Label>
                  <Input
                    id="streetAddress"
                    value={formData.streetAddress}
                    onChange={(e) => updateFormData('streetAddress', e.target.value.toUpperCase())}
                    placeholder="STREET ADDRESS"
                    className={`uppercase ${validationErrors.streetAddress ? 'border-red-500' : ''}`}
                    required
                  />
                  {validationErrors.streetAddress && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.streetAddress}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city">*City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value.toUpperCase())}
                    placeholder="CITY"
                    className={`uppercase ${validationErrors.city ? 'border-red-500' : ''}`}
                    required
                  />
                  {validationErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="province">*Province</Label>
                  <Select onValueChange={(value) => updateFormData('province', value)}>
                    <SelectTrigger className={validationErrors.province ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ON">Ontario</SelectItem>
                      <SelectItem value="BC">British Columbia</SelectItem>
                      <SelectItem value="AB">Alberta</SelectItem>
                      <SelectItem value="MB">Manitoba</SelectItem>
                      <SelectItem value="SK">Saskatchewan</SelectItem>
                      <SelectItem value="QC">Quebec</SelectItem>
                      <SelectItem value="NB">New Brunswick</SelectItem>
                      <SelectItem value="NS">Nova Scotia</SelectItem>
                      <SelectItem value="PE">Prince Edward Island</SelectItem>
                      <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                      <SelectItem value="YT">Yukon</SelectItem>
                      <SelectItem value="NT">Northwest Territories</SelectItem>
                      <SelectItem value="NU">Nunavut</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.province && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.province}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="postalCode">*Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => updateFormData('postalCode', e.target.value)}
                    placeholder="A1A 1A1"
                    className={`uppercase ${validationErrors.postalCode ? 'border-red-500' : ''}`}
                    maxLength="7"
                    required
                  />
                  {validationErrors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.postalCode}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="majorIntersection">*Major Intersection</Label>
                  <Input
                    id="majorIntersection"
                    value={formData.majorIntersection}
                    onChange={(e) => updateFormData('majorIntersection', e.target.value.toUpperCase())}
                    placeholder="MAJOR INTERSECTION"
                    className={`uppercase ${validationErrors.majorIntersection ? 'border-red-500' : ''}`}
                    required
                  />
                  {validationErrors.majorIntersection && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.majorIntersection}</p>
                  )}
                </div>
              </div>
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Contact & Emergency Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mobileNumber">*Mobile Number</Label>
                  <Input
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={(e) => updateFormData('mobileNumber', e.target.value)}
                    placeholder="123-456-7890"
                    className={validationErrors.mobileNumber ? 'border-red-500' : ''}
                    required
                  />
                  {validationErrors.mobileNumber && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.mobileNumber}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                  <Input
                    id="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={(e) => updateFormData('whatsappNumber', e.target.value)}
                    placeholder="123-456-7890"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">*Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value.toLowerCase())}
                    placeholder="email@example.com"
                    className={validationErrors.email ? 'border-red-500' : ''}
                    required
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              <h4 className="text-md font-medium mt-6 mb-3">*Emergency Contact</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyName">*Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyName}
                    onChange={(e) => updateFormData('emergencyName', e.target.value.toUpperCase())}
                    placeholder="EMERGENCY CONTACT NAME"
                    className={`uppercase ${validationErrors.emergencyName ? 'border-red-500' : ''}`}
                    required
                  />
                  {validationErrors.emergencyName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.emergencyName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="emergencyContact">*Contact Number</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                    placeholder="123-456-7890"
                    className={validationErrors.emergencyContact ? 'border-red-500' : ''}
                    required
                  />
                  {validationErrors.emergencyContact && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.emergencyContact}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="emergencyRelationship">*Relationship</Label>
                  <Input
                    id="emergencyRelationship"
                    value={formData.emergencyRelationship}
                    onChange={(e) => updateFormData('emergencyRelationship', e.target.value.toUpperCase())}
                    placeholder="RELATIONSHIP"
                    className={`uppercase ${validationErrors.emergencyRelationship ? 'border-red-500' : ''}`}
                    required
                  />
                  {validationErrors.emergencyRelationship && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.emergencyRelationship}</p>
                  )}
                </div>
              </div>
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Legal Status & Transportation</h3>
              
              <div>
                <Label>*Legal Status</Label>
                <RadioGroup 
                  value={formData.legalStatus} 
                  onValueChange={(value) => updateFormData('legalStatus', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Work Permit" id="workpermit" />
                    <Label htmlFor="workpermit">Work Permit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PR" id="pr" />
                    <Label htmlFor="pr">PR</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Citizen" id="citizen" />
                    <Label htmlFor="citizen">Citizen</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
                {validationErrors.legalStatus && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.legalStatus}</p>
                )}
              </div>

              {formData.legalStatus === 'Student' && (
                <div>
                  <Label>*Class Schedule with Timings</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {['mon', 'tue', 'wed', 'thurs', 'fri', 'sat', 'sun'].map((day) => (
                      <div key={day}>
                        <Label htmlFor={day} className="text-sm capitalize">{day === 'thurs' ? 'Thursday' : day}:</Label>
                        <Input
                          id={day}
                          value={formData.classSchedule[day]}
                          onChange={(e) => updateFormData('classSchedule', {...formData.classSchedule, [day]: e.target.value})}
                          placeholder="9:00-11:00"
                          className="text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>*Mode of Transportation (Mark only one)</Label>
                <RadioGroup 
                  value={formData.transportation} 
                  onValueChange={(value) => updateFormData('transportation', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Car" id="car" />
                    <Label htmlFor="car">Car</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Transit" id="transit" />
                    <Label htmlFor="transit">Transit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ride" id="ride" />
                    <Label htmlFor="ride">Ride</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="transportOther" />
                    <Label htmlFor="transportOther">Other</Label>
                  </div>
                </RadioGroup>
                {validationErrors.transportation && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.transportation}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Do you have safety shoes?</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hasSafetyShoes"
                        checked={formData.hasSafetyShoes}
                        onCheckedChange={(checked) => updateFormData('hasSafetyShoes', checked)}
                      />
                      <Label htmlFor="hasSafetyShoes">Yes</Label>
                    </div>
                    
                    {formData.hasSafetyShoes && (
                      <RadioGroup 
                        value={formData.safetyShoeType} 
                        onValueChange={(value) => updateFormData('safetyShoeType', value)}
                        className="ml-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="High Ankle" id="highankle" />
                          <Label htmlFor="highankle">High Ankle</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Normal" id="normal" />
                          <Label htmlFor="normal">Normal</Label>
                        </div>
                      </RadioGroup>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Forklift Certification</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hasForklifCert"
                        checked={formData.hasForklifCert}
                        onCheckedChange={(checked) => updateFormData('hasForklifCert', checked)}
                      />
                      <Label htmlFor="hasForklifCert">Yes</Label>
                    </div>
                    
                    {formData.hasForklifCert && (
                      <div className="ml-6 mt-2">
                        <Label htmlFor="forkliftValidity">Validity Date</Label>
                        <Input
                          id="forkliftValidity"
                          type="date"
                          value={formData.forkliftValidity}
                          onChange={(e) => updateFormData('forkliftValidity', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="backgroundCheckConsent"
                    checked={formData.backgroundCheckConsent}
                    onCheckedChange={(checked) => updateFormData('backgroundCheckConsent', checked)}
                  />
                  <Label htmlFor="backgroundCheckConsent">Do you provide your consent to perform a criminal background check?</Label>
                </div>
              </div>
            </div>
          );

        case 4:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Work History & Physical Capabilities</h3>
              
              <div>
                <h4 className="text-md font-medium mb-3">Last Work History</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="lastCompanyName">Name of the company you worked at</Label>
                    <Input
                      id="lastCompanyName"
                      value={formData.lastCompanyName}
                      onChange={(e) => updateFormData('lastCompanyName', e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyType">Type of company it was</Label>
                    <Input
                      id="companyType"
                      value={formData.companyType}
                      onChange={(e) => updateFormData('companyType', e.target.value)}
                      placeholder="Manufacturing, Retail, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobResponsibilities">Job Responsibilities</Label>
                    <Textarea
                      id="jobResponsibilities"
                      value={formData.jobResponsibilities}
                      onChange={(e) => updateFormData('jobResponsibilities', e.target.value)}
                      placeholder="Describe your job responsibilities"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="agencyOrDirect">Agency you worked through or a direct hire</Label>
                    <Input
                      id="agencyOrDirect"
                      value={formData.agencyOrDirect}
                      onChange={(e) => updateFormData('agencyOrDirect', e.target.value)}
                      placeholder="Agency name or 'Direct hire'"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reasonForLeaving">Reason for leaving the job</Label>
                    <Textarea
                      id="reasonForLeaving"
                      value={formData.reasonForLeaving}
                      onChange={(e) => updateFormData('reasonForLeaving', e.target.value)}
                      placeholder="Reason for leaving"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>*Lifting Capability</Label>
                <RadioGroup 
                  value={formData.liftingCapability} 
                  onValueChange={(value) => updateFormData('liftingCapability', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5-10 kgs" id="lift1" />
                    <Label htmlFor="lift1">5-10 kgs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15-20 kgs" id="lift2" />
                    <Label htmlFor="lift2">15-20 kgs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="25-30 kgs" id="lift3" />
                    <Label htmlFor="lift3">25-30 kgs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="35-40 kgs" id="lift4" />
                    <Label htmlFor="lift4">35-40 kgs</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          );

        case 5:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Job Preferences & Availability</h3>
              
              <div>
                <Label>*You're looking for a</Label>
                <RadioGroup 
                  value={formData.jobType} 
                  onValueChange={(value) => updateFormData('jobType', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Short-term job" id="shortterm" />
                    <Label htmlFor="shortterm">Short-term job</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Long-term job" id="longterm" />
                    <Label htmlFor="longterm">Long-term job</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="On-call shifts only" id="oncall" />
                    <Label htmlFor="oncall">On-call shifts only</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="commitmentMonths">*Please mention the number of months you can commit for the same job</Label>
                <Input
                  id="commitmentMonths"
                  type="number"
                  value={formData.commitmentMonths}
                  onChange={(e) => updateFormData('commitmentMonths', e.target.value)}
                  placeholder="Number of months"
                  min="1"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>*Available days for a particular shift</Label>
                <div className="mt-3 space-y-4">
                  {[
                    { key: 'morningDays', label: 'Morning' },
                    { key: 'afternoonDays', label: 'Afternoon' },
                    { key: 'nightDays', label: 'Night' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <Label className="font-medium">{label}:</Label>
                      <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <div key={day} className="flex items-center space-x-1">
                            <Checkbox 
                              id={`${key}-${day}`}
                              checked={formData[key].includes(day)}
                              onCheckedChange={(checked) => {
                                const current = formData[key];
                                if (checked) {
                                  updateFormData(key, [...current, day]);
                                } else {
                                  updateFormData(key, current.filter(d => d !== day));
                                }
                              }}
                            />
                            <Label htmlFor={`${key}-${day}`} className="text-sm">
                              {day.slice(0, 3)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>*How did you come to know about our agency?</Label>
                <RadioGroup 
                  value={formData.referralSource} 
                  onValueChange={(value) => updateFormData('referralSource', value)}
                  className="mt-2 space-y-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Person" id="person" />
                      <Label htmlFor="person">A person</Label>
                    </div>
                    {formData.referralSource === 'Person' && (
                      <div className="ml-6 mt-2 grid md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Name"
                          value={formData.referralPersonName}
                          onChange={(e) => updateFormData('referralPersonName', e.target.value)}
                        />
                        <Input
                          placeholder="Contact Number"
                          value={formData.referralPersonContact}
                          onChange={(e) => updateFormData('referralPersonContact', e.target.value)}
                        />
                        <Input
                          placeholder="Relationship"
                          value={formData.referralRelationship}
                          onChange={(e) => updateFormData('referralRelationship', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Internet" id="internet" />
                      <Label htmlFor="internet">Internet</Label>
                    </div>
                    {formData.referralSource === 'Internet' && (
                      <div className="ml-6 mt-2 grid grid-cols-3 md:grid-cols-5 gap-2">
                        {['Google', 'Facebook', 'Instagram', 'Telegram', 'LinkedIn', 'TikTok', 'Indeed', 'Kijiji', 'Other'].map((source) => (
                          <div key={source} className="flex items-center space-x-1">
                            <Checkbox 
                              id={`internet-${source}`}
                              checked={formData.referralInternetSource === source}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateFormData('referralInternetSource', source);
                                }
                              }}
                            />
                            <Label htmlFor={`internet-${source}`} className="text-sm">{source}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </div>
            </div>
          );

        case 6:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Document Upload</h3>
              <p className="text-gray-600 mb-6">
                Please upload any supporting documents such as your resume, references, certifications, or other relevant documents.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">Drop files here or click to browse</p>
                  <p className="text-sm text-gray-500">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                  </p>
                </div>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  id="documentUpload"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const newDocs = files.map(file => ({
                      id: Date.now() + Math.random(),
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      file
                    }));
                    updateFormData('uploadedDocuments', [...formData.uploadedDocuments, ...newDocs]);
                  }}
                />
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => document.getElementById('documentUpload')?.click()}
                >
                  Select Files
                </Button>
              </div>

              {formData.uploadedDocuments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Uploaded Documents:</h4>
                  {formData.uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updatedDocs = formData.uploadedDocuments.filter(d => d.id !== doc.id);
                          updateFormData('uploadedDocuments', updatedDocs);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Document upload is optional but recommended. You can always submit additional documents later if needed.
                </AlertDescription>
              </Alert>
            </div>
          );

        case 7:
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">General Aptitude Test</h3>
                <p className="text-gray-600">Please answer all 10 questions. Select the best answer for each question.</p>
              </div>
              
              <div className="space-y-6">
                {aptitudeQuestions.map((question) => (
                  <Card key={question.id} className="p-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">
                        {question.id}. {question.question}
                      </h4>
                      <RadioGroup 
                        value={formData.aptitudeAnswers[question.id] || ''} 
                        onValueChange={(value) => {
                          updateFormData('aptitudeAnswers', {
                            ...formData.aptitudeAnswers,
                            [question.id]: value
                          });
                        }}
                      >
                        {question.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`q${question.id}-${index}`} />
                            <Label htmlFor={`q${question.id}-${index}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Terms and Agreement Section */}
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-blue-800 mb-4">Agreement and Terms</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="agreementName">*Full Name (Digital Signature)</Label>
                      <Input
                        id="agreementName"
                        value={formData.agreementName}
                        onChange={(e) => updateFormData('agreementName', e.target.value.toUpperCase())}
                        placeholder="TYPE YOUR FULL NAME HERE"
                        className={`uppercase ${validationErrors.agreementName ? 'border-red-500' : ''}`}
                        required
                      />
                      {validationErrors.agreementName && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.agreementName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="agreementDate">*Date</Label>
                      <Input
                        id="agreementDate"
                        type="date"
                        value={formData.agreementDate}
                        onChange={(e) => updateFormData('agreementDate', e.target.value)}
                        className={validationErrors.agreementDate ? 'border-red-500' : ''}
                        required
                      />
                      {validationErrors.agreementDate && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.agreementDate}</p>
                      )}
                    </div>

                    <div className="bg-white p-4 rounded border text-sm">
                      <p className="mb-4">
                        I <strong>{formData.agreementName || '_____________________'}</strong> have filled this employment form by myself and all the information provided in this form is correct & up to date to the best of my knowledge, & all the supporting documents provided are authentic and I understand that any misrepresentation may disqualify me from employment or may lead to legal action, if needed. I have properly read & I agree to abide by all the listed terms and conditions of employment with TalentCore Staffing.
                      </p>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="termsAccepted"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => updateFormData('termsAccepted', checked)}
                        className="mt-1"
                      />
                      <Label htmlFor="termsAccepted" className="text-sm">
                        *I agree to the above statement and all terms and conditions of employment with TalentCore Staffing.
                      </Label>
                    </div>
                    {validationErrors.termsAccepted && (
                      <p className="text-red-500 text-sm">{validationErrors.termsAccepted}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please review all your answers and agreement before submitting. Once submitted, you cannot modify your responses.
                </AlertDescription>
              </Alert>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TalentCore Staffing</h1>
                <p className="text-sm text-gray-600">Employment Application Form</p>
              </div>
              <Button variant="outline" onClick={() => setCurrentView('home')}>
                Exit Application
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            {/* Form Content */}
            <Card className="mb-8">
              <CardContent className="p-8">
                {renderStep()}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button 
                  onClick={() => {
                    if (validateCurrentStep()) {
                      setCurrentStep(prev => prev + 1);
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    if (validateCurrentStep() && Object.keys(formData.aptitudeAnswers).length === 10) {
                      submitApplication();
                    } else if (Object.keys(formData.aptitudeAnswers).length !== 10) {
                      alert('Please answer all 10 aptitude test questions before submitting.');
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Application
                </Button>
              )}
            </div>

            {/* Terms and Conditions Display */}
            <Card className="mt-8 border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-orange-800 mb-3">Terms and Conditions for Employment:</h4>
                <ul className="space-y-2 text-sm text-orange-700">
                  <li>• <strong>Don't walk off the job.</strong> If you are not satisfied or if any issue arises, then complete your full shift, and call us the next day during our office hours before your next shift. If you walk off the floor, then you will be <strong>BLACKLISTED FROM OUR END.</strong></li>
                  <li>• In case of an accident, you <strong>MUST</strong> call our <strong>office number</strong> i.e., <strong>647-946-2177</strong> & if your call doesn't connect or doesn't get answered on that number due to any reason, please call on our <strong>emergency cell number</strong> i.e., <strong>647-518-2885</strong> immediately.</li>
                </ul>
                <p className="text-xs text-orange-600 mt-4">
                  <em>Note: Full agreement and digital signature will be required in the final step of the application.</em>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Main App Router
  return (
    <div className="min-h-screen">
      {currentView === 'home' && <HomePage />}
      {currentView === 'recruiter' && <RecruiterDashboard />}
      {currentView === 'apply' && <ApplicationForm />}
    </div>
  );
};

export default TalentCorePortal;