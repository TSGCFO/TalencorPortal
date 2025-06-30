import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Application Progress</h2>
          <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-300" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          {stepLabels.map((label, index) => (
            <span 
              key={index}
              className={`${index + 1 === currentStep ? 'font-semibold text-primary' : ''}`}
            >
              {label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
