export type typeConfig = {
  server: string,
  googleMapsApiKey: string,
  defaultInterval: number,
  debug: boolean,
  map: {
    maxPathsByDevice: number,
    initCenter: { lat: number, lng: number },
    initZoom: number,
    maxZoom: number,
    zoomNormal: number,
    zIndex: { endPoint: number, startPoint: number, pointOnTrack: number, me: number, },
  }
}

export const config :typeConfig = {
  server: process.env.REACT_APP_API_HOST ?? '',

  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY ?? '',

  defaultInterval: 0,

  debug: true,
  
  map: {
    maxPathsByDevice: 1000,
    initCenter: { lat: 40.417099903, lng: -3.70357844 },
    initZoom: 6,
    maxZoom: 19,
    zoomNormal: 17,
    zIndex: { endPoint: 20, startPoint: 10, pointOnTrack: 15, me: 16, }
  }
}
