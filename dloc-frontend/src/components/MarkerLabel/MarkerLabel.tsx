import { SxProps } from "@mui/material"
import { Box } from "@mui/system"
import { InfoBox } from "@react-google-maps/api";
import { LatLng } from "models/LatLng";
import { ReactNode } from "react";

const margin: number = 20;

const MarkerLabel = ({ position, size = 72, line1, line2, sxLine1, sxLine2, sxBox, onClick, children }: { position: LatLng, size?: number, line1: string | ReactNode | undefined, line2?: string | ReactNode | undefined | null, sxLine1?: SxProps | undefined | null, sxLine2?: SxProps | undefined | null, sxBox?: SxProps | undefined | null, onClick?: CallableFunction, children?: ReactNode }) => {
  const positionGoogle = new google.maps.LatLng(position.lat, position.lng);
  const pixelOffset = new google.maps.Size(-((size + (margin * 2)) / 2), 52);

  return (
    <InfoBox position={positionGoogle} options={{ boxClass: "box-class-info-box", alignBottom: true, pixelOffset }}>
      <Box onClick={() => onClick && onClick()} sx={{ overflow: "visible", display: "inline-flex", width: `${size + 40}px`, margin: `${margin}px`, maxWidth: `${size}px`, justifyContent: "center", ...sxBox }}>
        <Box className={"map-label-marker"} sx={{ m: 0, display: "flex", position: "relative", flexDirection: "column", width: "100%", minHeight: "24px", justifyContent: "center" }}>
          {line1 && <Box className="name" sx={sxLine1}>{line1}</Box>}
          {line2 && <Box className="time" sx={sxLine2}>{line2}</Box>}
          {children}
        </Box>
      </Box>
    </InfoBox>
  );
}

export default MarkerLabel;