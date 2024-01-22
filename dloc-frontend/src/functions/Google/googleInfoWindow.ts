const googleInfoWindow = ({ open, title, content, position, map, currentInfoWindows }:{ open: boolean, title: string, content: string, position: google.maps.LatLng | google.maps.LatLngLiteral, map: google.maps.Map | undefined, currentInfoWindows: google.maps.InfoWindow | undefined }) : google.maps.InfoWindow => {

  const contentTemp = `<div class="infoWindow" style="user-select: none;">` + 
                      ` <h3 class="infoWindowHead">${title}</h3>` + 
                      ` <div class="infoWindowHead">` + 
                      `   <p>${content}</p>` + 
                      ` </div>` + 
                      `</div>`;

    const infoWindow = currentInfoWindows ?? new google.maps.InfoWindow({ position, content: contentTemp, zIndex: 1 });

    if (currentInfoWindows) {
      infoWindow.setContent(contentTemp);
      infoWindow.setPosition(position);
    }

    open && infoWindow.open({ map, });

    return infoWindow;
}

export default googleInfoWindow;