import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Calendar, Mail, User, FileText, Eye, Filter } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

export default function ApplicationsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["/api/applications?recruiterEmail=recruiter@talentcore.com"],
  });

  // Filter applications based on search and filters
  const filteredApplications = (applications as any[]).filter((app: any) => {
    const matchesSearch = searchTerm === "" || 
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJobType = jobTypeFilter === "all" || app.jobType === jobTypeFilter;
    
    return matchesSearch && matchesStatus && matchesJobType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/recruiter-dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Applications</h1>
          <p className="text-gray-600">View and manage all submitted applications</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Job Types</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center justify-end">
                <p className="text-sm text-gray-600">
                  Showing {filteredApplications.length} of {(applications as any[]).length} applications
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {(applications as any[]).length === 0 ? "No applications submitted yet" : "No applications match your filters"}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app: any) => (
                  <Card key={app.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link href={`/application/${app.id}`}>
                            <h3 className="text-xl font-semibold text-primary hover:underline cursor-pointer">
                              {app.fullName}
                            </h3>
                          </Link>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                            <div className="flex items-center text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              <span className="text-sm">{app.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <User className="h-4 w-4 mr-2" />
                              <span className="text-sm">Recruiter: {app.recruiterEmail}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span className="text-sm">Submitted: {formatDate(app.submittedAt)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center space-x-3">
                            <Badge variant={app.jobType === 'warehouse' ? 'default' : 
                                           app.jobType === 'manufacturing' ? 'secondary' : 'outline'}>
                              {app.jobType}
                            </Badge>
                            <Badge variant={app.aptitudeScore >= 8 ? 'default' : 
                                           app.aptitudeScore >= 6 ? 'secondary' : 'destructive'}>
                              Score: {app.aptitudeScore}/10
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="ml-4 flex flex-col items-end space-y-2">
                          <Badge variant={app.status === 'completed' ? 'default' : 
                                         app.status === 'reviewed' ? 'secondary' : 'outline'}>
                            {app.status}
                          </Badge>
                          
                          <Link href={`/application/${app.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}