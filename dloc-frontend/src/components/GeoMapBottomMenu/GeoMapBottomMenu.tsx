import { Box, Grid, SxProps } from '@mui/material';
import DevicesSelector from 'components/DevicesSelector/DevicesSelector';
import IntervalSelector from 'components/IntervalSelector/IntervalSelector';
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
  isLoading,
  setMinutes,
  minutes,
  showDevices,
  setShowDevices,
  hideIntervalSelector = false,
}: {
  isLoading: boolean;
  setMinutes: CallableFunction;
  minutes: number;
  showDevices: string[];
  setShowDevices: CallableFunction;
  hideIntervalSelector?: boolean;
}) {
  useEffect(() => {
    const userSettings: UserSettings = userSettingsGet();
    userSettings.geoMap.showDevices = showDevices;
    userSettings.geoMap.interval = minutes;
    userSettingsSet(userSettings);
  }, [minutes, showDevices]);

  return (
    <Box className="boxShadow6-inverted" sx={containerSxProps}>
      <Grid container spacing={2} sx={{ flexWrap: 'nowrap', paddingBottom: '1rem' }}>
        {/* Interval Selector */}
        {!hideIntervalSelector && (
          <Grid item xs={'auto'} sx={{ paddingLeft: '4px!important' }}>
            <IntervalSelector disabled={isLoading} setMinutes={setMinutes} minutes={minutes} />
          </Grid>
        )}

        <Grid item xs={'auto'} sx={middleSxProps} />

        {/* Devices Selector */}
        <Grid item xs={'auto'} sx={{ paddingRight: '4px!important' }}>
          <DevicesSelector disabled={isLoading} showDevices={showDevices} setShowDevices={setShowDevices} />
        </Grid>
      </Grid>
    </Box>
  );
  // ------------------------------------------------------------------------------------------------------------------------------------------------------
}

export default GeoMapBottomMenu;
