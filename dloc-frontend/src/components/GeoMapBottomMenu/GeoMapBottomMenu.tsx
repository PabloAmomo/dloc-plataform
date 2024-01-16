import { Box, Grid, SxProps } from '@mui/material';
import DevicesSelector from 'components/DevicesSelector/DevicesSelector';
import IntervalSelector from 'components/IntervalSelector/IntervalSelector';
import { useMapContext } from 'context/MapProvider';
import userSettingsGet from 'functions/userSettingsGet';
import userSettingsSet from 'functions/userSettingsSet';
import { UserSettings } from 'models/UserSettings';
import { useEffect } from 'react';

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

function GeoMapBottomMenu({
  hideIntervalSelector = false,
  hideDevicesSelector = false,
}: {
  hideIntervalSelector?: boolean;
  hideDevicesSelector?: boolean;
}) {
  const { isLoading, minutes, setMinutes, showDevices, setShowDevices } = useMapContext();

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
        {!hideIntervalSelector && (
          <Grid item xs={'auto'} sx={{ paddingLeft: '12px!important', paddingTop: '0!important' }}>
            <IntervalSelector disabled={isLoading} setMinutes={setMinutes} minutes={minutes} />
          </Grid>
        )}

        <Grid item xs={'auto'} sx={middleSxProps} />

        {/* Devices Selector */}
        {!hideDevicesSelector && (
          <Grid item xs={'auto'} sx={{ paddingRight: '12px!important', paddingTop: '0!important' }}>
            <DevicesSelector disabled={isLoading} showDevices={showDevices} setShowDevices={setShowDevices} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
  // ------------------------------------------------------------------------------------------------------------------------------------------------------
}

export default GeoMapBottomMenu;
