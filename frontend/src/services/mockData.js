// Mock data for development
export const mockFolders = [
  { 
    id: 1, 
    name: "Công việc", 
    color: "#3b82f6", 
    noteCount: 12,
    starred: true,
    shared: true,
    description: "Ghi chú công việc hàng ngày, báo cáo dự án",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-20')
  },
  { 
    id: 2, 
    name: "Học tập", 
    color: "#10b981", 
    noteCount: 8,
    starred: true,
    shared: false,
    description: "Tài liệu môn học và ghi chú bài giảng",
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-18')
  },
  { 
    id: 3, 
    name: "Cá nhân", 
    color: "#f59e0b", 
    noteCount: 5,
    starred: false,
    shared: false,
    description: "Nhật ký, danh sách việc cần làm",
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-19')
  },
  { 
    id: 4, 
    name: "Dự án mới", 
    color: "#8b5cf6", 
    noteCount: 3,
    starred: false,
    shared: true,
    description: "Kế hoạch phát triển ứng dụng di động",
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-15')
  }
];

export const mockNotes = [
  {
    id: 1,
    title: "Kế hoạch tuần",
    content: "# Kế hoạch tuần này\n\n## Thứ 2\n- Họp team\n- Code review\n\n## Thứ 3\n- Phát triển tính năng mới\n- Viết documentation",
    folderId: 1,
    tags: ["công việc", "kế hoạch"],
    starred: true,
    shared: true,
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: 2,
    title: "Ghi chú React Hooks",
    content: "## useState\nDùng để quản lý state\n\n## useEffect\nXử lý side effects\n\n## useContext\nQuản lý global state",
    folderId: 2,
    tags: ["react", "hooks", "frontend"],
    starred: true,
    shared: false,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-19')
  },
  {
    id: 3,
    title: "Mua sắm",
    content: "- Sữa\n- Trứng\n- Bánh mì\n- Trái cây\n- Thịt gà",
    folderId: 3,
    tags: ["cá nhân", "mua sắm"],
    starred: false,
    shared: false,
    createdAt: new Date('2024-03-19'),
    updatedAt: new Date('2024-03-19')
  },
  {
    id: 4,
    title: "Meeting Notes",
    content: "## Nội dung cuộc họp\n1. Review sprint\n2. Planning next sprint\n3. Technical discussions",
    folderId: 1,
    tags: ["meeting", "work"],
    starred: false,
    shared: true,
    createdAt: new Date('2024-03-17'),  
    updatedAt: new Date('2024-03-18')
  }
];

export const mockTags = [
  { id: 1, name: "công việc", color: "#3b82f6", count: 8 },
  { id: 2, name: "học tập", color: "#10b981", count: 5 },
  { id: 3, name: "cá nhân", color: "#f59e0b", count: 3 },
  { id: 4, name: "react", color: "#61dafb", count: 4 },
  { id: 5, name: "javascript", color: "#f0db4f", count: 6 }
];