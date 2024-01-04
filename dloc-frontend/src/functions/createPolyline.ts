const createPolyline = (strokeColor: string, strokeColorDark: string, map: google.maps.Map | undefined): google.maps.Polyline => {
  var iconsetngs = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    fillColor: strokeColor,
    fillOpacity: 1,
    strokeColor: strokeColorDark,
    strokeWeight: 0,
    offset: '50%',
  };


  return new google.maps.Polyline({ map, path: [], geodesic: true, strokeColor, strokeOpacity: 1.0, strokeWeight: 3, icons: [{
    icon: iconsetngs,
    repeat: '70px',
}] });
}

export default createPolyline;