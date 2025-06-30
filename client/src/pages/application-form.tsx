import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Home, CheckCircle } from "lucide-react";
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
      morningDays: formData.morningDays || [],
      afternoonDays: formData.afternoonDays || [],
      nightDays: formData.nightDays || [],
      aptitudeAnswers: formData.aptitudeAnswers || {},
      aptitudeScore: formData.aptitudeScore || 0,
    } as InsertApplication;

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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center">
              <FileText className="text-2xl text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Employment Application</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <CheckCircle className="text-6xl text-success mb-4 mx-auto" size={96} />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for submitting your application. Our team will review your information and contact you within 2-3 business days.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg text-left mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• You will receive a confirmation email shortly</li>
                  <li>• Our recruitment team will review your application</li>
                  <li>• We'll contact you if your profile matches our current opportunities</li>
                  <li>• Keep an eye on your email for updates</li>
                </ul>
              </div>
              <p className="text-sm text-gray-500">
                You may now close this window.
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <FileText className="text-2xl text-primary mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Employment Application</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        {renderCurrentStep()}
      </div>
    </div>
  );
}
