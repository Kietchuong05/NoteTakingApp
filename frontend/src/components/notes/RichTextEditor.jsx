import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';  
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style'; 
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';

import {
  Box, ButtonGroup, IconButton, Popover, TextField, Divider, Tooltip,
  ToggleButtonGroup, ToggleButton, Button, Typography as MuiTypography
} from '@mui/material';
import {
  FormatBold, FormatItalic, FormatUnderlined,
  FormatListBulleted, FormatListNumbered,
  FormatQuote, FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
  FormatClear, FormatColorText, FormatColorFill, InsertLink,
  Code, Check, Close,
  Undo, Redo, FormatStrikethrough, Highlight as HighlightIcon,
  LooksOne, LooksTwo, Looks3
} from '@mui/icons-material';

const RichTextEditor = ({ content, onChange, placeholder = 'Nhập nội dung ghi chú...' }) => {
  const [linkMenuAnchor, setLinkMenuAnchor] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [textColorAnchor, setTextColorAnchor] = useState(null);
  const [highlightColorAnchor, setHighlightColorAnchor] = useState(null);
  const [headingLevel, setHeadingLevel] = useState(null);
  const linkInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
        },
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Underline,  
      TextStyle,  
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'rich-text-link',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Typography,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content',
        spellcheck: 'true',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  const handleOpenLinkMenu = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkMenuAnchor(linkInputRef.current);
  };

  const handleSetLink = () => {
    if (linkUrl) {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setLinkMenuAnchor(null);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    setLinkMenuAnchor(null);
  };

  const textColors = [
    { name: 'Đen', value: '#000000' },
    { name: 'Xám đậm', value: '#374151' },
    { name: 'Xám', value: '#6B7280' },
    { name: 'Xám nhạt', value: '#9CA3AF' },
    { name: 'Đỏ', value: '#DC2626' },
    { name: 'Cam', value: '#F97316' },
    { name: 'Vàng', value: '#EAB308' },
    { name: 'Xanh lá', value: '#16A34A' },
    { name: 'Xanh dương', value: '#2563EB' },
    { name: 'Tím', value: '#7C3AED' },
    { name: 'Hồng', value: '#DB2777' },
  ];

  const highlightColors = [
    { name: 'Vàng nhạt', value: '#FEF3C7' },
    { name: 'Xanh lá nhạt', value: '#DCFCE7' },
    { name: 'Xanh dương nhạt', value: '#DBEAFE' },
    { name: 'Hồng nhạt', value: '#FCE7F3' },
    { name: 'Tím nhạt', value: '#F3E8FF' },
    { name: 'Cam nhạt', value: '#FFEDD5' },
    { name: 'Đỏ nhạt', value: '#FEE2E2' },
  ];

  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ 
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      '& .rich-text-editor-content': {
        flex: 1,
        minHeight: '200px',
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '16px',
        outline: 'none',
        '& p': {
          margin: '0 0 8px 0',
          lineHeight: 1.6,
        },
        '& h1': {
          fontSize: '1.875rem',
          fontWeight: 'bold',
          margin: '16px 0 8px 0',
          color: '#0f172a',
        },
        '& h2': {
          fontSize: '1.5rem',
          fontWeight: 'bold',
          margin: '12px 0 8px 0',
          color: '#1e293b',
        },
        '& h3': {
          fontSize: '1.25rem',
          fontWeight: 'bold',
          margin: '8px 0 4px 0',
          color: '#334155',
        },
        '& ul, & ol': {
          paddingLeft: '24px',
          margin: '8px 0',
        },
        '& blockquote': {
          borderLeft: '4px solid #CBD5E1',
          paddingLeft: '16px',
          margin: '8px 0',
          fontStyle: 'italic',
          color: '#475569',
        },
        '& code': {
          backgroundColor: '#F1F5F9',
          padding: '2px 4px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '0.875em',
        },
        '& pre': {
          backgroundColor: '#0F172A',
          color: '#E2E8F0',
          padding: '12px',
          borderRadius: '6px',
          overflowX: 'auto',
          margin: '8px 0',
          '& code': {
            backgroundColor: 'transparent',
            padding: 0,
          },
        },
        '& .rich-text-link': {
          color: '#2563EB',
          textDecoration: 'underline',
          cursor: 'pointer',
          '&:hover': {
            color: '#1D4ED8',
          },
        },
        '& mark': {
          borderRadius: '0.25rem',
          padding: '0.1rem 0.2rem',
        },
      },
    }}>
      {/* Toolbar */}
      <Box sx={{ 
        p: 1, 
        bgcolor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.5,
        alignItems: 'center',
        overflowX: 'auto',
      }}>
        {/* Undo/Redo */}
        <ButtonGroup size="small" sx={{ mr: 1 }}>
          <Tooltip title="Hoàn tác">
            <IconButton 
              size="small"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Làm lại">
            <IconButton 
              size="small"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo fontSize="small" />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24 }} />

        {/* Heading Levels */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Tiêu đề 1">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              sx={{ 
                color: editor.isActive('heading', { level: 1 }) ? '#2563EB' : 'inherit',
                bgcolor: editor.isActive('heading', { level: 1 }) ? '#EFF6FF' : 'transparent',
              }}
            >
              <LooksOne fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Tiêu đề 2">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              sx={{ 
                color: editor.isActive('heading', { level: 2 }) ? '#2563EB' : 'inherit',
                bgcolor: editor.isActive('heading', { level: 2 }) ? '#EFF6FF' : 'transparent',
              }}
            >
              <LooksTwo fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Tiêu đề 3">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              sx={{ 
                color: editor.isActive('heading', { level: 3 }) ? '#2563EB' : 'inherit',
                bgcolor: editor.isActive('heading', { level: 3 }) ? '#EFF6FF' : 'transparent',
              }}
            >
              <Looks3 fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24 }} />

        {/* Text Formatting */}
        <Tooltip title="In đậm">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBold().run()}
            sx={{ 
              color: editor.isActive('bold') ? '#2563EB' : 'inherit',
              bgcolor: editor.isActive('bold') ? '#EFF6FF' : 'transparent',
            }}
          >
            <FormatBold fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="In nghiêng">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            sx={{ 
              color: editor.isActive('italic') ? '#2563EB' : 'inherit',
              bgcolor: editor.isActive('italic') ? '#EFF6FF' : 'transparent',
            }}
          >
            <FormatItalic fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Gạch chân">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            sx={{ 
              color: editor.isActive('underline') ? '#2563EB' : 'inherit',
              bgcolor: editor.isActive('underline') ? '#EFF6FF' : 'transparent',
            }}
          >
            <FormatUnderlined fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Gạch ngang">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            sx={{ 
              color: editor.isActive('strike') ? '#2563EB' : 'inherit',
              bgcolor: editor.isActive('strike') ? '#EFF6FF' : 'transparent',
            }}
          >
            <FormatStrikethrough fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24 }} />

        {/* Text Color */}
        <Tooltip title="Màu chữ">
          <IconButton
            size="small"
            onClick={(e) => setTextColorAnchor(e.currentTarget)}
            ref={linkInputRef}
            sx={{
              color: editor.isActive('textStyle') ? '#2563EB' : 'inherit',
            }}
          >
            <FormatColorText fontSize="small" />
          </IconButton>
        </Tooltip>

        <Popover
          open={Boolean(textColorAnchor)}
          anchorEl={textColorAnchor}
          onClose={() => setTextColorAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, width: 200 }}>
            <MuiTypography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Màu chữ
            </MuiTypography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
              {textColors.map((color) => (
                <Tooltip key={color.value} title={color.name}>
                  <Box
                    onClick={() => {
                      editor.chain().focus().setColor(color.value).run();
                      setTextColorAnchor(null);
                    }}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: color.value,
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      '&:hover': {
                        borderColor: '#CBD5E1',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s',
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
            <Button
              fullWidth
              size="small"
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setTextColorAnchor(null);
              }}
              sx={{ mt: 1 }}
            >
              Mặc định
            </Button>
          </Box>
        </Popover>

        {/* Highlight Color */}
        <Tooltip title="Đánh dấu">
          <IconButton
            size="small"
            onClick={(e) => setHighlightColorAnchor(e.currentTarget)}
          >
            <HighlightIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Popover
          open={Boolean(highlightColorAnchor)}
          anchorEl={highlightColorAnchor}
          onClose={() => setHighlightColorAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, width: 200 }}>
            <MuiTypography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Màu đánh dấu
            </MuiTypography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              {highlightColors.map((color) => (
                <Tooltip key={color.value} title={color.name}>
                  <Box
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color: color.value }).run();
                      setHighlightColorAnchor(null);
                    }}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '4px',
                      bgcolor: color.value,
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      '&:hover': {
                        borderColor: '#CBD5E1',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s',
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
            <Button
              fullWidth
              size="small"
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                setHighlightColorAnchor(null);
              }}
              sx={{ mt: 1 }}
            >
              Bỏ đánh dấu
            </Button>
          </Box>
        </Popover>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24 }} />

        {/* Lists */}
        <Tooltip title="Danh sách dấu đầu dòng">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            sx={{ 
              color: editor.isActive('bulletList') ? '#2563EB' : 'inherit',
              bgcolor: editor.isActive('bulletList') ? '#EFF6FF' : 'transparent',
            }}
          >
            <FormatListBulleted fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Danh sách số">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            sx={{ 
              color: editor.isActive('orderedList') ? '#2563EB' : 'inherit',
              bgcolor: editor.isActive('orderedList') ? '#EFF6FF' : 'transparent',
            }}
          >
            <FormatListNumbered fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24 }} />

        {/* Block Elements */}
        <Tooltip title="Trích dẫn">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            sx={{ 
              color: editor.isActive('blockquote') ? '#2563EB' : 'inherit',
              bgcolor: editor.isActive('blockquote') ? '#EFF6FF' : 'transparent',
            }}
          >
            <FormatQuote fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Mã code">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            sx={{ 
              color: editor.isActive('codeBlock') ? '#2563EB' : 'inherit',
              bgcolor: editor.isActive('codeBlock') ? '#EFF6FF' : 'transparent',
            }}
          >
            <Code fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24 }} />

        {/* Link */}
        <Tooltip title="Chèn liên kết">
          <IconButton
            size="small"
            onClick={handleOpenLinkMenu}
            sx={{ 
              color: editor.isActive('link') ? '#2563EB' : 'inherit',
              bgcolor: editor.isActive('link') ? '#EFF6FF' : 'transparent',
            }}
          >
            <InsertLink fontSize="small" />
          </IconButton>
        </Tooltip>

        <Popover
          open={Boolean(linkMenuAnchor)}
          anchorEl={linkMenuAnchor}
          onClose={() => setLinkMenuAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, width: 300 }}>
            <MuiTypography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Chèn liên kết
            </MuiTypography>
            <TextField
              fullWidth
              size="small"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button size="small" onClick={handleRemoveLink}>
                Xóa
              </Button>
              <Button 
                size="small" 
                variant="contained" 
                onClick={handleSetLink}
                disabled={!linkUrl}
              >
                Áp dụng
              </Button>
            </Box>
          </Box>
        </Popover>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24 }} />

        {/* Clear Formatting */}
        <Tooltip title="Xóa định dạng">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          >
            <FormatClear fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Character Count */}
      <Box sx={{ 
        p: 1, 
        bgcolor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <MuiTypography variant="caption" color="text.secondary">
          {editor.storage.characterCount.characters()} ký tự
          {editor.storage.characterCount.characters() > 8000 && ' (Sắp đạt giới hạn)'}
        </MuiTypography>
        <MuiTypography variant="caption" color="text.secondary">
          Giới hạn: 10,000 ký tự
        </MuiTypography>
      </Box>
    </Box>
  );
};

export default RichTextEditor; 