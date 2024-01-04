import { Box } from '@mui/material';

type Props = {
  children: string | JSX.Element | JSX.Element[];
  height: number;
}

const ContainerTop = ({ height, children }: Props) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '100vw',
        height: `${height}px`,
        overflow: 'hidden',
        transition: '.5s all',
      }}
    >
      {children}
    </Box>
  );
};

export default ContainerTop;
