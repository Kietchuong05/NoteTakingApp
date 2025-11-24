// backend/config/db.js
import { Sequelize } from 'sequelize'; // <--- Dùng import

// Lấy biến môi trường từ Docker Compose (hoặc .env nếu chạy local)
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

// Khởi tạo Sequelize Instance
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'mysql', 
    logging: false, 
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Hàm kiểm tra kết nối
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection to MySQL has been established successfully.');
        return sequelize;
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

// <--- Dùng export
export { sequelize, connectDB };