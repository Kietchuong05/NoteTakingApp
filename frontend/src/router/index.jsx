import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Folders from "../pages/Folders.jsx";
import Notes from "../pages/Notes.jsx";
import Tags from "../pages/Tags.jsx";
import Layout from "../components/layout/Layout.jsx"; // Import Layout
import ProtectedRoute from "../components/ProtectedRoute.jsx";

// ... Phần import giữ nguyên ...

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
      // 1. Route mặc định khi vào /folders (nếu có)
      {
        path: "folders", 
        element: <Folders />,
      },

      // 👇👇 2. QUAN TRỌNG: Route chi tiết folder (THÊM CÁI NÀY VÀO) 👇👇
      {
        path: "folders/:folderId", // Dấu hai chấm ":" cực kỳ quan trọng
        element: <Folders />,      // Nó sẽ dùng lại trang Folders.jsx để hiện chi tiết
      },
      // -------------------------------------------------------------

      {
        path: "notes",
        element: <Notes />,
      },
      {
        path: "tags",
        element: <Tags />,
      },
      {
        path: "starred", // Đường dẫn mới cho mục Gắn sao
        element: <Notes />, // Vẫn dùng giao diện Notes để hiển thị
      },
      {
        path: "trash",
        element: <Notes />, // Vẫn dùng chung file Notes.jsx
    },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);