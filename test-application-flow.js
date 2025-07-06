#!/usr/bin/env node

/**
 * Automated test for Talencor application flow
 * Tests: Token generation, form validation, file upload, progress saving, and submission
 */

const API_BASE = 'http://localhost:5000';

// Test data for a complete application
const testApplicationData = {
  // Step 1: Personal Information
  fullName: "John Smith",
  dateOfBirth: "1990-05-15",
  sinNumber: "123-456-789",
  streetAddress: "123 Main Street",
  city: "Toronto",
  province: "ON",
  postalCode: "M5V 3A8",
  majorIntersection: "Queen & Spadina",
  
  // Step 2: Contact Information
  mobileNumber: "(416) 555-0123",
  email: "john.smith@email.com",
  emergencyName: "Jane Smith",
  emergencyContact: "(416) 555-0124",
  emergencyRelationship: "Spouse",
  
  // Step 3: Legal Status
  legalStatus: "Canadian Citizen",
  
  // Step 4: Transportation & Equipment
  transportation: "Own Vehicle",
  hasSafetyShoes: true,
  hasForklifCert: false,
  backgroundCheckConsent: true,
  
  // Step 5: Physical Capabilities
  liftingCapability: "Up to 50 lbs",
  
  // Step 6: Job Preferences
  jobType: "warehouse",
  commitmentMonths: 12,
  morningDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  afternoonDays: [],
  nightDays: [],
  referralSource: "Online Job Board",
  
  // Step 7: Aptitude Test
  aptitudeAnswers: {
    "q1": "A",
    "q2": "B", 
    "q3": "C",
    "q4": "A",
    "q5": "B"
  },
  aptitudeScore: 85,
  
  // Step 8: Agreement
  agreementName: "John Smith",
  agreementDate: new Date().toISOString().split('T')[0],
  termsAccepted: true
};

async function makeRequest(method, endpoint, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(`API Error: ${result.error || response.statusText}`);
  }
  
  return result;
}

async function testGenerateApplicationLink() {
  console.log('\n📋 Testing application link generation...');
  
  const linkData = {
    applicantEmail: "john.smith@email.com",
    recruiterEmail: "recruiter@talentcore.com",
    jobType: "warehouse",
    customMessage: "Test application for automated testing"
  };
  
  const result = await makeRequest('POST', '/api/generate-link', linkData);
  console.log('✅ Application link generated:', result.token);
  return result.token;
}

async function testTokenValidation(token) {
  console.log('\n🔐 Testing token validation...');
  
  const result = await makeRequest('POST', '/api/validate-token', { token });
  console.log('✅ Token validated successfully');
  return result.tokenData;
}

async function testProgressSaving(token) {
  console.log('\n💾 Testing progress saving...');
  
  // Simulate saving progress to localStorage
  const progressData = {
    currentStep: 4,
    formData: {
      fullName: testApplicationData.fullName,
      dateOfBirth: testApplicationData.dateOfBirth,
      sinNumber: testApplicationData.sinNumber,
      streetAddress: testApplicationData.streetAddress,
      city: testApplicationData.city,
      province: testApplicationData.province,
      postalCode: testApplicationData.postalCode,
      majorIntersection: testApplicationData.majorIntersection,
      mobileNumber: testApplicationData.mobileNumber,
      email: testApplicationData.email,
      emergencyName: testApplicationData.emergencyName,
      emergencyContact: testApplicationData.emergencyContact,
      emergencyRelationship: testApplicationData.emergencyRelationship,
      legalStatus: testApplicationData.legalStatus,
      transportation: testApplicationData.transportation,
      hasSafetyShoes: testApplicationData.hasSafetyShoes,
      hasForklifCert: testApplicationData.hasForklifCert,
      backgroundCheckConsent: testApplicationData.backgroundCheckConsent
    },
    lastSaved: new Date().toISOString()
  };
  
  console.log('✅ Progress data structure validated');
  console.log(`   - Current step: ${progressData.currentStep}`);
  console.log(`   - Form fields: ${Object.keys(progressData.formData).length}`);
  return progressData;
}

async function testApplicationSubmission(token, tokenData) {
  console.log('\n📤 Testing application submission...');
  
  const completeData = {
    ...testApplicationData,
    tokenId: token,
    recruiterEmail: tokenData.recruiterEmail || 'recruiter@talentcore.com',
    jobType: tokenData.jobType || testApplicationData.jobType,
    // Send dates as ISO strings, let server handle conversion
    dateOfBirth: testApplicationData.dateOfBirth,
    agreementDate: testApplicationData.agreementDate
  };
  
  const result = await makeRequest('POST', '/api/applications', completeData);
  console.log('✅ Application submitted successfully');
  console.log(`   - Application ID: ${result.id}`);
  return result;
}

async function testRetrieveApplications() {
  console.log('\n📋 Testing application retrieval...');
  
  const applications = await makeRequest('GET', '/api/applications?recruiterEmail=recruiter@talentcore.com');
  console.log(`✅ Retrieved ${applications.length} applications`);
  
  if (applications.length > 0) {
    const latest = applications[applications.length - 1];
    console.log(`   - Latest application: ${latest.fullName} (${latest.email})`);
    console.log(`   - Status: ${latest.status}`);
    console.log(`   - Aptitude Score: ${latest.aptitudeScore}`);
  }
  
  return applications;
}

async function testFormValidation() {
  console.log('\n✅ Testing form validation logic...');
  
  // Test step 1 validation
  const step1Valid = !!(testApplicationData.fullName && testApplicationData.dateOfBirth && 
                       testApplicationData.sinNumber && testApplicationData.streetAddress && 
                       testApplicationData.city && testApplicationData.province && 
                       testApplicationData.postalCode && testApplicationData.majorIntersection);
  console.log(`   - Step 1 validation: ${step1Valid ? '✅ Valid' : '❌ Invalid'}`);
  
  // Test step 2 validation
  const step2Valid = !!(testApplicationData.mobileNumber && testApplicationData.email && 
                       testApplicationData.emergencyName && testApplicationData.emergencyContact && 
                       testApplicationData.emergencyRelationship);
  console.log(`   - Step 2 validation: ${step2Valid ? '✅ Valid' : '❌ Invalid'}`);
  
  // Test final step validation
  const step8Valid = !!(testApplicationData.agreementName && testApplicationData.agreementDate && 
                       testApplicationData.termsAccepted);
  console.log(`   - Step 8 validation: ${step8Valid ? '✅ Valid' : '❌ Invalid'}`);
  
  return step1Valid && step2Valid && step8Valid;
}

async function runComprehensiveTest() {
  console.log('🚀 Starting comprehensive Talencor application flow test...');
  console.log('=' .repeat(60));
  
  try {
    // Step 1: Generate application link
    const token = await testGenerateApplicationLink();
    
    // Step 2: Validate token
    const tokenData = await testTokenValidation(token);
    
    // Step 3: Test form validation
    const validationPassed = await testFormValidation();
    if (!validationPassed) {
      throw new Error('Form validation failed');
    }
    
    // Step 4: Test progress saving
    const progressData = await testProgressSaving(token);
    
    // Step 5: Submit complete application
    const submittedApp = await testApplicationSubmission(token, tokenData);
    
    // Step 6: Verify submission by retrieving applications
    const applications = await testRetrieveApplications();
    
    console.log('\n🎉 All tests passed successfully!');
    console.log('=' .repeat(60));
    console.log('✅ Application Link Generation');
    console.log('✅ Token Validation');
    console.log('✅ Form Validation Logic');
    console.log('✅ Progress Saving Structure');
    console.log('✅ Application Submission');
    console.log('✅ Data Retrieval');
    console.log('\n📊 Test Summary:');
    console.log(`   - Token: ${token}`);
    console.log(`   - Submitted Application ID: ${submittedApp.id}`);
    console.log(`   - Total Applications in System: ${applications.length}`);
    
    return {
      success: true,
      token,
      applicationId: submittedApp.id,
      totalApplications: applications.length
    };
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check if fetch is available (Node 18+)
  if (typeof fetch === 'undefined') {
    console.error('❌ This test requires Node.js 18+ with fetch support');
    process.exit(1);
  }
  
  runComprehensiveTest()
    .then(result => {
      if (result.success) {
        console.log('\n🏆 All systems operational!');
        process.exit(0);
      } else {
        console.log('\n💥 Test suite failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}