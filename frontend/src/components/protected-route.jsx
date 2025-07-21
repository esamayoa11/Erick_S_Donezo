// 33. Add the following imports to protected-route.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../client";

// 34. inside ProtectedRoute, add two useState handlers
export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState();
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  // 35. add the useEffect to handle session check and auth listener 
  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(() => session ?? null);
      setIsSessionChecked(() => true);
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(() => session ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 36. Add conditional logic below UseEffect 
  if (!isSessionChecked) {
    return <div>Loading...</div>;
  } else {
    return <>{session ? children : <Navigate to="/login" />}</>;
  }
}