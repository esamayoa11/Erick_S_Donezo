// Import the Supabase client creation function
import { createClient } from '@supabase/supabase-js';

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_ROLE_KEY set:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

// Grab environment variables for the Supabase project URL and service role key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Throw an error if required environment variables are missing to avoid silent failures
if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

// Create a Supabase client using your project's URL and service role key
const supabase = createClient(
  supabaseUrl,               // Supabase project URL
  supabaseServiceRoleKey     // Supabase service role key (must remain secret)
);

// Middleware function to verify the JSON Web Token (JWT)
const verifyToken = async (req, res, next) => {
  // Extract the token from the Authorization header (if it exists)
  const token = req.headers.authorization?.split(' ')[1];

  // If no token is provided, respond with a 401 Unauthorized status
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Use Supabase's built-in auth method to validate the access token
  const { data, error } = await supabase.auth.getUser(token);

  // If the token is invalid or expired, respond with a 401 Unauthorized status
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Attach the validated user information to the request object
  req.user = data.user;

  // Proceed to the next middleware or route handler
  next();
};

// Export the middleware function for use in protected routes
export default verifyToken;
