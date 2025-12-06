// src/pages/api/test-env.js
export default function handler(req, res) {
  // Log all env variables (without exposing sensitive values)
  const envInfo = {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '✓ LOADED' : '✗ NOT LOADED',
    NODE_ENV: process.env.NODE_ENV,
    // Don't log the actual password!
  };
  
  console.log('Environment check:', envInfo);
  
  return res.status(200).json(envInfo);
}