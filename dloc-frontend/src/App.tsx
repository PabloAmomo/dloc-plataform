import { Device } from 'models/Device';
import { GetDevicesResult } from 'models/GetDevicesResult';
import { GetUserResult } from 'models/GetUserResult';
import { initReactI18next, useTranslation } from 'react-i18next';
import { useDevicesContext } from 'context/DevicesProvider';
import { useEffect, useRef } from 'react';
import { useSnackContext } from 'context/SnackProvider';
import { useUserContext } from 'context/UserProvider';
import getDevices from 'services/getDevices/getDevices';
import getUser from 'services/getUser/getUser';
import i18n from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import lngEN from 'languages/en.json';
import lngES from 'languages/es.json';
import RoutesApp from 'routesApp/RoutesApp';

i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { ...lngEN } },
      es: { translation: { ...lngES } },
    },
    lng: 'es',
    fallbackLng: ['es', 'en'],
    interpolation: { escapeValue: false },

    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'],
      cookieMinutes: 10,
      cookieDomain: 'myDomain',
      htmlTag: document.documentElement,
      cookieOptions: { path: '/', sameSite: 'strict' },
    },
  });

function App() {
  const { setUser } = useUserContext();
  const { setDevices } = useDevicesContext();
  const { addSnackbar } = useSnackContext();
  const { t } = useTranslation();
  const abortAxios = useRef<AbortController>();

  /** Get devices and user data from API (First Load) */
  useEffect(() => {
    console.log('RoutesApp: useEffect: getDevices');
    getDevices({}, (response: GetDevicesResult) => {
      try {

        // TODO: Add error handler if response has error...
        if (response?.error || response.devices?.length === 0) throw new Error(response?.error?.message ?? t('errors.noDevicesReceived'));

        // Convert string params to paramr object and save it in context...
        let devices: Device[] = response.devices.map((item: Device) => ({ ...item, params: JSON.parse(item.params as any) }));
 
        console.log('RoutesApp: useEffect: getDevices: response', devices);

        setDevices(devices);

      } catch (error: any) {
        addSnackbar('error', error.message);
      }
    },
    abortAxios);

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
