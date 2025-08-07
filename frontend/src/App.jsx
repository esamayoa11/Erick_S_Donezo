import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainLayout from "./layouts/main-layout";
import ProtectedRoute from "./components/protected-route";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Todos from "./pages/todos";
import { QueryClientProvider, QueryClient} from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import supabase from "./client";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Routes>
          {/* Redirect / to /todos */}
          <Route path="/" element={<Navigate to="/todos" />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Todos Route inside MainLayout */}
          <Route path="/todos" element={<MainLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Todos />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all route for 404s */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;