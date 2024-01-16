import { Box } from '@mui/material';
import GeoMapV2 from 'components/GeoMap/GeoMap';
import { MapActionsProvider } from 'context/MapProvider';

function Home() {
  return (
    <Box
      sx={{
        position: 'fixed',
        display: 'flex',
        top: 'var(--top-menu-height)',
        left: 0,
        right: 0,
        bottom: 'var(--bottom-menu-height)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MapActionsProvider>
        <GeoMapV2 />
      </MapActionsProvider>
    </Box>
  );
}

export default Home;
