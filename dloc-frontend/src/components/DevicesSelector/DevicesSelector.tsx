import LocationOff from '@mui/icons-material/LocationOff';
import { Box, Checkbox, Chip, FormControl, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useDevicesContext } from 'context/DevicesProvider';
import removeFromArray from 'functions/removeIdFromArray';
import { Device } from 'models/Device';
import { ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const menuProps = { PaperProps: { style: { width: 200 } } };
const noBorder = { border: 0, borderWidth: '0!important' };
const showIcon = false;

const DevicesSelector = ({
  showDevices,
  setShowDevices,
  disabled = false,
}: {
  showDevices: string[];
  setShowDevices: CallableFunction;
  disabled?: boolean;
}) => {
  const { t } = useTranslation();
  const devicesProvider = useDevicesContext();
  const devices: Device[] = devicesProvider.getDevices();
  const refHidden = useRef<any>();
  const isDisabled = disabled || devices.length <= 1;
  const labelAll = t('all');
  const labelNone = t('none');

  const handleHiddenDevicesChange = (event: SelectChangeEvent<typeof showDevices>) => {
    const { value } = event.target;
    const newValue: string[] = typeof value === 'string' ? value.split(',') : value;

    /** All Selected */
    if (newValue.includes('0') && !showDevices.includes('0')) {
      newValue.length = 0;
      newValue.push('0');
    } else if (!newValue.includes('0') && showDevices.includes('0')) {
    /** All Unselected */
      newValue.length = 0;
    } else if (newValue.includes('0') && newValue.length > 1) {
    /** Unselect one from All Selected */
      removeFromArray(newValue, '0');
      const imei = newValue[0];
      devices.forEach((item: Device) => imei !== item.imei && newValue.push(item.imei));
      removeFromArray(newValue, imei);
    } else if (!newValue.includes('0') && newValue.length === devices.length) {
    /** All selected */
      newValue.length = 0;
      newValue.push('0');
    }

    setShowDevices(newValue);
  };

  const DeviceOptionsItems = (): ReactNode[] => {
    const optionItems: ReactNode[] = [];

    const addMenuItem = (imei: string, name: string) => {
      optionItems.push(
        <MenuItem key={imei} value={imei}>
          <Checkbox checked={showDevices.includes(imei) || showDevices.includes('0')} />
          <ListItemText primary={name} />
        </MenuItem>
      );
    };

    addMenuItem('0', labelAll);
    devices.forEach((item: Device) => addMenuItem(item.imei, item.params.name));

    return optionItems;
  };

  const drawChips = (selected: string[]) => {
    if (selected.includes('0')) return [<Chip key={'0'} label={labelAll} sx={{ fontSize: '10px' }} />];

    if (selected.length === 0) return [<Chip key={'0'} label={labelNone} sx={{ fontSize: '10px' }} />];

    return devices.map((item: Device) => {
      if (selected.includes(item.imei)) return <Chip key={item.imei} label={item.params.name} sx={{ fontSize: '10px' }} />;
      return null;
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      {showIcon && (
        <Box sx={{ paddingTop: '12px' }}>
          <LocationOff sx={{ fontSize: '32px', opacity: isDisabled ? 0.25 : 0.75 }} />
        </Box>
      )}
      <Box>
        <FormControl
          ref={refHidden}
          sx={{
            minWidth: '180px',
            maxWidth: '200px',
            '& label.MuiFormLabel-root': { transition: 'all .5s', marginTop: '8px' },
            '& label.MuiFormLabel-root.Mui-focused': { color: 'inherit' },
            '& .MuiSelect-select': { paddingBottom: 0 },
            '& .MuiChip-root': { transform: 'translatey(-4px)' },
          }}
        >
          <Select
            displayEmpty
            disabled={isDisabled}
            multiple
            autoWidth
            value={showDevices ?? ['0']}
            onChange={handleHiddenDevicesChange}
            renderValue={(selected: string[]) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{drawChips(selected)}</Box>}
            MenuProps={menuProps}
            sx={{ 
              '& .MuiSelect-select': { paddingTop: '8px' },
              '& fieldset': noBorder, '& .MuiBox-root': { justifyContent: showIcon ? 'center' : 'end' } 
            }}
          >
            {DeviceOptionsItems()}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default DevicesSelector;
