import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";
import type { InsertApplication } from "@shared/schema";

interface StepThreeProps {
  formData: Partial<InsertApplication>;
  updateFormData: (data: Partial<InsertApplication>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function StepThree({ formData, updateFormData, onNext, onPrevious }: StepThreeProps) {
  const handleLegalStatusChange = (value: string) => {
    updateFormData({ legalStatus: value });
  };

  const handleScheduleChange = (day: string, time: string) => {
    const currentSchedule = (formData.classSchedule as Record<string, string>) || {};
    updateFormData({
      classSchedule: {
        ...currentSchedule,
        [day]: time
      }
    });
  };

  const showClassSchedule = formData.legalStatus === "Student Visa";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <GraduationCap className="mr-3 text-primary" />
          Legal Status & Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Legal Status in Canada *</Label>
          <RadioGroup value={formData.legalStatus || ""} onValueChange={handleLegalStatusChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Canadian Citizen" id="citizen" />
              <Label htmlFor="citizen">Canadian Citizen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Permanent Resident" id="permanent" />
              <Label htmlFor="permanent">Permanent Resident</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Work Permit" id="work-permit" />
              <Label htmlFor="work-permit">Work Permit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Student Visa" id="student" />
              <Label htmlFor="student">Student Visa</Label>
            </div>
          </RadioGroup>
        </div>

        {showClassSchedule && (
          <div>
            <Label className="text-base font-medium mb-3 block">Class Schedule (if student)</Label>
            <div className="grid grid-cols-7 gap-2 text-center">
              <div className="font-medium text-xs text-gray-600">Day</div>
              <div className="font-medium text-xs text-gray-600">Mon</div>
              <div className="font-medium text-xs text-gray-600">Tue</div>
              <div className="font-medium text-xs text-gray-600">Wed</div>
              <div className="font-medium text-xs text-gray-600">Thu</div>
              <div className="font-medium text-xs text-gray-600">Fri</div>
              <div className="font-medium text-xs text-gray-600">Sat</div>
              
              <div className="font-medium text-xs text-gray-600">Time</div>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                <Input
                  key={day}
                  placeholder="9-11"
                  className="text-xs"
                  value={((formData.classSchedule as Record<string, string>) || {})[day] || ""}
                  onChange={(e) => handleScheduleChange(day, e.target.value)}
                />
              ))}
            </div>
          </div>
        )}

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
