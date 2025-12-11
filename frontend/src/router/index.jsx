import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Folders from "../pages/Folders.jsx";
import Notes from "../pages/Notes.jsx";
import Tags from "../pages/Tags.jsx";
import Layout from "../components/layout/Layout.jsx"; // Import Layout
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export default createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout /> {/* Layout sẽ chứa các route con */}
      </ProtectedRoute>
    ),
    children: [ // Thêm children routes
      
      {
        path: "folders",
        element: <Folders />,
      },
      {
        path: "notes",
        element: <Notes />,
      },
      {
        path: "tags",
        element: <Tags />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);