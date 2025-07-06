import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, Shield, Bus, ClipboardList, Brain } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-8">
            <Users className="text-6xl text-primary mb-4 mx-auto" size={96} />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Talencor Staffing</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Building long-lasting relationships with reliable staffing solutions, 24 hours a day, 7 days a week
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/recruiter">
              <Button size="lg" className="bg-primary hover:bg-secondary text-white px-8 py-4">
                <Bus className="mr-3 h-5 w-5" />
                Recruiter Dashboard
              </Button>
            </Link>
            <Link href="/recruiter">
              <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4">
                <FileText className="mr-3 h-5 w-5" />
                View Applications
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold">Guaranteed Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Each Talencor employee is carefully screened and tested. We provide the right people the first time.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardList className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-xl font-semibold">Save Time & Money</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                One phone call provides the right person. No payroll, deductions, or severance costs.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-semibold">24/7 Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our 24/7 employer hotline ensures we provide excellent services with skilled, talented individuals ready.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
