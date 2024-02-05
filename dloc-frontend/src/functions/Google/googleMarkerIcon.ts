import { IconType } from "models/IconType";

const googleMarkerIcon = (iconType: IconType, options: any = {}) : google.maps.Icon | undefined  => {
  var varResponse: google.maps.Icon | undefined;
  try {
    /* ------------------------------------------------------------------------------ */
    var varSvg: string | undefined = 'M26.47799949921972,7.982475435817747 c-0.11365004871065779,-0.4259464268463443 -0.3444390764320393,-0.8798042960932166 -0.5151739634565403,-1.2771711875028504 C23.919797031116072,1.7954142928476768 19.4558220610211,0.03580570066124794 15.851385898255138,0.03580570066124794 C11.026195293263989,0.03580570066124794 5.711812120667846,3.2713060423351275 5.002297316241683,9.940433427190909 v1.3625386310151013 c0,0.05686214063511695 0.01959739572802988,0.5676563830766813 0.0474346055689813,0.8231648531368273 c0.3977380542075141,3.178341270800468 2.9056850794782956,6.556219661740873 4.778721022696658,9.734560932541342 c2.0151170622465786,3.4052702054239035 4.106099800379696,6.755088688844631 6.177707840463512,10.103496753633417 c1.277393885181578,-2.1851096236753214 2.5501853516694517,-4.398947247906505 3.7984800734972892,-6.527491661185014 c0.3402078205362143,-0.6246669888309496 0.7351250374798464,-1.2489628148640197 1.0757040208139381,-1.8451987333774107 c0.22700316718301186,-0.3969957286117553 0.6606697802252468,-0.793991457223511 0.8587964817332449,-1.1633726736730412 c2.0150428296870024,-3.6892839783611837 5.258486055235508,-7.4070732595995015 5.258486055235508,-11.068371563000582 v-1.504100122126286 C26.99770164881039,9.458738348103088 26.505688243941517,8.068065577008726 26.47799949921972,7.982475435817747 zM15.939722644150429,14.822411940257595 c-1.4183615158161558,0 -2.97086126678591,-0.709217874187866 -3.7371639792876197,-2.6678439585972082 c-0.11416967662768904,-0.3117767502186565 -0.104964839240281,-0.9365922041687571 -0.104964839240281,-0.9938255076017536 v-0.8798042960932166 c0,-2.4968863738939775 2.120081901486859,-3.6323476051664914 3.9644640767089347,-3.6323476051664914 c2.270625532306724,0 4.02674519419309,1.8166191979407005 4.02674519419309,4.087244730247426 C20.088803096524554,13.006386602793505 18.21034817645716,14.822411940257595 15.939722644150429,14.822411940257595 z';
    var scale: number = 1;
    var fillColor: string = options.fillColor ?? "#dc3545";
    var strokeColor: string = options.strokeColor ?? "#dc3545";
    var anchor: google.maps.Point = new google.maps.Point(16, 32);
    var scaledSize: google.maps.Size = new google.maps.Size(32, 32);
    var labelOrigin: google.maps.Point = new google.maps.Point(16, 8);
    var useThisUrl: string | undefined;
    var strokeWeight: number = 1;
    var fillOpacity: number = 1;
    var title: string = "";
    var label: string = "";
    var optimized: boolean = true;
    var size :number = 4;
    var svgTemp: string = "";
    /* ------------------------------------------------------------------------------ */

    /* ------------------------------------------------------------------------------ */
    useThisUrl = "images/markers/map-marker-pin.svg";
    /* ------------------------------------------------------------------------------ */
    switch (iconType) {
      case IconType.car:
        useThisUrl = "images/markers/map-marker-car.svg";
        anchor = new google.maps.Point(24, 48);
        scaledSize = new google.maps.Size(48, 48);
        labelOrigin = new google.maps.Point(24, 12);
        break;

        case IconType.mobile:
          useThisUrl = "images/markers/map-marker-mobile.svg";
          anchor = new google.maps.Point(24, 48);
          scaledSize = new google.maps.Size(48, 48);
          labelOrigin = new google.maps.Point(24, 12);
          break;

      case IconType.pet:
        useThisUrl = "images/markers/map-marker-pet.svg";
        anchor = new google.maps.Point(24, 48);
        scaledSize = new google.maps.Size(48, 48);
        labelOrigin = new google.maps.Point(24, 12);
        break;
        
      case IconType.colorPet:
        useThisUrl = "";
        svgTemp = `<svg width="259.761" height="259.761" xmlns="http://www.w3.org/2000/svg"><g><rect fill="none" id="canvas_background" height="402" width="582" y="-1" x="-1" /></g><g><ellipse ry="82" rx="78" cy="97.325806" cx="130.380493" stroke-width="1.5" stroke="#000" fill="#fff" /><g><g><path fill="${fillColor}" d="m129.879,0c-52.317,0 -94.879,42.563 -94.879,94.882c0,31.605 29.071,81.486 41.569,101.465c10.282,16.436 21.32,32.062 31.079,44c15.871,19.414 20.328,19.414 22.232,19.414c1.827,0 6.105,0 21.921,-19.42c9.784,-12.014 20.831,-27.637 31.106,-43.988c12.584,-20.027 41.854,-70.006 41.854,-101.471c0,-52.319 -42.563,-94.882 -94.882,-94.882zm0.001,171.525c-41.389,0 -75.062,-33.673 -75.062,-75.062c0,-41.389 33.673,-75.062 75.062,-75.062c41.389,0 75.062,33.673 75.062,75.062c0,41.389 -33.673,75.062 -75.062,75.062z" /><g transform="matrix(0.009689, 0, 0, -0.008182, 67.0039, 146.336489)" fill="#828282" stroke="none" style=""><path d="M8425 12296 c-714 -172 -1276 -774 -1548 -1656 -128 -415 -184 -930 -142 -1305 82 -741 432 -1322 951 -1583 176 -88 352 -134 520 -134 134 0 252 24 387 78 814 327 1377 1162 1499 2224 21 187 16 551 -11 770 -40 326 -87 500 -196 725 -171 353 -411 614 -705 764 -178 92 -325 130 -525 137 -113 3 -143 1 -230 -20z"></path><path d="M3822 12255 c-408 -74 -780 -384 -1006 -839 -212 -426 -270 -1025 -160 -1654 140 -802 549 -1478 1131 -1868 128 -86 340 -191 484 -239 102 -34 128 -38 241 -43 150 -6 257 8 388 50 203 65 369 167 525 323 309 309 501 774 546 1323 18 226 -2 562 -51 825 -175 952 -690 1700 -1380 2003 -269 118 -506 157 -718 119z"></path><path d="M11403 8606 c-661 -109 -1244 -566 -1604 -1260 -171 -329 -261 -613 -326 -1026 -23 -149 -27 -205 -27 -375 0 -208 12 -311 55 -479 115 -451 386 -818 723 -981 184 -89 352 -122 541 -105 459 40 868 247 1232 623 401 415 677 989 767 1592 23 151 39 446 32 567 -37 623 -371 1169 -836 1369 -180 77 -378 104 -557 75z"></path><path d="M1051 8344 c-435 -73 -801 -377 -936 -779 -48 -142 -88 -345 -105 -530 -62 -671 173 -1424 618 -1985 98 -123 291 -317 414 -413 284 -225 627 -386 947 -447 85 -16 286 -14 367 4 359 78 662 328 834 689 106 222 160 505 160 838 0 205 -10 317 -46 507 -137 732 -582 1417 -1182 1820 -164 111 -397 229 -524 266 -159 46 -380 58 -547 30z"></path><path d="M6240 5905 c-348 -39 -692 -132 -1031 -281 -518 -229 -1018 -610 -1341 -1024 -697 -894 -1181 -1862 -1378 -2755 -12 -55 -33 -138 -46 -185 -67 -243 -56 -519 31 -760 140 -388 443 -689 818 -815 224 -75 559 -74 932 4 243 50 425 108 941 299 718 267 917 318 1400 363 216 20 255 21 404 10 381 -27 682 -110 1260 -346 512 -209 798 -322 870 -342 720 -204 1435 47 1680 590 107 239 119 628 29 997 -88 359 -349 942 -599 1335 -704 1108 -1211 1729 -1790 2197 -549 442 -1005 650 -1571 713 -159 18 -447 18 -609 0z"></path></g></g></g></g></svg>`;
        useThisUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgTemp);
        anchor = new google.maps.Point(24, 48);
        scaledSize = new google.maps.Size(48, 48);
        labelOrigin = new google.maps.Point(24, 12);
        break;
        
      case IconType.point:
        size = 4;
        useThisUrl = "";
        varSvg = `M ${size}, ${size}   m -${size}, 0   a ${size},${size} 0 1,0 ${size * 2},0   a ${size},${size} 0 1,0 -${size * 2},0`;
        anchor = new google.maps.Point(size, (size * 2) - 2 );
        scaledSize = new google.maps.Size(size * 2, size * 2);
        labelOrigin = new google.maps.Point(size, size / 2);
        break;

      case IconType.start:
        useThisUrl = "images/markers/map-marker-start.svg";
        anchor = new google.maps.Point(24, 48);
        scaledSize = new google.maps.Size(48, 48);
        labelOrigin = new google.maps.Point(24, 12);
        break;

      case IconType.end:
        useThisUrl = "images/markers/map-marker-end.svg";
        anchor = new google.maps.Point(24, 48);
        scaledSize = new google.maps.Size(48, 48);
        labelOrigin = new google.maps.Point(24, 12);
        break;

      case IconType.pulse:
        useThisUrl = "images/markers/map-marker-point.svg";
        anchor = new google.maps.Point(24, 24);
        scaledSize = new google.maps.Size(48, 48);
        labelOrigin = new google.maps.Point(24, 12);
        title = '';
        label = "";
        optimized = false;
        break;

      case IconType.pin:
      default:
        anchor = new google.maps.Point(24, 48);
        scaledSize = new google.maps.Size(48, 48);
        labelOrigin = new google.maps.Point(24, 12);
    }

    if (useThisUrl !== "") { varSvg = undefined; } else { useThisUrl = undefined; }

    /* ------------------------------------------------------------------------------ */
    varResponse = {
      path: varSvg,
      url: useThisUrl,
      fillColor,
      fillOpacity,
      strokeColor,
      strokeWeight,
      scale,
      anchor,
      scaledSize,
      labelOrigin,
      optimized,
      label,
      title,
      ...options
    };
  }
  catch (inError) { varResponse = undefined; }
  /* ---------------------------------------------------------------------------------- */
  return varResponse;
}

export default googleMarkerIcon;