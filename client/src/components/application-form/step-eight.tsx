import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileUp, ArrowLeft, Check, Upload, FileText, X } from "lucide-react";
import type { InsertApplication } from "@shared/schema";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface StepEightProps {
  formData: Partial<InsertApplication>;
  updateFormData: (data: Partial<InsertApplication>) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function StepEight({ formData, updateFormData, onPrevious, onSubmit, isSubmitting }: StepEightProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof InsertApplication, value: string | boolean | Date) => {
    updateFormData({ [field]: value });
  };

  // Set current date as default
  useEffect(() => {
    if (!formData.agreementDate) {
      handleInputChange("agreementDate", new Date());
    }
  }, []);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));

    // Filter valid files (check size and type)
    const validFiles = newFiles.filter((file) => {
      const validTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = validTypes.includes(extension);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValidType) {
        alert(`File ${file.name} has an invalid format. Please upload PDF, DOC, DOCX, JPG, or PNG files.`);
        return false;
      }
      if (!isValidSize) {
        alert(`File ${file.name} is too large. Please upload files smaller than 5MB.`);
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

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
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 hover:border-primary'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleButtonClick}
            >
              <Upload className="text-4xl text-gray-400 mb-4 mx-auto" size={64} />
              <p className="text-gray-600 mb-2">
                {isDragOver ? 'Drop files here' : 'Drag and drop files here or click to browse'}
              </p>
              <p className="text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB each)</p>
              <Button type="button" className="mt-4" variant="outline" onClick={handleButtonClick}>
                <Upload className="mr-2 h-4 w-4" />
                Select Files
              </Button>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Uploaded Documents ({uploadedFiles.length}):</h4>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileRemove(file.id);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
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
