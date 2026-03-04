// Simple test script to check if the server is responding
const axios = require('axios');

async function testServer() {
  console.log('Testing backend server...\n');
  
  // Test 1: Check if server is running
  try {
    const response = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { 'x-auth-token': 'test-token' },
      validateStatus: () => true // Accept any status code
    });
    
    console.log('✓ Server is responding');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
    if (response.status === 401) {
      console.log('\n✓ Auth middleware is working (401 for invalid token)');
    }
  } catch (err) {
    console.log('✗ Server is not responding');
    console.log('Error:', err.message);
    
    if (err.code === 'ECONNREFUSED') {
      console.log('\n⚠️  Backend server is not running on port 5000');
      console.log('Please start the server with: npm run dev');
    }
  }
}

testServer();
