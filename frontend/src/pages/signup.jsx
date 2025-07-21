import { Link } from "react-router-dom";

export default function Signup(){
  return (
   <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
          {/* Render SignUpAlert here... */}
          {/* Render SignupForm here... */}
        <p className="mt-4 text-center text-sm">Have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link></p>
      </div>
    </div> 
  )
}
