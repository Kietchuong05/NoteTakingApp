import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Folders from "../pages/Folders.jsx";
import Notes from "../pages/Notes.jsx";
import Tags from "../pages/Tags.jsx";
import Layout from "../components/layout/Layout.jsx";
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
        <Layout />
      </ProtectedRoute>
    ),
    children: [

      {
        path: "folders", 
        element: <Folders />,
      },


      {
        path: "folders/:folderId",
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
      {
        path: "starred",
        element: <Notes />,
      },
      {
        path: "trash",
        element: <Notes />,
    },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);