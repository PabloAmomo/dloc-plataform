import { GetDevicesResult } from 'models/GetDevicesResult';
import { GetUserResult } from 'models/GetUserResult';
import { useTranslation } from 'react-i18next';
import { useDevicesContext } from 'context/DevicesProvider';
import { useEffect, useRef } from 'react';
import { useSnackContext } from 'context/SnackProvider';
import { useUserContext } from 'context/UserProvider';
import getDevices from 'services/getDevices/getDevices';
import getUser from 'services/getUser/getUser';
import RoutesApp from 'routesApp/RoutesApp';
import logError from 'functions/logError';
import configI18n from 'functions/configI18n';

/** Set i18n config */
configI18n('es', 'dloc-frontend');

function App() {
  const { setUser } = useUserContext();
  const { setDevices } = useDevicesContext();
  const { addSnackbar } = useSnackContext();
  const { t } = useTranslation();
  const abortAxios = useRef<AbortController>();

  /** Get devices and user data from API (First Load) */
  useEffect(() => {
    getDevices(
      {},
      (response: GetDevicesResult) => {
        try {
          // TODO: Add error handler if response has error...
          if (response?.error || response.devices?.length === 0) throw new Error(response?.error?.message ?? t('errors.noDevicesReceived'));
          
          setDevices(response.devices);

        } catch (error: any) {
          addSnackbar('error', error.message);
          logError(error.message, error);
        }
      },
      abortAxios
    );

    getUser({}, (response: GetUserResult) => {
      try {
        // TODO: Add error handler if response has error...
        if (!response || response?.error) throw new Error(response?.error?.message ?? t('errors.noUserDataReceived'));

        setUser(response.user);
      } catch (error: any) {
        addSnackbar('error', error.message);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RoutesApp />;
}

export default App;
