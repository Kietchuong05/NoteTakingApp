const BASE_URL = import.meta.env.VITE_API_URL;

const headers = {
  'Content-Type': 'application/json',
};

export const syncUser = async (user) => {
  try {
    await fetch(`${BASE_URL}/users/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        id: user.uid,
        email: user.email,
        display_name: user.displayName || "No Name"
      })
    });
  } catch (error) {
    console.error("Lỗi sync user:", error);
  }
};

export const getFolders = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/folders/?user_id=${userId}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const createFolder = async (name, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/folders/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ name, user_id: userId }),
    });
    if (!response.ok) throw new Error("Lỗi tạo folder");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTags = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/tags/?user_id=${userId}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const createTag = async (name, color, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/tags/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          name: name, 
          color: color || '#3b82f6', 
          user_id: userId 
      }),
    });
    if (!response.ok) throw new Error("Lỗi tạo tag");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteTag = async (tagId) => {
  try {
    const response = await fetch(`${BASE_URL}/tags/${tagId}`, {
      method: 'DELETE',
    });
    return response.ok; // Trả về true nếu xóa thành công
  } catch (error) {
    console.error("Lỗi xóa tag:", error);
    return false;
  }
};

export const updateTag = async (tagId, name, color, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/tags/${tagId}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ 
          name: name, 
          color: color, 
          user_id: userId
      }),
    });
    
    if (!response.ok) throw new Error("Lỗi sửa tag");
    return await response.json(); // Trả về tag mới đã sửa
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 1. Lấy danh sách ghi chú
export const getNotes = async (userId, folderId = null, isDeleted = false) => {
  try {
    let url = `${BASE_URL}/notes/?user_id=${userId}&is_deleted=${isDeleted}`;
    
    if (folderId) {
      url += `&folder_id=${folderId}`;
    }

    const response = await fetch(url);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
};

// 2. Tạo ghi chú
export const createNote = async (title, content, folderId, tagIds, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/notes/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
        title: title,
        content: content,
        folder_id: folderId || null,
        user_id: userId,
        tag_ids: tagIds || [] 
      }),
    });
    if (!response.ok) throw new Error("Lỗi tạo note");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 3. Sửa ghi chú (Update)
export const updateNote = async (noteId, updateData) => {
  try {
    const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error("Lỗi sửa note");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 4. Xóa mềm (Chuyển vào thùng rác) - ĐÂY LÀ CÁI EM ĐANG THIẾU
export const deleteNote = async (noteId) => {
  try {
    const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
    });
    return response.ok; 
  } catch (error) {
    console.error(error);
    return false;
  }
};

// 5. Xóa vĩnh viễn (Hard Delete)
export const deleteNotePermanently = async (noteId) => {
  try {
    const response = await fetch(`${BASE_URL}/notes/${noteId}/permanent`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const restoreNote = async (noteId) => {
  try {
    const response = await fetch(`${BASE_URL}/notes/${noteId}/restore`, {
      method: 'POST',
    });
    return response.ok;
  } catch (error) {
    console.error("Lỗi restore:", error);
    return false;
  }
};