import { SxProps } from '@mui/material';
import { Box } from '@mui/system';
import { InfoBox } from '@react-google-maps/api';
import { LatLng } from 'models/LatLng';
import { ReactNode } from 'react';

const margin: number = 20;
const sxPropsContainer: SxProps = { overflow: 'visible', display: 'inline-flex', margin: `${margin}px`, justifyContent: 'center' };
const sxPropsLines: SxProps = {
  m: 0,
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  width: '100%',
  minHeight: '24px',
  justifyContent: 'center',
};

const MarkerLabel = ({
  position,
  size = 72,
  line1,
  line2,
  sxLine1,
  sxLine2,
  sxBox,
  onClick,
  children,
}: {
  position: LatLng;
  size?: number;
  line1: string | ReactNode | undefined;
  line2?: string | ReactNode | undefined | null;
  sxLine1?: SxProps | undefined | null;
  sxLine2?: SxProps | undefined | null;
  sxBox?: SxProps | undefined | null;
  onClick?: CallableFunction;
  children?: ReactNode;
}) => {
  const positionGoogle = new google.maps.LatLng(position.lat, position.lng);
  const pixelOffset = new google.maps.Size(-((size + margin * 2) / 2), 52);

  const handleOnClick = (event: any) => {
    event.stopPropagation();
    onClick && onClick();
  }

  return (
    <InfoBox position={positionGoogle} options={{ boxClass: 'box-class-info-box', alignBottom: true, pixelOffset }}>
      <Box onClick={handleOnClick} sx={{ ...sxPropsContainer, width: `${size + 40}px`, maxWidth: `${size}px`, ...sxBox }}>
        <Box className={'map-label-marker'} sx={sxPropsLines}>
          {line1 && (
            <Box className="name" sx={sxLine1}>
              {line1}
            </Box>
          )}
          {line2 && (
            <Box className="time" sx={sxLine2}>
              {line2}
            </Box>
          )}
          {children}
        </Box>
      </Box>
    </InfoBox>
  );
};

export default MarkerLabel;
