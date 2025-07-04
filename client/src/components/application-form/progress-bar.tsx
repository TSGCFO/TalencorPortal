import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  "Personal Info",
  "Contact",
  "Legal Status",
  "Transport",
  "Work History",
  "Job Preferences",
  "Aptitude Test",
  "Agreement"
];

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <Card className="mb-8 modern-card overflow-hidden">
      <CardContent className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-all duration-300",
              currentStep === totalSteps ? "bg-gradient-to-br from-green-500 to-green-600" : "talencor-gradient"
            )}>
              {currentStep === totalSteps ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                currentStep
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gradient">Application Progress</h2>
              <p className="text-sm text-muted-foreground">{stepLabels[currentStep - 1]}</p>
            </div>
          </div>
          <span className={cn(
            "text-sm font-semibold px-4 py-2 rounded-full transition-all",
            percentage === 100 
              ? "bg-green-100 text-green-700 border border-green-200" 
              : "talencor-gradient-subtle text-primary border border-blue-200"
          )}>
            {Math.round(percentage)}% Complete
          </span>
        </div>
        
        <div className="relative mb-6">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden",
                percentage === 100 
                  ? "bg-gradient-to-r from-green-400 to-green-600" 
                  : "talencor-gradient animate-gradient"
              )}
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse-subtle"></div>
            </div>
          </div>
          
          {/* Progress dots */}
          <div className="absolute top-0 left-0 w-full h-4 flex items-center justify-between px-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index < currentStep 
                    ? "bg-white shadow-sm scale-110" 
                    : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-xs">
          {stepLabels.map((label, index) => (
            <div 
              key={index}
              className={cn(
                "text-center transition-all duration-300",
                index + 1 === currentStep 
                  ? "font-bold text-primary scale-105" 
                  : index + 1 < currentStep
                  ? "text-success font-medium"
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-semibold transition-all",
                index + 1 === currentStep 
                  ? "bg-primary text-white shadow-lg scale-110" 
                  : index + 1 < currentStep
                  ? "bg-success text-white"
                  : "bg-gray-200 text-gray-500"
              )}>
                {index + 1 < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="hidden md:block">{label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
