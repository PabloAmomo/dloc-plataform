import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import NavMenu from 'components/NavMenu/NavMenu';

function Layout() {
  return (
    <>
      {/* Menu TOP */}
      <Box sx={{ position: "fixed", display: "flex", top: 0, left: 0, right: 0, height: 'var(--top-menu-height)', boxShadow: 6, zIndex: "modal" }}>
        <NavMenu />
      </Box>

      {/* Page content */}
      <Outlet />
    </>);
}

export default Layout;
