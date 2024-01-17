import { Box, IconButton, SxProps } from '@mui/material';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import { useMapContext } from 'context/MapProvider';

const buttonContainerProps: SxProps = { backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '50%', ml: 1 };

const GeoMapButtons = () => {
  const { zoomChanged, mapMoved, onActions } = useMapContext();
  const boundColor: string = (mapMoved ?? false) || (zoomChanged ?? false) ? 'red' : 'inherit';

  /** Set automatic bounds  */
  const handleClickCenterBounds = () => onActions.current.centerBounds(false, false);

  /** Center on my location  */
  const handleCenterMyLocation = () => onActions.current.centerMyLocation(false, false);

  return (
    <Box sx={{ position: 'absolute', top: 0, right: 0, display: 'flex', mt: 1, mr: 1 }}>
      <Box sx={buttonContainerProps}>
        <IconButton onClick={handleCenterMyLocation} size="large">
          <PersonPinCircleIcon fontSize="inherit" />
        </IconButton>
      </Box>

      <Box sx={buttonContainerProps}>
        <IconButton onClick={handleClickCenterBounds} size="large">
          <FilterCenterFocusIcon htmlColor={boundColor} fontSize="inherit" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default GeoMapButtons;
