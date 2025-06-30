import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight, ArrowLeft } from "lucide-react";
import type { InsertApplication } from "@shared/schema";

interface StepFiveProps {
  formData: Partial<InsertApplication>;
  updateFormData: (data: Partial<InsertApplication>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function StepFive({ formData, updateFormData, onNext, onPrevious }: StepFiveProps) {
  const handleInputChange = (field: keyof InsertApplication, value: string) => {
    updateFormData({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Briefcase className="mr-3 text-primary" />
          Work History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="lastCompanyName">Last Company Name</Label>
          <Input
            id="lastCompanyName"
            value={formData.lastCompanyName || ""}
            onChange={(e) => handleInputChange("lastCompanyName", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="companyType">Type of Company</Label>
          <Input
            id="companyType"
            placeholder="e.g., Manufacturing, Retail, Healthcare"
            value={formData.companyType || ""}
            onChange={(e) => handleInputChange("companyType", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="jobResponsibilities">Job Responsibilities</Label>
          <Textarea
            id="jobResponsibilities"
            rows={4}
            value={formData.jobResponsibilities || ""}
            onChange={(e) => handleInputChange("jobResponsibilities", e.target.value)}
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Was this position through an agency or direct hire?</Label>
          <RadioGroup value={formData.agencyOrDirect || ""} onValueChange={(value) => handleInputChange("agencyOrDirect", value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Agency" id="agency" />
              <Label htmlFor="agency">Through an Agency</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Direct" id="direct" />
              <Label htmlFor="direct">Direct Hire</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="reasonForLeaving">Reason for Leaving</Label>
          <Textarea
            id="reasonForLeaving"
            rows={3}
            value={formData.reasonForLeaving || ""}
            onChange={(e) => handleInputChange("reasonForLeaving", e.target.value)}
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Lifting Capability *</Label>
          <RadioGroup value={formData.liftingCapability || ""} onValueChange={(value) => handleInputChange("liftingCapability", value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Up to 25 lbs" id="lift-25" />
              <Label htmlFor="lift-25">Up to 25 lbs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="25-50 lbs" id="lift-50" />
              <Label htmlFor="lift-50">25-50 lbs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="50+ lbs" id="lift-50plus" />
              <Label htmlFor="lift-50plus">50+ lbs</Label>
            </div>
          </RadioGroup>
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
