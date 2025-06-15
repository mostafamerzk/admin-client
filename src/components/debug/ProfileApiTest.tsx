/**
 * Profile API Test Component
 * 
 * This component is used to test the profile API endpoints directly.
 * It can be temporarily added to any page to debug API issues.
 */

import React, { useState } from 'react';
import profileApi from '../../features/profile/api/profileApi';
import apiClient from '../../api';

const ProfileApiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testProfileAPI = async () => {
    setIsLoading(true);
    setTestResult('Testing profile API...\n');
    
    try {
      // Test 1: Get Profile
      setTestResult(prev => prev + '\n1️⃣ Testing getProfile()...\n');
      const profile = await profileApi.getProfile();
      setTestResult(prev => prev + `✅ Profile fetched successfully: ${JSON.stringify(profile, null, 2)}\n`);
      
      // Test 2: Get Activity Log
      setTestResult(prev => prev + '\n2️⃣ Testing getActivityLog()...\n');
      try {
        const activities = await profileApi.getActivityLog();
        setTestResult(prev => prev + `✅ Activity log fetched successfully: ${activities.length} items\n`);
        setTestResult(prev => prev + `   First activity: ${JSON.stringify(activities[0], null, 2)}\n`);
      } catch (activityError) {
        const activityErrorMessage = activityError instanceof Error ? activityError.message : 'Unknown activity error';
        setTestResult(prev => prev + `❌ Activity log failed: ${activityErrorMessage}\n`);
        console.error('Activity log error details:', activityError);
        // Continue with other tests
      }

      // Test 3: Direct API client test
      setTestResult(prev => prev + '\n3️⃣ Testing direct API client call...\n');
      try {
        const directResponse = await apiClient.get('/profile/activity');
        setTestResult(prev => prev + `✅ Direct API call successful: ${JSON.stringify(directResponse, null, 2)}\n`);
      } catch (directError) {
        const directErrorMessage = directError instanceof Error ? directError.message : 'Unknown direct error';
        setTestResult(prev => prev + `❌ Direct API call failed: ${directErrorMessage}\n`);
        console.error('Direct API error details:', directError);
      }

      setTestResult(prev => prev + '\n🎉 All tests completed!\n');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(prev => prev + `❌ Test failed: ${errorMessage}\n`);
      console.error('Profile API test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
      <h3 className="text-lg font-semibold mb-3">🧪 Profile API Test</h3>
      
      <button
        onClick={testProfileAPI}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-3"
      >
        {isLoading ? 'Testing...' : 'Test Profile API'}
      </button>
      
      {testResult && (
        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
          {testResult}
        </div>
      )}
    </div>
  );
};

export default ProfileApiTest;
