import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, ArrowRight, ArrowLeft, Info } from "lucide-react";
import type { InsertApplication } from "@shared/schema";

interface StepSevenProps {
  formData: Partial<InsertApplication>;
  updateFormData: (data: Partial<InsertApplication>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const questions = [
  {
    id: "aptitude1",
    question: "If you have 5 boxes and each box contains 12 items, how many items do you have in total?",
    options: ["50", "60", "72", "84"],
    correct: "60"
  },
  {
    id: "aptitude2",
    question: "Which word does not belong with the others?",
    options: ["Hammer", "Screwdriver", "Nail", "Wrench"],
    correct: "Nail"
  },
  {
    id: "aptitude3",
    question: "If it takes 3 workers 6 hours to complete a task, how long would it take 6 workers to complete the same task?",
    options: ["2 hours", "3 hours", "6 hours", "12 hours"],
    correct: "3 hours"
  },
  {
    id: "aptitude4",
    question: "What comes next in this sequence: 2, 4, 8, 16, ?",
    options: ["24", "32", "18", "20"],
    correct: "32"
  },
  {
    id: "aptitude5",
    question: "If you rearrange the letters \"CIFAIPT\", you get the name of a:",
    options: ["City", "Ocean", "Country", "Animal"],
    correct: "Ocean"
  }
];

export default function StepSeven({ formData, updateFormData, onNext, onPrevious }: StepSevenProps) {
  const [answers, setAnswers] = useState<Record<string, string>>((formData.aptitudeAnswers as Record<string, string>) || {});

  const handleAnswerChange = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    // Calculate score
    const score = questions.reduce((total, q) => {
      return total + (newAnswers[q.id] === q.correct ? 1 : 0);
    }, 0);
    
    updateFormData({ 
      aptitudeAnswers: newAnswers,
      aptitudeScore: score
    });
  };

  const allQuestionsAnswered = questions.every(q => answers[q.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Brain className="mr-3 text-primary" />
          Aptitude Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Please answer all questions to the best of your ability. This test helps us match you with suitable positions.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} className="p-6 border border-gray-200">
              <h3 className="font-semibold mb-4">{index + 1}. {question.question}</h3>
              <RadioGroup 
                value={answers[question.id] || ""} 
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                {question.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                    <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>
          ))}
        </div>

        {formData.aptitudeScore !== undefined && (
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-orange-800 font-semibold">
              Current Score: {formData.aptitudeScore}/{questions.length}
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={onNext} disabled={!allQuestionsAnswered}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
