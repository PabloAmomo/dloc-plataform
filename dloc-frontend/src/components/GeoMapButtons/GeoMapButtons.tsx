import { Box, IconButton, SxProps } from '@mui/material';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';

const buttonContainerProps: SxProps = { backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '50%', ml: 1 };

const GeoMapButtons = ({
  clickCenterBounds,
  centerBoundsActive,
  clickCenterMyLocation,
}: {
  clickCenterBounds: () => void;
  clickCenterMyLocation: () => void;
  centerBoundsActive: boolean;
}) => {
  const boundColor: string = !centerBoundsActive ? 'red' : 'inherit';

  return (
    <Box sx={{ position: 'absolute', top: 0, right: 0, display: 'flex', mt: 1, mr: 1 }}>
      <Box sx={buttonContainerProps}>
        <IconButton onClick={clickCenterMyLocation} size="large">
          <PersonPinCircleIcon fontSize="inherit" />
        </IconButton>
      </Box>

      <Box sx={buttonContainerProps}>
        <IconButton onClick={clickCenterBounds} size="large">
          <FilterCenterFocusIcon htmlColor={boundColor} fontSize="inherit" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default GeoMapButtons;
