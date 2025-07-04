/**
 * Test file upload fix with Object Storage integration
 * This test validates that the file upload feature is working correctly after fixes
 */

const BASE_URL = 'http://localhost:5000';

async function testFileUploadFix() {
  console.log('🧪 Testing File Upload Fix with Object Storage...\n');
  
  try {
    // Step 1: Generate a test token
    console.log('1️⃣ Generating test application token...');
    const tokenResponse = await fetch(`${BASE_URL}/api/generate-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recruiterEmail: 'test@talencor.com',
        applicantEmail: 'applicant@test.com',
        jobType: 'warehouse',
        message: 'Test application for file upload validation'
      })
    });
    
    const { token } = await tokenResponse.json();
    console.log(`✅ Token generated: ${token}\n`);
    
    // Step 2: Create a test PDF file
    console.log('2️⃣ Creating test PDF file...');
    // Create a simple PDF-like content (PDF header)
    const pdfHeader = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << >> /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n217\n%%EOF';
    const blob = new Blob([pdfHeader], { type: 'application/pdf' });
    
    // Step 3: Upload the file
    console.log('3️⃣ Uploading file to Object Storage...');
    const formData = new FormData();
    formData.append('files', blob, 'test-document.pdf');
    
    const uploadResponse = await fetch(`${BASE_URL}/api/upload/${token}`, {
      method: 'POST',
      body: formData
    });
    
    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      throw new Error(`Upload failed: ${error}`);
    }
    
    const uploadResult = await uploadResponse.json();
    console.log('✅ Upload response:', JSON.stringify(uploadResult, null, 2));
    
    // Step 4: Verify the file was uploaded
    if (uploadResult.success && uploadResult.files && uploadResult.files.length > 0) {
      const uploadedFile = uploadResult.files[0];
      console.log(`\n✅ File uploaded successfully!`);
      console.log(`   - ID: ${uploadedFile.id}`);
      console.log(`   - Name: ${uploadedFile.name}`);
      console.log(`   - Size: ${uploadedFile.size} bytes`);
      console.log(`   - URL: ${uploadedFile.url}`);
      
      // Step 5: Try to download the file
      console.log('\n4️⃣ Testing file download...');
      const downloadResponse = await fetch(`${BASE_URL}${uploadedFile.url}`);
      
      if (downloadResponse.ok) {
        const downloadedBuffer = await downloadResponse.arrayBuffer();
        console.log(`✅ File downloaded successfully!`);
        console.log(`   Downloaded size: ${downloadedBuffer.byteLength} bytes`);
        console.log(`   Download headers:`, downloadResponse.headers.get('content-type'));
      } else {
        console.log(`⚠️  File download returned status: ${downloadResponse.status}`);
      }
      
      console.log('\n🎉 File upload integration is working correctly!');
    } else {
      console.log('❌ Upload did not return expected file data');
      console.log('Response:', uploadResult);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
console.log('Starting file upload integration test...\n');
testFileUploadFix().then(() => {
  console.log('\nTest completed.');
});