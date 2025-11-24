// backend/models/Note.js
import { DataTypes } from 'sequelize'; // <--- Dùng import
import { sequelize } from '../config/db.js'; // <--- Dùng import VÀ THÊM .js

const Note = sequelize.define('Note', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
    },
});

export default Note; // <--- Dùng export default