import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Home, CheckCircle } from "lucide-react";
import TalencorLogo from "@/components/talencor-logo";
import ProgressBar from "@/components/application-form/progress-bar";
import StepOne from "@/components/application-form/step-one";
import StepTwo from "@/components/application-form/step-two";
import StepThree from "@/components/application-form/step-three";
import StepFour from "@/components/application-form/step-four";
import StepFive from "@/components/application-form/step-five";
import StepSix from "@/components/application-form/step-six";
import StepSeven from "@/components/application-form/step-seven";
import StepEight from "@/components/application-form/step-eight";
import type { InsertApplication } from "@shared/schema";

const totalSteps = 8;

export default function ApplicationForm() {
  const { token } = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertApplication>>({});
  const { toast } = useToast();

  // Load saved progress from localStorage
  useEffect(() => {
    if (token) {
      const savedProgress = localStorage.getItem(`application-progress-${token}`);
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          setCurrentStep(parsed.currentStep || 1);
          setFormData(parsed.formData || {});
          toast({
            title: "Progress Restored",
            description: "Your previous progress has been restored.",
          });
        } catch (error) {
          console.error("Error loading saved progress:", error);
        }
      }
    }
  }, [token, toast]);

  // Save progress to localStorage whenever formData or currentStep changes
  useEffect(() => {
    if (token && (Object.keys(formData).length > 0 || currentStep > 1)) {
      const progressData = {
        currentStep,
        formData,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(`application-progress-${token}`, JSON.stringify(progressData));
    }
  }, [formData, currentStep, token]);

  const { data: tokenData, isLoading: isValidating, error } = useQuery({
    queryKey: ["/api/validate-token", token],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/validate-token", { token });
      return response.json();
    },
    enabled: !!token,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertApplication) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Your application has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    }
  });

  const updateFormData = (stepData: Partial<InsertApplication>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const validateCurrentStep = (): boolean => {
    // Basic validation logic for each step
    switch (currentStep) {
      case 1:
        return !!(formData.fullName && formData.dateOfBirth && formData.sinNumber && 
                 formData.streetAddress && formData.city && formData.province && 
                 formData.postalCode && formData.majorIntersection);
      case 2:
        return !!(formData.mobileNumber && formData.email && formData.emergencyName && 
                 formData.emergencyContact && formData.emergencyRelationship);
      case 3:
        return !!formData.legalStatus;
      case 4:
        return !!(formData.transportation && formData.hasSafetyShoes !== undefined && 
                 formData.hasForklifCert !== undefined && formData.backgroundCheckConsent !== undefined);
      case 5:
        return !!formData.liftingCapability;
      case 6:
        return !!(formData.jobType && formData.commitmentMonths && formData.referralSource);
      case 7:
        return !!(formData.aptitudeAnswers && formData.aptitudeScore !== undefined);
      case 8:
        return !!(formData.agreementName && formData.agreementDate && formData.termsAccepted);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Incomplete Step",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Incomplete Application",
        description: "Please complete all required fields.",
        variant: "destructive",
      });
      return;
    }

    const completeData: InsertApplication = {
      ...formData,
      tokenId: token!,
      recruiterEmail: tokenData?.tokenData?.recruiterEmail || '',
      jobType: tokenData?.tokenData?.jobType || 'general',
      morningDays: formData.morningDays || [],
      afternoonDays: formData.afternoonDays || [],
      nightDays: formData.nightDays || [],
      aptitudeAnswers: formData.aptitudeAnswers || {},
      aptitudeScore: formData.aptitudeScore || 0,
      // Convert date strings to Date objects with proper validation
      dateOfBirth: formData.dateOfBirth 
        ? (formData.dateOfBirth instanceof Date ? formData.dateOfBirth : new Date(formData.dateOfBirth))
        : new Date('1990-01-01'), // Default date if missing
      agreementDate: formData.agreementDate 
        ? (formData.agreementDate instanceof Date ? formData.agreementDate : new Date(formData.agreementDate))
        : new Date(), // Current date as default for agreement
    } as InsertApplication;

    // Clear saved progress on successful submission
    localStorage.removeItem(`application-progress-${token}`);
    
    submitMutation.mutate(completeData);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p>Validating application link...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !tokenData?.valid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Invalid Link</h2>
            <p className="text-gray-600 mb-4">
              This application link is invalid or has expired. Please contact your recruiter for a new link.
            </p>
            <p className="text-sm text-gray-500">
              Please contact the recruiter for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-bg">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
        
        <div className="relative z-10 glass-effect shadow-lg border-b border-white/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center">
              <TalencorLogo size="lg" />
            </div>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
          <Card className="modern-card text-center p-12 animate-fade-in">
            <CardContent className="pt-6">
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-20"></div>
                <CheckCircle className="relative text-success mb-4 mx-auto animate-pulse-subtle" size={120} />
              </div>
              <h2 className="text-4xl font-bold text-gradient mb-4">Application Submitted Successfully!</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Thank you for submitting your application. Our team will review your information and contact you within 2-3 business days.
              </p>
              <div className="talencor-gradient-subtle p-6 rounded-xl text-left mb-8 border border-blue-200">
                <h3 className="font-bold text-primary text-lg mb-3">What Happens Next:</h3>
                <ul className="text-base text-foreground space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span>You will receive a confirmation email shortly</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span>Our recruitment team will review your application</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span>We'll contact you if your profile matches our current opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span>Keep an eye on your email for updates</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                You may now close this window or return to the home page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      onNext: handleNext,
      onPrevious: handlePrevious,
    };

    switch (currentStep) {
      case 1:
        return <StepOne {...stepProps} />;
      case 2:
        return <StepTwo {...stepProps} />;
      case 3:
        return <StepThree {...stepProps} />;
      case 4:
        return <StepFour {...stepProps} />;
      case 5:
        return <StepFive {...stepProps} />;
      case 6:
        return <StepSix {...stepProps} />;
      case 7:
        return <StepSeven {...stepProps} />;
      case 8:
        return <StepEight {...stepProps} onSubmit={handleSubmit} isSubmitting={submitMutation.isPending} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-40 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute bottom-40 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '6s' }}></div>
        </div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 glass-effect shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <TalencorLogo size="md" />
            <h1 className="text-3xl font-bold text-gradient ml-4">Employment Application</h1>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>
        <div className="animate-slide-up">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}
