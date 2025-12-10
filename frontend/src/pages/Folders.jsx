import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import FolderCard from "../components/folders/FolderCard";
import FolderForm from "../components/folders/FolderForm";
import SearchBar from "../components/shared/SearchBar";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  IconButton
} from "@mui/material";
import {
  Add as AddIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  Share as ShareIcon
} from "@mui/icons-material";
import "../styles/pages/folders.css";

export default function Folders() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [openForm, setOpenForm] = useState(false);

  // Dữ liệu mẫu
  const folders = [
    { id: 1, name: "Công việc", noteCount: 12, color: "#3b82f6", lastModified: "2024-01-15", description: "Ghi chú công việc và dự án", isStarred: true, shared: false },
    { id: 2, name: "Học tập", noteCount: 8, color: "#10b981", lastModified: "2024-01-14", description: "Tài liệu học tập và nghiên cứu", isStarred: true, shared: true },
    { id: 3, name: "Cá nhân", noteCount: 5, color: "#f59e0b", lastModified: "2024-01-13", description: "Ghi chú cá nhân và nhật ký", isStarred: false, shared: false },
    { id: 4, name: "Dự án", noteCount: 3, color: "#8b5cf6", lastModified: "2024-01-12", description: "Quản lý các dự án đang thực hiện", isStarred: false, shared: true },
    { id: 5, name: "Ý tưởng", noteCount: 15, color: "#ef4444", lastModified: "2024-01-11", description: "Lưu trữ các ý tưởng sáng tạo", isStarred: true, shared: false },
    { id: 6, name: "Tài liệu", noteCount: 7, color: "#06b6d4", lastModified: "2024-01-10", description: "Tài liệu tham khảo và ebook", isStarred: false, shared: true },
  ];

  const filteredFolders = folders.filter(folder => {
    if (filter === 'starred' && !folder.isStarred) return false;
    if (filter === 'shared' && !folder.shared) return false;
    if (searchQuery) {
      return folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             folder.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <Layout>
      <Box className="folders-page">
        {/* Header */}
        <Paper className="page-header" elevation={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Quản Lý Thư Mục
              </Typography>
              <Typography variant="body1" color="#64748b">
                Tổ chức và quản lý các thư mục ghi chú của bạn
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
              sx={{
                background: 'linear-gradient(45deg, #3b82f6 30%, #1d4ed8 90%)',
                borderRadius: '10px',
                px: 3
              }}
            >
              Thêm thư mục
            </Button>
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FilterIcon sx={{ color: '#64748b' }} />
              <Chip
                label="Tất cả"
                onClick={() => setFilter('all')}
                color={filter === 'all' ? 'primary' : 'default'}
                variant={filter === 'all' ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<StarIcon />}
                label="Gắn sao"
                onClick={() => setFilter('starred')}
                color={filter === 'starred' ? 'primary' : 'default'}
                variant={filter === 'starred' ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<ShareIcon />}
                label="Chia sẻ"
                onClick={() => setFilter('shared')}
                color={filter === 'shared' ? 'primary' : 'default'}
                variant={filter === 'shared' ? 'filled' : 'outlined'}
              />
            </Box>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="grid">
                <GridViewIcon />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Paper>

        {/* Stats */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Paper className="summary-card">
                <Typography variant="h5" fontWeight="bold">
                  {folders.length}
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Tổng thư mục
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className="summary-card">
                <Typography variant="h5" fontWeight="bold">
                  {folders.reduce((sum, f) => sum + f.noteCount, 0)}
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Tổng ghi chú
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className="summary-card">
                <Typography variant="h5" fontWeight="bold">
                  {folders.filter(f => f.isStarred).length}
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Được gắn sao
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className="summary-card">
                <Typography variant="h5" fontWeight="bold">
                  {folders.filter(f => f.shared).length}
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Được chia sẻ
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Folders Grid/List */}
        {viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {filteredFolders.map((folder) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
                <FolderCard folder={folder} viewMode={viewMode} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box className="folders-list">
            {filteredFolders.map((folder) => (
              <FolderCard folder={folder} viewMode={viewMode} key={folder.id} />
            ))}
          </Box>
        )}

        {/* Empty State */}
        {filteredFolders.length === 0 && (
          <Paper className="empty-state">
            <Typography variant="h6" color="#64748b">
              Không tìm thấy thư mục nào
            </Typography>
          </Paper>
        )}

        {/* Folder Form Dialog */}
        <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
          <FolderForm onClose={() => setOpenForm(false)} />
        </Dialog>
      </Box>
    </Layout>
  );
}