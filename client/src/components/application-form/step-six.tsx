import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import type { InsertApplication } from "@shared/schema";

interface StepSixProps {
  formData: Partial<InsertApplication>;
  updateFormData: (data: Partial<InsertApplication>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function StepSix({ formData, updateFormData, onNext, onPrevious }: StepSixProps) {
  const handleInputChange = (field: keyof InsertApplication, value: string | number) => {
    updateFormData({ [field]: value });
  };

  const handleShiftDaysChange = (shift: 'morningDays' | 'afternoonDays' | 'nightDays', day: string, checked: boolean) => {
    const currentDays = (formData[shift] as string[]) || [];
    const updatedDays = checked 
      ? [...currentDays, day]
      : currentDays.filter(d => d !== day);
    updateFormData({ [shift]: updatedDays });
  };

  const handleReferralSourceChange = (value: string) => {
    updateFormData({ 
      referralSource: value,
      referralPersonName: value !== "Friend/Family" ? undefined : formData.referralPersonName,
      referralPersonContact: value !== "Friend/Family" ? undefined : formData.referralPersonContact,
      referralRelationship: value !== "Friend/Family" ? undefined : formData.referralRelationship,
      referralInternetSource: value !== "Internet" ? undefined : formData.referralInternetSource,
    });
  };

  const showReferralDetails = formData.referralSource === "Friend/Family";
  const showInternetSource = formData.referralSource === "Internet";

  const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Clock className="mr-3 text-primary" />
          Job Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Preferred Job Type *</Label>
          <RadioGroup value={formData.jobType || ""} onValueChange={(value) => handleInputChange("jobType", value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Full-time" id="full-time" />
              <Label htmlFor="full-time">Full-time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Part-time" id="part-time" />
              <Label htmlFor="part-time">Part-time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Contract" id="contract" />
              <Label htmlFor="contract">Contract</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Temporary" id="temporary" />
              <Label htmlFor="temporary">Temporary</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="commitmentMonths">Commitment Length (months) *</Label>
          <Input
            id="commitmentMonths"
            type="number"
            min="1"
            max="24"
            value={formData.commitmentMonths || ""}
            onChange={(e) => handleInputChange("commitmentMonths", parseInt(e.target.value) || 0)}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Shift Availability</h3>
          
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Morning Shift (7 AM - 3 PM)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysList.map((day) => (
                  <div key={`morning-${day}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`morning-${day}`}
                      checked={((formData.morningDays as string[]) || []).includes(day)}
                      onCheckedChange={(checked) => handleShiftDaysChange("morningDays", day, checked as boolean)}
                    />
                    <Label htmlFor={`morning-${day}`} className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Afternoon Shift (3 PM - 11 PM)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysList.map((day) => (
                  <div key={`afternoon-${day}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`afternoon-${day}`}
                      checked={((formData.afternoonDays as string[]) || []).includes(day)}
                      onCheckedChange={(checked) => handleShiftDaysChange("afternoonDays", day, checked as boolean)}
                    />
                    <Label htmlFor={`afternoon-${day}`} className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Night Shift (11 PM - 7 AM)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysList.map((day) => (
                  <div key={`night-${day}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`night-${day}`}
                      checked={((formData.nightDays as string[]) || []).includes(day)}
                      onCheckedChange={(checked) => handleShiftDaysChange("nightDays", day, checked as boolean)}
                    />
                    <Label htmlFor={`night-${day}`} className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">How did you hear about us?</h3>
          <RadioGroup value={formData.referralSource || ""} onValueChange={handleReferralSourceChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Friend/Family" id="friend-family" />
              <Label htmlFor="friend-family">Friend/Family</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Internet" id="internet" />
              <Label htmlFor="internet">Internet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Job Fair" id="job-fair" />
              <Label htmlFor="job-fair">Job Fair</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Advertisement" id="advertisement" />
              <Label htmlFor="advertisement">Advertisement</Label>
            </div>
          </RadioGroup>

          {showReferralDetails && (
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="referralPersonName">Person's Name</Label>
                <Input
                  id="referralPersonName"
                  value={formData.referralPersonName || ""}
                  onChange={(e) => handleInputChange("referralPersonName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="referralPersonContact">Contact Information</Label>
                <Input
                  id="referralPersonContact"
                  value={formData.referralPersonContact || ""}
                  onChange={(e) => handleInputChange("referralPersonContact", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="referralRelationship">Relationship</Label>
                <Input
                  id="referralRelationship"
                  value={formData.referralRelationship || ""}
                  onChange={(e) => handleInputChange("referralRelationship", e.target.value)}
                />
              </div>
            </div>
          )}

          {showInternetSource && (
            <div className="mt-4">
              <Label htmlFor="referralInternetSource">Which website?</Label>
              <Input
                id="referralInternetSource"
                placeholder="e.g., Indeed, LinkedIn, Company Website"
                value={formData.referralInternetSource || ""}
                onChange={(e) => handleInputChange("referralInternetSource", e.target.value)}
              />
            </div>
          )}
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
