// src/components/notes/RichTextEditor.jsx
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, ToggleButton, ToggleButtonGroup, Divider } from '@mui/material';
import {
  FormatBold, FormatItalic, FormatListBulleted, FormatListNumbered,
  Code, FormatQuote, HorizontalRule
} from '@mui/icons-material';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ borderBottom: '1px solid #e0e0e0', p: 1, mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <ToggleButtonGroup size="small" exclusive>
        <ToggleButton
          value="bold"
          selected={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FormatBold fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="italic"
          selected={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FormatItalic fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="code"
          selected={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />

      <ToggleButtonGroup size="small" exclusive>
        <ToggleButton
          value="bulletList"
          selected={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulleted fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="orderedList"
          selected={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumbered fontSize="small" />
        </ToggleButton>
        <ToggleButton
            value="blockquote"
            selected={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <FormatQuote fontSize="small" />
          </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

const RichTextEditor = ({ content, onChange, placeholder = 'Nhập nội dung ghi chú...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: content || '', // Khởi tạo nội dung (nếu có)
    onUpdate: ({ editor }) => {
      // Khi gõ, gửi HTML về cho component cha
      onChange(editor.getHTML());
    },
  });

  // --- QUAN TRỌNG: CẬP NHẬT LẠI EDITOR KHI CONTENT BÊN NGOÀI THAY ĐỔI ---
  // Fix lỗi: Mở modal sửa nhưng editor trống trơn hoặc không gõ được
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  return (
    <Box sx={{ 
      border: '1px solid #c4c4c4', 
      borderRadius: '4px', 
      '&:hover': { borderColor: 'black' },
      display: 'flex',
      flexDirection: 'column',
      minHeight: '200px', // Đặt chiều cao tối thiểu cho khung
      bgcolor: 'white'
    }}>
      <MenuBar editor={editor} />
      
      <Box sx={{ 
          flex: 1, 
          p: 2, 
          cursor: 'text',
          // Style cho vùng soạn thảo của Tiptap
          '& .ProseMirror': {
              outline: 'none',
              minHeight: '150px', // Chiều cao vùng gõ chữ
              height: '100%',
          },
          '& .ProseMirror p.is-editor-empty:first-child::before': {
              color: '#adb5bd',
              content: 'attr(data-placeholder)',
              float: 'left',
              height: 0,
              pointerEvents: 'none',
          }
      }} 
      onClick={() => editor?.commands.focus()} // Bấm vào vùng trắng cũng focus vào editor
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default RichTextEditor;