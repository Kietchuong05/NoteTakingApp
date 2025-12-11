// Folders.jsx
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge
} from '@mui/material';
import {
  Folder as FolderIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Share as ShareIcon,
  ShareOutlined as ShareOutlinedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  Note as NoteIcon,
  Label as LabelIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useFolders } from '../hooks/useFolders';
import { useNotes } from '../hooks/useNotes';
import { format } from 'date-fns';

export default function Folders() {
  const { folders, loading, addFolder, updateFolder, deleteFolder, toggleStarFolder, toggleShareFolder } = useFolders();
  const { notes, getNotesByFolder } = useNotes();
  const [openDialog, setOpenDialog] = useState(false);
  const [openNotesDrawer, setOpenNotesDrawer] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newFolder, setNewFolder] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });

  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // orange
    '#8b5cf6', // purple
    '#ef4444', // red
    '#06b6d4', // cyan
  ];

  const handleOpenDialog = (folder = null) => {
    if (folder) {
      setEditingFolder(folder);
      setNewFolder({
        name: folder.name,
        description: folder.description || '',
        color: folder.color
      });
    } else {
      setEditingFolder(null);
      setNewFolder({
        name: '',
        description: '',
        color: '#3b82f6'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFolder(null);
    setNewFolder({ name: '', description: '', color: '#3b82f6' });
  };

  const handleOpenNotesDrawer = (folder) => {
    setSelectedFolder(folder);
    setOpenNotesDrawer(true);
  };

  const handleCloseNotesDrawer = () => {
    setOpenNotesDrawer(false);
    setSelectedFolder(null);
  };

  const getFolderNotes = (folderId) => {
    return getNotesByFolder(folderId);
  };

  const handleSubmit = () => {
    if (!newFolder.name.trim()) return;

    if (editingFolder) {
      updateFolder(editingFolder.id, newFolder);
    } else {
      addFolder(newFolder);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thư mục này?')) {
      deleteFolder(id);
    }
  };

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
            Thư mục
          </Typography>
          <Typography variant="body2" color="#64748b">
            Quản lý tất cả thư mục ghi chú của bạn
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: '#3b82f6',
            '&:hover': { backgroundColor: '#2563eb' }
          }}
        >
          Thư mục mới
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm thư mục..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </Box>

      {filteredFolders.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2, mb: 3 }}>
          {searchQuery ? 'Không tìm thấy thư mục phù hợp' : 'Chưa có thư mục nào. Hãy tạo thư mục đầu tiên!'}
        </Alert>
      ) : null}

      {/* Folders Grid */}
      <Grid container spacing={3}>
        {filteredFolders.map((folder) => {
          const folderNotes = getFolderNotes(folder.id);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  borderLeft: `6px solid ${folder.color}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          backgroundColor: `${folder.color}20`,
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FolderIcon sx={{ fontSize: 28, color: folder.color }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                          {folder.name}
                        </Typography>
                        <Chip
                          label={`${folderNotes.length} ghi chú`}
                          size="small"
                          sx={{
                            mt: 0.5,
                            height: 20,
                            fontSize: '0.7rem',
                            backgroundColor: '#f1f5f9',
                            color: '#64748b',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#e2e8f0'
                            }
                          }}
                          onClick={() => handleOpenNotesDrawer(folder)}
                        />
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() => toggleStarFolder(folder.id)}
                      size="small"
                      sx={{ color: folder.starred ? '#f59e0b' : '#cbd5e1' }}
                    >
                      {folder.starred ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Box>

                  {folder.description && (
                    <Typography
                      variant="body2"
                      color="#64748b"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {folder.description}
                    </Typography>
                  )}

                  {/* Hiển thị 2 note mới nhất */}
                  {folderNotes.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="#64748b" sx={{ display: 'block', mb: 1 }}>
                        Ghi chú gần đây:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {folderNotes.slice(0, 2).map((note) => (
                          <Box
                            key={note.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1,
                              borderRadius: 1,
                              backgroundColor: '#f8fafc',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#f1f5f9'
                              }
                            }}
                            onClick={() => handleOpenNotesDrawer(folder)}
                          >
                            <NoteIcon sx={{ fontSize: 16, color: folder.color }} />
                            <Typography variant="caption" sx={{ flex: 1 }}>
                              {note.title}
                            </Typography>
                          </Box>
                        ))}
                        {folderNotes.length > 2 && (
                          <Typography variant="caption" color="#64748b" sx={{ textAlign: 'center' }}>
                            +{folderNotes.length - 2} ghi chú khác
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                      <Typography variant="caption" color="#94a3b8">
                        {format(new Date(folder.updatedAt), 'dd/MM/yyyy')}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => handleOpenNotesDrawer(folder)}
                      sx={{
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        color: folder.color,
                        '&:hover': {
                          backgroundColor: `${folder.color}10`
                        }
                      }}
                    >
                      Xem ghi chú
                    </Button>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, borderTop: '1px solid #e2e8f0' }}>
                  <Tooltip title={folder.shared ? "Đã chia sẻ" : "Chia sẻ"}>
                    <IconButton
                      onClick={() => toggleShareFolder(folder.id)}
                      size="small"
                      sx={{ color: folder.shared ? '#3b82f6' : '#64748b' }}
                    >
                      {folder.shared ? <ShareIcon /> : <ShareOutlinedIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      onClick={() => handleOpenDialog(folder)}
                      size="small"
                      sx={{ color: '#64748b' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      onClick={() => handleDelete(folder.id)}
                      size="small"
                      sx={{ color: '#ef4444' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Drawer hiển thị notes trong thư mục */}
      <Drawer
        anchor="right"
        open={openNotesDrawer}
        onClose={handleCloseNotesDrawer}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 500 },
            p: 3
          }
        }}
      >
        {selectedFolder && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    backgroundColor: `${selectedFolder.color}20`,
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FolderIcon sx={{ fontSize: 28, color: selectedFolder.color }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                    {selectedFolder.name}
                  </Typography>
                  <Typography variant="body2" color="#64748b">
                    {selectedFolder.description}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={handleCloseNotesDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>
              Ghi chú ({getFolderNotes(selectedFolder.id).length})
            </Typography>

            {getFolderNotes(selectedFolder.id).length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Chưa có ghi chú nào trong thư mục này
              </Alert>
            ) : (
              <List sx={{ p: 0 }}>
                {getFolderNotes(selectedFolder.id).map((note) => (
                  <ListItem
                    key={note.id}
                    sx={{
                      mb: 1,
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                        borderColor: selectedFolder.color
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <NoteIcon sx={{ color: selectedFolder.color }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {note.title}
                          </Typography>
                          {note.starred && <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />}
                          {note.shared && <ShareIcon sx={{ fontSize: 16, color: '#3b82f6' }} />}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="#64748b"
                            sx={{
                              mb: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {note.content.replace(/#/g, '').substring(0, 100)}...
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {note.tags?.slice(0, 2).map((tag, index) => (
                                <Chip
                                  key={index}
                                  label={tag}
                                  size="small"
                                  sx={{
                                    fontSize: '0.65rem',
                                    height: 20,
                                    backgroundColor: '#f1f5f9',
                                    color: '#64748b'
                                  }}
                                />
                              ))}
                            </Box>
                            <Typography variant="caption" color="#94a3b8">
                              {format(new Date(note.updatedAt), 'dd/MM/yyyy')}
                            </Typography>
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </Drawer>

      {/* Add/Edit Folder Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingFolder ? 'Chỉnh sửa thư mục' : 'Thư mục mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên thư mục"
            fullWidth
            value={newFolder.name}
            onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            multiline
            rows={3}
            value={newFolder.description}
            onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
            sx={{ mb: 3 }}
          />
          
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#64748b' }}>
            Chọn màu:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            {colors.map((color) => (
              <Box
                key={color}
                onClick={() => setNewFolder({ ...newFolder, color })}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: color,
                  cursor: 'pointer',
                  border: newFolder.color === color ? '3px solid #1e293b' : 'none',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!newFolder.name.trim()}
          >
            {editingFolder ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}