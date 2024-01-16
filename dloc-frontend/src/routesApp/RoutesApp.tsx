import { Device } from 'models/Device';
import { GetDevicesResult } from 'models/GetDevicesResult';
import { GetUserResult } from 'models/GetUserResult';
import { Routes, Route } from 'react-router-dom';
import { useDevicesContext } from 'context/DevicesProvider';
import { useEffect, useRef } from 'react';
import { useSnackContext } from 'context/SnackProvider';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'context/UserProvider';
import getDevices from 'services/getDevices/getDevices';
import getUser from 'services/getUser/getUser';
import Home from 'pages/Home/Home';
import Layout from 'templates/Layout';
import Page404 from 'pages/Page404/Page404';

function RoutesApp() {
  const userProvider = useUserContext();
  const devicesProvider = useDevicesContext();
  const { addSnackbar } = useSnackContext();
  const { t } = useTranslation();
  const abortAxios = useRef<AbortController>();

  /** Get devices and user data from API (First Load) */
  useEffect(() => {
    getDevices({}, (response: GetDevicesResult) => {
      try {
        // TODO: Add error handler if response has error...
        if (response?.error || response.devices?.length === 0) throw new Error(response?.error?.message ?? t('errors.noDevicesReceived'));

        // Convert string params to paramr object and save it in context...
        let devices: Device[] = response.devices.map((item: Device) => ({ ...item, params: JSON.parse(item.params as any) }));
        devicesProvider.setDevices(devices);
      } catch (error: any) {
        addSnackbar('error', error.message);
      }
    },
    abortAxios);

    getUser({}, (response: GetUserResult) => {
      try {
        // TODO: Add error handler if response has error...
        if (!response || response?.error) throw new Error(response?.error?.message ?? t('errors.noUserDataReceived'));

        userProvider.setUser(response.user);
      } catch (error: any) {
        addSnackbar('error', error.message);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
}

export default RoutesApp;
