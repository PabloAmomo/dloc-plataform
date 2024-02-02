import { Box, Grid, SxProps } from '@mui/material';
import { memo, useEffect } from 'react';
import { useMapContext } from 'context/MapProvider';
import { UserSettings } from 'models/UserSettings';
import { userSettingsGet, userSettingsSet } from 'functions/userSettings';
import DevicesSelector from 'components/DevicesSelector/DevicesSelector';
import IntervalSelector from 'components/IntervalSelector/IntervalSelector';
import { useDevicesContext } from 'context/DevicesProvider';

const middleSxProps: SxProps = { flexGrow: '1!important', display: 'flex', pl: '0!important', pr: '0!important' };
const containerSxProps: SxProps = {
  pl: 1,
  pr: 1,
  display: 'flex',
  position: 'fixed',
  justifyContent: 'center',
  flexDirection: 'column',
  height: 'var(--bottom-menu-height)',
  width: '100%',
  zIndex: 'modal',
  left: 0,
  bottom: 0,
  right: 0,
};

function GeoMapBottomMenu() {
  const { isLoading, minutes, setMinutes, showDevices, setShowDevices } = useMapContext();
  const { devices } = useDevicesContext();

  useEffect(() => {
    const userSettings: UserSettings = userSettingsGet();
    userSettings.geoMap.showDevices = showDevices;
    userSettings.geoMap.interval = minutes;
    userSettingsSet(userSettings);
  }, [minutes, showDevices]);

  return (
    <Box className="boxShadow6-inverted" sx={containerSxProps}>
      <Grid container spacing={2} sx={{ flexWrap: 'nowrap' }}>
        {/* Interval Selector */}
        <Grid item xs={'auto'} sx={{ paddingLeft: '12px!important', paddingTop: '0!important' }}>
          <IntervalSelector disabled={isLoading} setMinutes={setMinutes} minutes={minutes} />
        </Grid>

        <Grid item xs={'auto'} sx={middleSxProps} />

        {/* Devices Selector */}
        {devices && devices.length > 0 && (
          <Grid item xs={'auto'} sx={{ paddingRight: '12px!important', paddingTop: '8px!important' }}>
            <DevicesSelector disabled={isLoading} showDevices={showDevices} setShowDevices={setShowDevices} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
  // ------------------------------------------------------------------------------------------------------------------------------------------------------
}

export default memo(GeoMapBottomMenu);
