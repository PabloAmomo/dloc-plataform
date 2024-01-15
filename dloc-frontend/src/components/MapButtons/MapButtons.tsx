import { Box, IconButton } from '@mui/material';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';

const MapButtons = ({ clickBounds, bounds, clickCenterMe }: { clickBounds: () => void; clickCenterMe: () => void; bounds: boolean }) => {
  const boundColor: string = !bounds ? 'red' : 'inherit';

  return (
    <Box sx={{ position: 'absolute', top: 0, right: 0, display: 'flex', mt: 1, mr: 1 }}>
      <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '50%', ml: 1 }}>
        <IconButton onClick={clickCenterMe} size="large">
          <PersonPinCircleIcon fontSize="inherit" />
        </IconButton>
      </Box>

      <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '50%', ml: 1 }}>
        <IconButton onClick={clickBounds} size="large">
          <FilterCenterFocusIcon htmlColor={boundColor} fontSize="inherit" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MapButtons;
