import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, ArrowLeft } from "lucide-react";
import type { InsertApplication } from "@shared/schema";

interface StepTwoProps {
  formData: Partial<InsertApplication>;
  updateFormData: (data: Partial<InsertApplication>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function StepTwo({ formData, updateFormData, onNext, onPrevious }: StepTwoProps) {
  const handleInputChange = (field: keyof InsertApplication, value: string) => {
    updateFormData({ [field]: value });
  };

  const handlePhoneChange = (field: keyof InsertApplication, value: string) => {
    // Only allow digits and format as (XXX) XXX-XXXX
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length <= 10) {
      let formatted = digitsOnly;
      if (digitsOnly.length > 3) {
        formatted = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
      }
      if (digitsOnly.length > 6) {
        formatted = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
      }
      updateFormData({ [field]: formatted });
    }
  };

  const validateStep = () => {
    const required = ['mobileNumber', 'email', 'emergencyName', 'emergencyContact', 'emergencyRelationship'];
    const missing = required.filter(field => !formData[field as keyof InsertApplication]);
    
    if (missing.length > 0) {
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email || '')) {
      return false;
    }

    // Validate phone formats (10 digits)
    const mobileDigits = (formData.mobileNumber || '').replace(/\D/g, '');
    const emergencyDigits = (formData.emergencyContact || '').replace(/\D/g, '');
    
    if (mobileDigits.length !== 10 || emergencyDigits.length !== 10) {
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Phone className="mr-3 text-primary" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="mobileNumber">Mobile Number *</Label>
            <Input
              id="mobileNumber"
              placeholder="(XXX) XXX-XXXX"
              value={formData.mobileNumber || ""}
              onChange={(e) => handlePhoneChange("mobileNumber", e.target.value)}
              maxLength={14}
              required
            />
          </div>
          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              placeholder="(XXX) XXX-XXXX"
              value={formData.whatsappNumber || ""}
              onChange={(e) => handlePhoneChange("whatsappNumber", e.target.value)}
              maxLength={14}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Emergency Contact</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
              <Input
                id="emergencyName"
                value={formData.emergencyName || ""}
                onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact Number *</Label>
              <Input
                id="emergencyContact"
                placeholder="(XXX) XXX-XXXX"
                value={formData.emergencyContact || ""}
                onChange={(e) => handlePhoneChange("emergencyContact", e.target.value)}
                maxLength={14}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="emergencyRelationship">Relationship to Emergency Contact *</Label>
              <Input
                id="emergencyRelationship"
                placeholder="e.g., Spouse, Parent, Sibling"
                value={formData.emergencyRelationship || ""}
                onChange={(e) => handleInputChange("emergencyRelationship", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!validateStep()}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
