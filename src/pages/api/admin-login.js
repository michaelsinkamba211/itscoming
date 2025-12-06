// src/pages/api/admin-login.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    
    // Get password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // For debugging
    console.log('Received password:', password);
    console.log('Expected password from env:', adminPassword ? 'Loaded' : 'NOT LOADED');
    
    if (!adminPassword) {
      console.error('❌ ADMIN_PASSWORD not found in environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error',
        valid: false 
      });
    }
    
    // Check if password matches
    const isValid = password === adminPassword;
    
    return res.status(200).json({ 
      valid: isValid,
      message: isValid ? 'Login successful' : 'Invalid password'
    });
    
  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      valid: false 
    });
  }
}