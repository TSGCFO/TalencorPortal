import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Shield, 
  Bus, 
  ClipboardList, 
  Brain, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  Clock,
  Users,
  Star
} from "lucide-react";
import TalencorLogo from "@/components/talencor-logo";

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-12 animate-fade-in">
            <div className="flex justify-center mb-8">
              <TalencorLogo size="lg" />
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-shadow-soft">
              <span className="text-gradient">Staffing Excellence</span>
              <br />
              <span className="text-foreground">Delivered Daily</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Building long-lasting relationships with reliable staffing solutions, 
              <span className="font-semibold text-primary"> 24 hours a day, 7 days a week</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link href="/recruiter">
              <Button size="lg" className="group relative overflow-hidden px-10 py-6 text-lg font-semibold talencor-gradient hover-glow">
                <span className="relative z-10 flex items-center">
                  <Bus className="mr-3 h-6 w-6" />
                  Recruiter Portal
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link href="/recruiter">
              <Button 
                variant="outline" 
                size="lg" 
                className="group px-10 py-6 text-lg font-semibold border-2 border-primary bg-white/50 backdrop-blur-sm hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Sparkles className="mr-3 h-6 w-6" />
                View Applications
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>10,000+ Placements</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span>4.9/5 Client Rating</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="group modern-card relative overflow-hidden">
            <div className="absolute inset-0 talencor-gradient-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-2xl talencor-gradient p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-full h-full text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Guaranteed Quality</h3>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Each Talencor employee is carefully screened and tested. We provide the right people the first time.
              </p>
              <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="group modern-card relative overflow-hidden">
            <div className="absolute inset-0 talencor-gradient-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ClipboardList className="w-full h-full text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Save Time & Money</h3>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-muted-foreground leading-relaxed mb-4">
                One phone call provides the right person. No payroll, deductions, or severance costs.
              </p>
              <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="group modern-card relative overflow-hidden">
            <div className="absolute inset-0 talencor-gradient-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-full h-full text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">24/7 Support</h3>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our 24/7 employer hotline ensures we provide excellent services with skilled individuals ready.
              </p>
              <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                Contact us <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workforce?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of satisfied clients who trust Talencor for their staffing needs.
            </p>
            <Link href="/recruiter">
              <Button size="lg" className="talencor-gradient px-8 py-4 text-lg font-semibold hover-glow">
                Start Recruiting Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
