import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileUp, ArrowLeft, Check, Upload } from "lucide-react";
import type { InsertApplication } from "@shared/schema";

interface StepEightProps {
  formData: Partial<InsertApplication>;
  updateFormData: (data: Partial<InsertApplication>) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function StepEight({ formData, updateFormData, onPrevious, onSubmit, isSubmitting }: StepEightProps) {
  const handleInputChange = (field: keyof InsertApplication, value: string | boolean | Date) => {
    updateFormData({ [field]: value });
  };

  // Set current date as default
  useEffect(() => {
    if (!formData.agreementDate) {
      handleInputChange("agreementDate", new Date());
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <FileUp className="mr-3 text-primary" />
          Document Upload & Agreement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document Upload */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <Upload className="text-4xl text-gray-400 mb-4 mx-auto" size={64} />
              <p className="text-gray-600 mb-2">Drag and drop files here or click to browse</p>
              <p className="text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB each)</p>
              <Button type="button" className="mt-4" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Select Files
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Please upload the following documents:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Resume/CV</li>
                <li>Government-issued ID (Driver's License, Passport, etc.)</li>
                <li>Work permits (if applicable)</li>
                <li>Certificates/Qualifications</li>
                <li>References (if available)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Agreement and Consent</h3>
          
          <div className="bg-gray-50 p-6 rounded-lg text-sm text-gray-700 max-h-40 overflow-y-auto">
            <h4 className="font-semibold mb-3">Terms and Conditions</h4>
            <p className="mb-3">
              By submitting this application, I certify that all information provided is true, complete, and accurate to the best of my knowledge. I understand that any false or misleading information may result in the rejection of my application or termination of employment.
            </p>
            <p className="mb-3">
              I authorize TalentCore Staffing to verify the information provided and to conduct background checks as necessary. I consent to the collection, use, and disclosure of my personal information for the purposes of employment screening and placement.
            </p>
            <p className="mb-3">
              I understand that this application does not guarantee employment and that employment, if offered, may be subject to satisfactory references, background checks, and other conditions.
            </p>
            <p>
              I acknowledge that I have read and understood these terms and conditions.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="agreementName">Full Name (Digital Signature) *</Label>
              <Input
                id="agreementName"
                value={formData.agreementName || ""}
                onChange={(e) => handleInputChange("agreementName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="agreementDate">Date *</Label>
              <Input
                id="agreementDate"
                type="date"
                value={formData.agreementDate ? new Date(formData.agreementDate).toISOString().split('T')[0] : ""}
                onChange={(e) => handleInputChange("agreementDate", new Date(e.target.value))}
                required
              />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="termsAccepted"
                checked={formData.termsAccepted || false}
                onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
                required
              />
              <Label htmlFor="termsAccepted" className="text-sm leading-relaxed">
                I have read, understood, and agree to the terms and conditions stated above. I consent to the collection and processing of my personal information as described. *
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting || !formData.agreementName || !formData.agreementDate || !formData.termsAccepted}
            className="bg-success hover:bg-green-700"
          >
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Submit Application
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
