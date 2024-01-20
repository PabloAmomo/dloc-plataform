import { createContext, useContext, useState } from 'react';
import { DevicesProviderInterface } from 'models/DevicesProviderInterface';
import { Device } from 'models/Device';

const DevicesContext = createContext<DevicesProviderInterface>({ setDevices: () => {}, devices: [], setLastUpdate: () => {}, lastUpdate: undefined });

export function DevicesProvider({ children }: { children: any }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | undefined>();

  const handleSetDevices = (devices: Device[]) => {
    if (devices.length === 0) return;
    let newDevices: Device[] = devices.map((item: Device) => ({ ...item, params: typeof item.params === 'string' ? JSON.parse(item.params) : item.params }));
    setDevices(newDevices);
    setLastUpdate(new Date());
  };

  return (
    <DevicesContext.Provider
      value={{
        setDevices: handleSetDevices,
        devices,
        setLastUpdate,
        lastUpdate,
      }}
    >
      {children}
    </DevicesContext.Provider>
  );
}

export const useDevicesContext = () => useContext(DevicesContext);
