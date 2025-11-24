import React from 'react'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Home() {
  return (
    <>
      <Typography variant="h3" sx = {{ color: 'white' }}>
        Chào mừng đến với Note Taking App!!
      </Typography>
      <Button sx={{ background: '#ffffffff', borderRadius:'20px'}}>
        Đăng nhập với <span>Google</span>
      </ Button>
    </>
  )
}
