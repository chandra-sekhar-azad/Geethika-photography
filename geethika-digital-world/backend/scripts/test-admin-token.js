import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('🔄 Testing JWT token validation...\n');

// Example token - replace with actual token from localStorage
const testToken = process.argv[2];

if (!testToken) {
  console.log('Usage: node test-admin-token.js <your-token>');
  console.log('\nTo get your token:');
  console.log('1. Open browser DevTools (F12)');
  console.log('2. Go to Console tab');
  console.log('3. Type: localStorage.getItem("token")');
  console.log('4. Copy the token and run: node test-admin-token.js <token>');
  process.exit(0);
}

try {
  console.log('JWT_SECRET configured:', process.env.JWT_SECRET ? 'Yes' : 'No');
  console.log('Token length:', testToken.length);
  console.log('\nDecoding token...\n');

  const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
  
  console.log('✅ Token is valid!');
  console.log('\nToken contents:');
  console.log('  User ID:', decoded.id);
  console.log('  Email:', decoded.email);
  console.log('  Role:', decoded.role);
  console.log('  Issued at:', new Date(decoded.iat * 1000).toLocaleString());
  console.log('  Expires at:', decoded.exp ? new Date(decoded.exp * 1000).toLocaleString() : 'Never');

  if (decoded.role !== 'admin') {
    console.log('\n⚠️  WARNING: User is not an admin!');
  } else {
    console.log('\n✅ User has admin privileges');
  }

} catch (error) {
  console.error('❌ Token validation failed!');
  console.error('Error:', error.message);
  
  if (error.name === 'TokenExpiredError') {
    console.log('\n💡 Token has expired. Please log in again.');
  } else if (error.name === 'JsonWebTokenError') {
    console.log('\n💡 Token is invalid or malformed.');
  }
}
