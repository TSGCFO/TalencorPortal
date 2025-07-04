import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home";
import RecruiterDashboard from "@/pages/recruiter-dashboard";
import ApplicationForm from "@/pages/application-form";
import ApplicationsList from "@/pages/applications-list";
import ApplicationDetail from "@/pages/application-detail";
import NotFound from "@/pages/not-found";

// Route Protection Component
function ProtectedRoute({ component: Component, ...props }: any) {
  const [location] = useLocation();
  
  // Check if user is coming from an application token route
  const isFromApplicationToken = location.startsWith('/apply/');
  
  // If they're trying to access restricted areas from an application token, redirect
  if (isFromApplicationToken && (location === '/' || location === '/recruiter')) {
    return <NotFound />;
  }
  
  return <Component {...props} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/apply/:token" component={ApplicationForm} />
      <Route path="/recruiter" component={RecruiterDashboard} />
      <Route path="/recruiter-dashboard" component={RecruiterDashboard} />
      <Route path="/applications" component={ApplicationsList} />
      <Route path="/application/:id" component={ApplicationDetail} />
      <Route path="/" component={HomePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
