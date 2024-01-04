import { Box, CircularProgress, SxProps } from "@mui/material"

enum enumCircularLoadingPosition {
  absolute = "absolute",
  relative = "relative",
  fixed = "fixed"
}

const CircularLoading = ({ position = enumCircularLoadingPosition.relative, sx }: { position?: enumCircularLoadingPosition, sx?: SxProps }) => {
  let addSx : object = { top: 0, left: 0, bottom: 0, right: 0 };
  if (position === enumCircularLoadingPosition.relative) { addSx = {} };

  return (
    <Box sx={{ display: "flex", position, flexDirection: "column", alignItems: "center", height: '100%', width: '100%', backgroundColor: '#00000080', justifyContent: "center", ...addSx, ...sx }}>
      <CircularProgress />
    </Box>)
}

export default CircularLoading;