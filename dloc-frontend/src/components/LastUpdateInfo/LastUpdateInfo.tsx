import { Box, SxProps, Typography } from "@mui/material";
import { useDevicesContext } from "context/DevicesProvider";
import formatDate from "functions/formatDate";
import { useTranslation } from "react-i18next";

const boxProps : SxProps = { display: 'flex', alignContent: 'center', position: 'absolute', bottom: '.25rem', left: '.25rem', backgroundColor: 'rgba(255, 255, 255, 0.75)', p: '0 4px 0 4px', borderRadius: '4px' };
const typographyProps : SxProps = { fontSize: '0.75rem', color: 'textSecondary', variant: 'caption' };

const LastUpdateInfo: React.FC = () => {
  const { t } = useTranslation();
  const { lastUpdate } = useDevicesContext();
  const dateText: string = lastUpdate ? formatDate(lastUpdate, t('dateString')) ?? '-' : '-';
  
 return <Box sx={boxProps}>
  <Typography sx={typographyProps}>
    {`${t('lastUpdate')} `}<b>{dateText}</b>
  </Typography>
</Box>
}

export default LastUpdateInfo;