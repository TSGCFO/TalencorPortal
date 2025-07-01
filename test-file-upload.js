/**
 * Test file upload functionality with Replit Object Storage
 */

import FormData from 'form-data';
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testFileUpload() {
    console.log('🔧 Testing Replit Object Storage file upload...');
    
    try {
        // First generate a token
        const linkResponse = await fetch(`${BASE_URL}/api/generate-link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                applicantEmail: 'test@example.com',
                recruiterEmail: 'recruiter@talentcore.com',
                jobType: 'warehouse',
                customMessage: 'Test upload'
            })
        });
        
        const linkData = await linkResponse.json();
        console.log('✅ Token generated:', linkData.token);
        
        // Create a test PDF file content (minimal valid PDF)
        const testPdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF';
        const testFileName = 'test-document.pdf';
        
        // Create form data
        const form = new FormData();
        form.append('files', Buffer.from(testPdfContent), {
            filename: testFileName,
            contentType: 'application/pdf'
        });
        
        // Upload file
        const uploadResponse = await fetch(`${BASE_URL}/api/upload/${linkData.token}`, {
            method: 'POST',
            body: form
        });
        
        const uploadResult = await uploadResponse.json();
        console.log('✅ File upload result:', uploadResult);
        
        if (uploadResult.success && uploadResult.files && uploadResult.files.length > 0) {
            const fileInfo = uploadResult.files[0];
            console.log('✅ File stored successfully:');
            console.log('   - File ID:', fileInfo.fileId);
            console.log('   - Download URL:', fileInfo.url);
            
            // Test file download
            const downloadResponse = await fetch(`${BASE_URL}${fileInfo.url}`);
            
            if (downloadResponse.ok) {
                const downloadedContent = await downloadResponse.text();
                console.log('✅ File download successful');
                console.log('   - Content matches:', downloadedContent === testContent);
            } else {
                console.log('❌ File download failed:', downloadResponse.status);
            }
        } else {
            console.log('❌ File upload failed:', uploadResult);
        }
        
        console.log('🎉 Replit Object Storage test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testFileUpload();