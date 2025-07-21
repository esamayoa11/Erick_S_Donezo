import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import supabase from "../client";

export default function Login() {
  // alert state for login feedback 
  const [alert, showAlert] = useState({
    message: "",
    show: false
  });

  // For redirecting on success
  const navigate = useNavigate();

  // setup react-hook-form 
const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // login logic with supabase 
  const loginUser = async (values) => {
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      // Show the error in an alert
      showAlert({
        show: true,
        message: error.message
      });
    } else {
      // Go to todos page on success
      navigate("/todos");
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {/* Use LoginAlert with props */}
        <LoginAlert alert={alert} showAlert={showAlert} />

        {/* Only one LoginForm with props */}
        <LoginForm handleSubmit={handleSubmit} loginUser={loginUser} register={register} />

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
// Updated to receive props
function LoginForm({ handleSubmit, loginUser, register }) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit(loginUser)}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="input input-bordered w-full"
          {...register("email")}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="input input-bordered w-full"
          {...register("password")}
        />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        Login
      </button>
    </form>
  );
}

// Updated to receive props
function LoginAlert({ alert, showAlert }) {
  return (
    <>
      {
        alert.show && (
          <div className="alert alert-error">
            <div className="inline-flex justify-stretch items-center w-full justify-between">
              {alert.message}
              <button 
                onClick={() => showAlert({ message: "", show: false })} 
                className="btn btn-ghost btn-circle"
              >
                X
              </button>
            </div>
          </div>
        )
      }
    </>
  );
}
