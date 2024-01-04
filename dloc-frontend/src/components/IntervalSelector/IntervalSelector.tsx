import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { Option } from 'models/Option';

const options: Option[] = [
  { value: 0, label: `Ahora mismo` },
  { value: 5, label: `5 minutos` },
  { value: 10, label: `10 minutos` },
  { value: 15, label: `15 minutos` },
  { value: 30, label: `30 minutos` },
  { value: 60, label: `1 hora` },
  { value: 90, label: `1.5 horas` },
  { value: 120, label: `2 horas` },
  { value: 240, label: `4 horas` },
  { value: 480, label: `8 horas` },
  { value: 720, label: `12 horas` },
  { value: 1440, label: `1 día` },
  { value: 2880, label: `2 días` },
];

const IntervalSelector = ({ setMinutes, minutes, disabled = false }: { setMinutes: CallableFunction; minutes: number; disabled?: boolean }) => {

  const handleMinutesChange = (event: SelectChangeEvent) => {
    setMinutes(parseInt(event.target.value));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Box sx={{ paddingTop: '6px', paddingLeft: '12px' }}>
        <RestoreIcon sx={{ fontSize: '32px', opacity: disabled ? 0.25 : 0.75 }} />
      </Box>
      <Box>
        <FormControl>
          <Select
            disabled={disabled}
            value={minutes.toString()}
            onChange={handleMinutesChange}
            sx={{ '& fieldset': { border: 0, borderWidth: '0!important' } }}
          >
            {options.map((option: Option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default IntervalSelector;
