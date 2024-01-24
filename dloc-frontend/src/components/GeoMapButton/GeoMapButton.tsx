import { Box, IconButton, SxProps } from '@mui/material';

type GoogleMapButtonProps = {
  onClick: () => void;
  sx: SxProps;
  children: React.ReactNode;
};

const GeoMapButton = ({ onClick, sx, children }: GoogleMapButtonProps) => {
  return (
    <Box sx={sx}>
      <IconButton onClick={onClick} size="large">
        {children}
      </IconButton>
    </Box>
  );
};

export default GeoMapButton;
