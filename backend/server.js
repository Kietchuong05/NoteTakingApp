import 'dotenv/config'; 
import express from 'express';
import cors from 'cors'; 
import { sequelize, connectDB } from './config/db.js'; 
import Note from './models/Note.js';

const app = express();
const PORT = process.env.PORT || 3000; 

// ====================================================
// 1. Cấu hình Middleware (PHẢI Ở TRÊN CÁC ROUTES)
// ====================================================
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Cho phép Frontend truy cập
    credentials: true
}));
app.use(express.json()); // Middleware để xử lý JSON body trong requests (ví dụ: POST)

// ====================================================
// 2. Định nghĩa các API Routes
// ====================================================

// A. ENDPOINT TEST (Health Check)
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend is running!',
        dbStatus: 'Connected and Synced'
    });
});

// B. ENDPOINT API MẪU (Lấy tất cả ghi chú)
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.findAll();
        res.json(notes);
    } catch (error) {
        console.error("Lỗi khi lấy ghi chú:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
});


// 3. Khởi động Server (Hàm giữ nguyên)
const startServer = async () => {
    // 3a. Kết nối và Đồng bộ Database
    try {
        await connectDB(); 
        await sequelize.sync({ alter: true }); 
        console.log("Database & tables synced!");
    } catch (error) {
        console.error("Failed to connect or sync database, exiting:", error);
        return; 
    }

    // 3b. Khởi động Server Express
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    });
};

startServer();