import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car, ArrowRight, ArrowLeft } from "lucide-react";
import type { InsertApplication } from "@shared/schema";

interface StepFourProps {
  formData: Partial<InsertApplication>;
  updateFormData: (data: Partial<InsertApplication>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function StepFour({ formData, updateFormData, onNext, onPrevious }: StepFourProps) {
  const handleTransportationChange = (value: string) => {
    updateFormData({ transportation: value });
  };

  const handleSafetyShoesChange = (value: string) => {
    const hasSafetyShoes = value === "yes";
    updateFormData({ 
      hasSafetyShoes,
      safetyShoeType: hasSafetyShoes ? formData.safetyShoeType : undefined
    });
  };

  const handleForkliftChange = (value: string) => {
    const hasForklifCert = value === "yes";
    updateFormData({ 
      hasForklifCert,
      forkliftValidity: hasForklifCert ? formData.forkliftValidity : undefined
    });
  };

  const handleBackgroundConsentChange = (checked: boolean) => {
    updateFormData({ backgroundCheckConsent: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Car className="mr-3 text-primary" />
          Transportation & Equipment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Transportation Method *</Label>
          <RadioGroup value={formData.transportation || ""} onValueChange={handleTransportationChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Own Vehicle" id="own-vehicle" />
              <Label htmlFor="own-vehicle">Own Vehicle</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Public Transit" id="public-transit" />
              <Label htmlFor="public-transit">Public Transit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Bicycle" id="bicycle" />
              <Label htmlFor="bicycle">Bicycle</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Walk" id="walk" />
              <Label htmlFor="walk">Walk</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Do you have safety shoes? *</Label>
          <RadioGroup 
            value={formData.hasSafetyShoes === true ? "yes" : formData.hasSafetyShoes === false ? "no" : ""} 
            onValueChange={handleSafetyShoesChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="safety-yes" />
              <Label htmlFor="safety-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="safety-no" />
              <Label htmlFor="safety-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.hasSafetyShoes && (
          <div>
            <Label htmlFor="safetyShoeType">Type of Safety Shoes</Label>
            <Select value={formData.safetyShoeType || ""} onValueChange={(value) => updateFormData({ safetyShoeType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Steel Toe">Steel Toe</SelectItem>
                <SelectItem value="Composite Toe">Composite Toe</SelectItem>
                <SelectItem value="Soft Toe">Soft Toe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label className="text-base font-medium mb-3 block">Do you have a forklift certificate? *</Label>
          <RadioGroup 
            value={formData.hasForklifCert === true ? "yes" : formData.hasForklifCert === false ? "no" : ""} 
            onValueChange={handleForkliftChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="forklift-yes" />
              <Label htmlFor="forklift-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="forklift-no" />
              <Label htmlFor="forklift-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.hasForklifCert && (
          <div>
            <Label htmlFor="forkliftValidity">Forklift Certificate Validity Date</Label>
            <Input
              id="forkliftValidity"
              type="date"
              value={formData.forkliftValidity ? new Date(formData.forkliftValidity).toISOString().split('T')[0] : ""}
              onChange={(e) => updateFormData({ forkliftValidity: new Date(e.target.value) })}
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="backgroundConsent"
            checked={formData.backgroundCheckConsent || false}
            onCheckedChange={handleBackgroundConsentChange}
          />
          <Label htmlFor="backgroundConsent" className="text-sm">
            I consent to a background check being conducted *
          </Label>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={onNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
