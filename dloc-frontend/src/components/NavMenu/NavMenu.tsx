import { Box, Grid } from '@mui/material';
import Logo from 'components/Logo/Logo';

const NavMenu = () => {
  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
      <Grid container>
        <Grid item>
          <Box sx={{ pl: 1, pt: '4px' }}>
            <Logo size={48} /> 
          </Box>
        </Grid>
        <Grid item flexGrow={'1'}></Grid>
        <Grid item></Grid>
      </Grid>
    </Box>
  );
};

export default NavMenu;
