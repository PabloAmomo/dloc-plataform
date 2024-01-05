import { Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
} 

const ContainerAllScreen = ({ children }: Props) => {

  return (
    <Box sx={{ display: 'flex', position: 'relative', flexDirection: 'column', alignItems: 'center', height: '100%', width: '100%' }}>
    <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%' }}>
      {children}
    </Box>
  </Box>  );
}

export default ContainerAllScreen;