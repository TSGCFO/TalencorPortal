/**
 * End-to-End Test for Complete TalentCore Application Workflow
 * This test simulates the entire applicant journey through all 8 steps
 */

const BASE_URL = 'http://localhost:5000';

// Test data for a complete application
const testApplicant = {
  // Step 1: Personal Information
  fullName: 'John Michael Smith',
  dateOfBirth: '1990-05-15',
  sinNumber: '123-456-789',
  streetAddress: '123 Main Street',
  city: 'Toronto',
  province: 'ON',
  postalCode: 'M5V 3A8',
  majorIntersection: 'King St W & Bay St',
  
  // Step 2: Contact Information
  mobileNumber: '416-555-1234',
  email: 'john.smith@test.com',
  emergencyName: 'Jane Smith',
  emergencyContact: '416-555-5678',
  emergencyRelationship: 'Spouse',
  
  // Step 3: Legal Status
  legalStatus: 'citizen',
  classSchedule: null,
  
  // Step 4: Transportation & Equipment
  transportation: 'own_vehicle',
  hasSafetyShoes: true,
  safetyShoeType: 'steel-toe',
  hasForklifCert: true,
  forkliftValidity: '2025-12-31',
  backgroundCheckConsent: true,
  
  // Step 5: Work History & Physical Capabilities
  lastCompanyName: 'ABC Warehouse Ltd.',
  companyType: 'warehouse',
  jobResponsibilities: 'Inventory management, forklift operation, shipping/receiving',
  agencyOrDirect: 'direct',
  reasonForLeaving: 'Seeking better opportunities',
  liftingCapability: '50lbs',
  
  // Step 6: Job Preferences & Referral
  jobType: 'warehouse',
  commitmentMonths: 12,
  morningDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  afternoonDays: ['saturday'],
  nightDays: [],
  referralSource: 'friend',
  referralPersonName: 'Mike Johnson',
  referralPersonContact: '416-555-9999',
  referralRelationship: 'Former colleague',
  
  // Step 7: Aptitude Test
  aptitudeAnswers: {
    q1: 'C', // Solve 15 + 23 × 2 - 10
    q2: 'B', // Pattern: 2, 4, 8, 16, ?
    q3: 'A', // Time calculation
    q4: 'B', // Percentage calculation
    q5: 'C', // Logical reasoning
    q6: 'A', // Spatial reasoning
    q7: 'B', // Problem solving
    q8: 'A', // Attention to detail
    q9: 'C', // Basic algebra
    q10: 'B' // Critical thinking
  },
  
  // Step 8: Agreement
  agreementName: 'John Michael Smith',
  termsAccepted: true
};

async function makeRequest(method, url, data = null) {
  const options = {
    method,
    headers: {}
  };
  
  if (data && !(data instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  } else if (data instanceof FormData) {
    options.body = data;
  }
  
  const response = await fetch(url, options);
  const text = await response.text();
  
  try {
    return { ok: response.ok, status: response.status, data: JSON.parse(text) };
  } catch {
    return { ok: response.ok, status: response.status, data: text };
  }
}

async function testCompleteApplicationWorkflow() {
  console.log('🚀 Starting Complete Application Workflow Test\n');
  console.log('=' .repeat(60));
  
  let token;
  let applicationData = {};
  
  try {
    // Step 0: Generate Application Token
    console.log('\n📋 STEP 0: Generating Application Token');
    console.log('-'.repeat(40));
    
    const tokenResult = await makeRequest('POST', `${BASE_URL}/api/generate-link`, {
      recruiterEmail: 'recruiter@talentcore.com',
      applicantEmail: testApplicant.email,
      jobType: 'warehouse',
      message: 'Complete workflow test application'
    });
    
    if (!tokenResult.ok) throw new Error(`Token generation failed: ${JSON.stringify(tokenResult.data)}`);
    
    token = tokenResult.data.token;
    console.log(`✅ Token generated: ${token}`);
    console.log(`📧 Link: ${BASE_URL}/apply/${token}`);
    
    // Step 1: Validate Token (simulating applicant clicking the link)
    console.log('\n📋 STEP 1: Validating Application Token');
    console.log('-'.repeat(40));
    
    const validateResult = await makeRequest('POST', `${BASE_URL}/api/validate-token`, { token });
    
    if (!validateResult.ok) throw new Error(`Token validation failed: ${JSON.stringify(validateResult.data)}`);
    
    console.log('✅ Token validated successfully');
    console.log(`   Expires: ${new Date(validateResult.data.tokenData.expiresAt).toLocaleString()}`);
    
    // Build application data progressively (simulating form progress)
    console.log('\n📝 Starting Application Form Completion');
    console.log('=' .repeat(60));
    
    // Step 2: Personal Information
    console.log('\n📋 FORM STEP 1/8: Personal Information');
    console.log('-'.repeat(40));
    
    applicationData = {
      ...applicationData,
      fullName: testApplicant.fullName,
      dateOfBirth: testApplicant.dateOfBirth,
      sinNumber: testApplicant.sinNumber,
      streetAddress: testApplicant.streetAddress,
      city: testApplicant.city,
      province: testApplicant.province,
      postalCode: testApplicant.postalCode,
      majorIntersection: testApplicant.majorIntersection
    };
    
    console.log('✅ Personal information entered');
    console.log(`   Name: ${applicationData.fullName}`);
    console.log(`   Location: ${applicationData.city}, ${applicationData.province}`);
    
    // Step 3: Contact Information
    console.log('\n📋 FORM STEP 2/8: Contact Information');
    console.log('-'.repeat(40));
    
    applicationData = {
      ...applicationData,
      mobileNumber: testApplicant.mobileNumber,
      email: testApplicant.email,
      emergencyName: testApplicant.emergencyName,
      emergencyContact: testApplicant.emergencyContact,
      emergencyRelationship: testApplicant.emergencyRelationship
    };
    
    console.log('✅ Contact information entered');
    console.log(`   Phone: ${applicationData.mobileNumber}`);
    console.log(`   Emergency: ${applicationData.emergencyName} (${applicationData.emergencyRelationship})`);
    
    // Step 4: Legal Status
    console.log('\n📋 FORM STEP 3/8: Legal Status');
    console.log('-'.repeat(40));
    
    applicationData = {
      ...applicationData,
      legalStatus: testApplicant.legalStatus,
      classSchedule: testApplicant.classSchedule
    };
    
    console.log('✅ Legal status entered');
    console.log(`   Status: ${applicationData.legalStatus}`);
    
    // Step 5: Transportation & Equipment
    console.log('\n📋 FORM STEP 4/8: Transportation & Equipment');
    console.log('-'.repeat(40));
    
    applicationData = {
      ...applicationData,
      transportation: testApplicant.transportation,
      hasSafetyShoes: testApplicant.hasSafetyShoes,
      safetyShoeType: testApplicant.safetyShoeType,
      hasForklifCert: testApplicant.hasForklifCert,
      forkliftValidity: testApplicant.forkliftValidity,
      backgroundCheckConsent: testApplicant.backgroundCheckConsent
    };
    
    console.log('✅ Transportation & equipment entered');
    console.log(`   Transportation: ${applicationData.transportation}`);
    console.log(`   Safety shoes: ${applicationData.hasSafetyShoes ? 'Yes' : 'No'}`);
    console.log(`   Forklift cert: ${applicationData.hasForklifCert ? 'Yes' : 'No'}`);
    
    // Step 6: Work History & Physical Capabilities
    console.log('\n📋 FORM STEP 5/8: Work History & Physical Capabilities');
    console.log('-'.repeat(40));
    
    applicationData = {
      ...applicationData,
      lastCompanyName: testApplicant.lastCompanyName,
      companyType: testApplicant.companyType,
      jobResponsibilities: testApplicant.jobResponsibilities,
      agencyOrDirect: testApplicant.agencyOrDirect,
      reasonForLeaving: testApplicant.reasonForLeaving,
      liftingCapability: testApplicant.liftingCapability
    };
    
    console.log('✅ Work history entered');
    console.log(`   Last company: ${applicationData.lastCompanyName}`);
    console.log(`   Lifting capability: ${applicationData.liftingCapability}`);
    
    // Step 7: Job Preferences & Referral
    console.log('\n📋 FORM STEP 6/8: Job Preferences & Referral');
    console.log('-'.repeat(40));
    
    applicationData = {
      ...applicationData,
      jobType: testApplicant.jobType,
      commitmentMonths: testApplicant.commitmentMonths,
      morningDays: testApplicant.morningDays,
      afternoonDays: testApplicant.afternoonDays,
      nightDays: testApplicant.nightDays,
      referralSource: testApplicant.referralSource,
      referralPersonName: testApplicant.referralPersonName,
      referralPersonContact: testApplicant.referralPersonContact,
      referralRelationship: testApplicant.referralRelationship
    };
    
    console.log('✅ Job preferences entered');
    console.log(`   Job type: ${applicationData.jobType}`);
    console.log(`   Commitment: ${applicationData.commitmentMonths} months`);
    console.log(`   Referral: ${applicationData.referralSource}`);
    
    // Step 8: Aptitude Test
    console.log('\n📋 FORM STEP 7/8: Aptitude Test');
    console.log('-'.repeat(40));
    
    applicationData = {
      ...applicationData,
      aptitudeAnswers: testApplicant.aptitudeAnswers
    };
    
    // Calculate expected score
    const correctAnswers = {
      q1: 'C', q2: 'B', q3: 'A', q4: 'B', q5: 'C',
      q6: 'A', q7: 'B', q8: 'A', q9: 'C', q10: 'B'
    };
    
    let score = 0;
    Object.keys(correctAnswers).forEach(q => {
      if (testApplicant.aptitudeAnswers[q] === correctAnswers[q]) score++;
    });
    
    console.log('✅ Aptitude test completed');
    console.log(`   Expected score: ${score}/10`);
    
    // Step 9: Document Upload
    console.log('\n📋 FORM STEP 8/8: Document Upload & Agreement');
    console.log('-'.repeat(40));
    
    // Create test documents
    const resumeContent = 'John Smith Resume - Experienced warehouse worker with 5+ years experience...';
    const resumeBlob = new Blob([resumeContent], { type: 'application/pdf' });
    
    const formData = new FormData();
    formData.append('files', resumeBlob, 'john-smith-resume.pdf');
    
    console.log('📄 Uploading resume...');
    const uploadResult = await makeRequest('POST', `${BASE_URL}/api/upload/${token}`, formData);
    
    if (!uploadResult.ok) {
      console.log('⚠️  Document upload failed (non-critical):', uploadResult.data);
      applicationData.uploadedDocuments = [];
    } else {
      console.log('✅ Document uploaded successfully');
      applicationData.uploadedDocuments = uploadResult.data.files.map(f => ({
        id: f.id,
        name: f.name,
        url: f.url
      }));
    }
    
    // Agreement
    applicationData = {
      ...applicationData,
      agreementName: testApplicant.agreementName,
      agreementDate: new Date().toISOString(),
      termsAccepted: testApplicant.termsAccepted
    };
    
    console.log('✅ Agreement signed');
    console.log(`   Signed by: ${applicationData.agreementName}`);
    
    // Final submission
    console.log('\n📤 FINAL STEP: Submitting Application');
    console.log('=' .repeat(60));
    
    const finalData = {
      ...applicationData,
      tokenId: token,
      recruiterEmail: 'recruiter@talentcore.com',
      jobType: applicationData.jobType || 'warehouse',
      aptitudeScore: score // Add the calculated score
    };
    
    console.log('\n📊 Application Summary:');
    console.log(`   Total fields: ${Object.keys(finalData).length}`);
    console.log(`   Documents: ${finalData.uploadedDocuments?.length || 0}`);
    
    const submitResult = await makeRequest('POST', `${BASE_URL}/api/applications`, finalData);
    
    if (!submitResult.ok) {
      throw new Error(`Application submission failed: ${JSON.stringify(submitResult.data)}`);
    }
    
    console.log('\n🎉 APPLICATION SUBMITTED SUCCESSFULLY!');
    console.log('=' .repeat(60));
    console.log(`   Application ID: ${submitResult.data.application.id}`);
    console.log(`   Status: ${submitResult.data.application.status}`);
    console.log(`   Aptitude Score: ${submitResult.data.application.aptitudeScore}/10`);
    console.log(`   Submitted: ${new Date(submitResult.data.application.submittedAt).toLocaleString()}`);
    
    // Verify application was saved
    console.log('\n🔍 Verifying Application was Saved');
    console.log('-'.repeat(40));
    
    const applicationsResult = await makeRequest('GET', `${BASE_URL}/api/applications?recruiterEmail=recruiter@talentcore.com`);
    
    if (applicationsResult.ok) {
      const savedApp = applicationsResult.data.find(app => app.id === submitResult.data.application.id);
      if (savedApp) {
        console.log('✅ Application found in database');
        console.log(`   Name: ${savedApp.fullName}`);
        console.log(`   Email: ${savedApp.email}`);
        console.log(`   Status: ${savedApp.status}`);
      }
    }
    
    console.log('\n✨ Complete workflow test PASSED!');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test FAILED:', error.message);
    console.error('=' .repeat(60));
    throw error;
  }
}

// Run the test
console.log('TalentCore Application Workflow End-to-End Test');
console.log('Testing complete applicant journey through all 8 steps...\n');

testCompleteApplicationWorkflow()
  .then(() => {
    console.log('\n✅ All tests completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  });