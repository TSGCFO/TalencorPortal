import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  FileText, 
  Star,
  Download,
  CheckCircle,
  UserCheck,
  Car,
  HardHat,
  Package,
  Clock,
  Users
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function ApplicationDetail() {
  const [match, params] = useRoute("/application/:id");
  const applicationId = params?.id;

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["/api/applications?recruiterEmail=recruiter@talentcore.com"],
  });

  const application = (applications as any[]).find((app: any) => app.id === parseInt(applicationId || "0"));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-16">Loading application details...</div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application not found</h2>
            <Link href="/applications">
              <Button>Back to Applications</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/applications">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Applications
            </Button>
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{application.fullName}</h1>
              <p className="text-gray-600 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {application.email}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={application.status === 'completed' ? 'default' : 
                             application.status === 'reviewed' ? 'secondary' : 'outline'} 
                     className="text-lg px-4 py-2">
                {application.status}
              </Badge>
              <Badge variant={application.aptitudeScore >= 8 ? 'default' : 
                             application.aptitudeScore >= 6 ? 'secondary' : 'destructive'}
                     className="text-lg px-4 py-2">
                <Star className="h-4 w-4 mr-1" />
                {application.aptitudeScore}/10
              </Badge>
            </div>
          </div>
        </div>

        {/* Application Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Application ID</p>
                <p className="font-medium">#{application.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Submitted</p>
                <p className="font-medium">{formatDateTime(application.submittedAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Recruiter</p>
                <p className="font-medium">{application.recruiterEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Token ID</p>
                <p className="font-medium text-xs">{application.tokenId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Job Type</p>
                <Badge variant="outline">{application.jobType}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Commitment</p>
                <p className="font-medium">{application.commitmentMonths} months</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Basic Details</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Full Name:</span> <span className="font-medium">{application.fullName}</span></p>
                  <p><span className="text-gray-600">Date of Birth:</span> <span className="font-medium">{formatDate(application.dateOfBirth)}</span></p>
                  <p><span className="text-gray-600">SIN Number:</span> <span className="font-medium">{application.sinNumber}</span></p>
                  <p><span className="text-gray-600">Legal Status:</span> <span className="font-medium capitalize">{application.legalStatus}</span></p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Mobile:</span> <span className="font-medium">{application.mobileNumber}</span></p>
                  {application.whatsappNumber && (
                    <p><span className="text-gray-600">WhatsApp:</span> <span className="font-medium">{application.whatsappNumber}</span></p>
                  )}
                  <p><span className="text-gray-600">Email:</span> <span className="font-medium">{application.email}</span></p>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Address
                </h3>
                <div className="space-y-2">
                  <p className="font-medium">{application.streetAddress}</p>
                  <p className="font-medium">{application.city}, {application.province} {application.postalCode}</p>
                  {application.majorIntersection && (
                    <p><span className="text-gray-600">Major Intersection:</span> <span className="font-medium">{application.majorIntersection}</span></p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Emergency Contact</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Name:</span> <span className="font-medium">{application.emergencyName}</span></p>
                  <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{application.emergencyContact}</span></p>
                  <p><span className="text-gray-600">Relationship:</span> <span className="font-medium">{application.emergencyRelationship}</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Work Experience & Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Previous Employment</h3>
                <div className="space-y-2">
                  {application.lastCompanyName && (
                    <p><span className="text-gray-600">Last Company:</span> <span className="font-medium">{application.lastCompanyName}</span></p>
                  )}
                  {application.companyType && (
                    <p><span className="text-gray-600">Company Type:</span> <span className="font-medium capitalize">{application.companyType}</span></p>
                  )}
                  {application.agencyOrDirect && (
                    <p><span className="text-gray-600">Hire Type:</span> <span className="font-medium capitalize">{application.agencyOrDirect}</span></p>
                  )}
                  {application.reasonForLeaving && (
                    <p><span className="text-gray-600">Reason for Leaving:</span> <span className="font-medium">{application.reasonForLeaving}</span></p>
                  )}
                </div>
                {application.jobResponsibilities && (
                  <div className="mt-4">
                    <p className="text-gray-600 mb-1">Job Responsibilities:</p>
                    <p className="font-medium">{application.jobResponsibilities}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-3">Equipment & Certifications</h3>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <Car className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-gray-600">Transportation:</span> 
                    <span className="font-medium ml-2 capitalize">{application.transportation.replace('_', ' ')}</span>
                  </p>
                  <p className="flex items-center">
                    <HardHat className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-gray-600">Safety Shoes:</span> 
                    <span className="font-medium ml-2">{application.hasSafetyShoes ? 'Yes' : 'No'}</span>
                    {application.safetyShoeType && <span className="ml-1">({application.safetyShoeType})</span>}
                  </p>
                  <p className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-gray-600">Forklift Certified:</span> 
                    <span className="font-medium ml-2">{application.hasForklifCert ? 'Yes' : 'No'}</span>
                    {application.forkliftValidity && <span className="ml-1">(Valid until {formatDate(application.forkliftValidity)})</span>}
                  </p>
                  <p><span className="text-gray-600">Lifting Capability:</span> <span className="font-medium">{application.liftingCapability}</span></p>
                  <p className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-gray-600">Background Check:</span> 
                    <span className="font-medium ml-2">{application.backgroundCheckConsent ? 'Consented' : 'Not Consented'}</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Availability & Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {application.morningDays?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Morning Shifts</h3>
                  <div className="flex flex-wrap gap-2">
                    {application.morningDays.map((day: string) => (
                      <Badge key={day} variant="outline" className="capitalize">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {application.afternoonDays?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Afternoon Shifts</h3>
                  <div className="flex flex-wrap gap-2">
                    {application.afternoonDays.map((day: string) => (
                      <Badge key={day} variant="outline" className="capitalize">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {application.nightDays?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Night Shifts</h3>
                  <div className="flex flex-wrap gap-2">
                    {application.nightDays.map((day: string) => (
                      <Badge key={day} variant="outline" className="capitalize">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {application.classSchedule && typeof application.classSchedule === 'object' && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Class Schedule</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(application.classSchedule as Record<string, string>)
                    .filter(([_, time]) => time)
                    .map(([day, time]) => (
                      <div key={day}>
                        <p className="text-gray-600 capitalize">{day}:</p>
                        <p className="font-medium">{time}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Referral Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Referral Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p><span className="text-gray-600">Referral Source:</span> <span className="font-medium capitalize">{application.referralSource}</span></p>
                {application.referralInternetSource && (
                  <p><span className="text-gray-600">Internet Source:</span> <span className="font-medium">{application.referralInternetSource}</span></p>
                )}
              </div>
              {application.referralPersonName && (
                <div>
                  <p><span className="text-gray-600">Referral Person:</span> <span className="font-medium">{application.referralPersonName}</span></p>
                  {application.referralPersonContact && (
                    <p><span className="text-gray-600">Contact:</span> <span className="font-medium">{application.referralPersonContact}</span></p>
                  )}
                  {application.referralRelationship && (
                    <p><span className="text-gray-600">Relationship:</span> <span className="font-medium">{application.referralRelationship}</span></p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        {application.uploadedDocuments && application.uploadedDocuments.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Uploaded Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {application.uploadedDocuments.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-gray-600" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                    {doc.url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Agreement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              Agreement & Consent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="text-gray-600">Agreement Name:</span> <span className="font-medium">{application.agreementName}</span></p>
              <p><span className="text-gray-600">Agreement Date:</span> <span className="font-medium">{formatDateTime(application.agreementDate)}</span></p>
              <p><span className="text-gray-600">Terms Accepted:</span> <span className="font-medium">{application.termsAccepted ? 'Yes' : 'No'}</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}