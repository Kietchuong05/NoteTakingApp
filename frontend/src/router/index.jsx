import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import Login from "../pages/login.jsx";
import Home from "../pages/Home.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const AuthLayout = () => {
  return <Outlet />;
};

export default createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <Login />,
        path: "/login",
      },
      {
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        path: "/",
      },
      {
        // Redirect mặc định
        path: "*",
        element: <Navigate to="/" replace />
      }
    ],
  },
]);