import { createContext, useContext, useState } from 'react';
import { DevicesProviderInterface } from 'models/DevicesProviderInterface';
import { Device } from 'models/Device';

const DevicesContext = createContext<DevicesProviderInterface>({ setDevices: () => {}, getDevices: () => [], devices: [] });

export function DevicesProvider({ children }: { children: any }) {
  const [devices, setDevices] = useState<Device[]>([]);

  return (
    <DevicesContext.Provider
      value={{
        setDevices: (devices: Device[]) => {
          setDevices(devices);
        },
        getDevices: () => {
          return devices;
        },
        devices,
      }}
    >
      {children}
    </DevicesContext.Provider>
  );
}

export const useDevicesContext = () => useContext(DevicesContext);
