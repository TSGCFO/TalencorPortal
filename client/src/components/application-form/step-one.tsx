import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User, ArrowRight } from "lucide-react";
import type { InsertApplication } from "@shared/schema";

interface StepOneProps {
  formData: Partial<InsertApplication>;
  updateFormData: (data: Partial<InsertApplication>) => void;
  onNext: () => void;
}

export default function StepOne({ formData, updateFormData, onNext }: StepOneProps) {
  const handleInputChange = (field: keyof InsertApplication, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleSinChange = (value: string) => {
    // Only allow digits and format as XXX-XXX-XXX
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length <= 9) {
      let formatted = digitsOnly;
      if (digitsOnly.length > 3) {
        formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
      }
      if (digitsOnly.length > 6) {
        formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
      }
      updateFormData({ sinNumber: formatted });
    }
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
    const required = ['fullName', 'dateOfBirth', 'sinNumber', 'streetAddress', 'city', 'province', 'postalCode'];
    const missing = required.filter(field => !formData[field as keyof InsertApplication]);
    
    if (missing.length > 0) {
      return false;
    }

    // Validate SIN format (9 digits)
    const sinDigits = (formData.sinNumber || '').replace(/\D/g, '');
    if (sinDigits.length !== 9) {
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
          <User className="mr-3 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName || ""}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ""}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="sinNumber">SIN Number *</Label>
            <Input
              id="sinNumber"
              placeholder="XXX-XXX-XXX"
              value={formData.sinNumber || ""}
              onChange={(e) => handleSinChange(e.target.value)}
              maxLength={11}
              required
            />
          </div>
          <div>
            <Label htmlFor="streetAddress">Street Address *</Label>
            <Input
              id="streetAddress"
              value={formData.streetAddress || ""}
              onChange={(e) => handleInputChange("streetAddress", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="province">Province *</Label>
            <Select value={formData.province || ""} onValueChange={(value) => handleInputChange("province", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ON">Ontario</SelectItem>
                <SelectItem value="QC">Quebec</SelectItem>
                <SelectItem value="BC">British Columbia</SelectItem>
                <SelectItem value="AB">Alberta</SelectItem>
                <SelectItem value="MB">Manitoba</SelectItem>
                <SelectItem value="SK">Saskatchewan</SelectItem>
                <SelectItem value="NS">Nova Scotia</SelectItem>
                <SelectItem value="NB">New Brunswick</SelectItem>
                <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                <SelectItem value="PE">Prince Edward Island</SelectItem>
                <SelectItem value="NT">Northwest Territories</SelectItem>
                <SelectItem value="NU">Nunavut</SelectItem>
                <SelectItem value="YT">Yukon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              placeholder="A1A 1A1"
              value={formData.postalCode || ""}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="majorIntersection">Major Intersection *</Label>
            <Input
              id="majorIntersection"
              placeholder="e.g., King St & Queen St"
              value={formData.majorIntersection || ""}
              onChange={(e) => handleInputChange("majorIntersection", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleNext} disabled={!validateStep()}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
