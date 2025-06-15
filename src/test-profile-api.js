/**
 * Test script to verify profile API functionality
 * Run this in the browser console to test the profile endpoints
 */

// Test the profile API endpoints
async function testProfileAPI() {
  console.log('🧪 Testing Profile API...');
  
  try {
    // Test 1: Get Profile
    console.log('\n1️⃣ Testing GET /profile...');
    const response = await fetch('/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-jwt-token-123'
      }
    });
    
    if (response.ok) {
      const profile = await response.json();
      console.log('✅ Profile fetched successfully:', profile);
    } else {
      console.error('❌ Failed to fetch profile:', response.status, response.statusText);
    }
    
    // Test 2: Update Profile
    console.log('\n2️⃣ Testing PUT /profile...');
    const updateResponse = await fetch('/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-jwt-token-123'
      },
      body: JSON.stringify({
        name: 'Updated Admin User',
        phone: '+1 (555) 999-8888'
      })
    });
    
    if (updateResponse.ok) {
      const updatedProfile = await updateResponse.json();
      console.log('✅ Profile updated successfully:', updatedProfile);
    } else {
      console.error('❌ Failed to update profile:', updateResponse.status, updateResponse.statusText);
    }
    
    // Test 3: Get Activity Log
    console.log('\n3️⃣ Testing GET /profile/activity...');
    const activityResponse = await fetch('/profile/activity', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-jwt-token-123'
      }
    });
    
    if (activityResponse.ok) {
      const activities = await activityResponse.json();
      console.log('✅ Activity log fetched successfully:', activities);
    } else {
      console.error('❌ Failed to fetch activity log:', activityResponse.status, activityResponse.statusText);
    }
    
    console.log('\n🎉 Profile API tests completed!');
    
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

// Auto-run the test if this script is loaded
if (typeof window !== 'undefined') {
  console.log('Profile API test script loaded. Run testProfileAPI() to test the endpoints.');
  // Uncomment the line below to auto-run the test
  // testProfileAPI();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testProfileAPI };
}
