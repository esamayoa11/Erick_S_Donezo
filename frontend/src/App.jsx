import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainLayout from "./layouts/main-layout";
import ProtectedRoute from "./components/protected-route";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Todos from "./pages/todos";
import { QueryClientProvider, QueryClient} from "@tanstack/react-query";


import { useEffect } from "react";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/todos" element={<MainLayout />}>
            <Route path="/todos" element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;