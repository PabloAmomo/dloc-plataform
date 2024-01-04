import './styles/index.css';
import { BrowserRouter } from 'react-router-dom';
import { DevicesProvider } from 'context/DevicesProvider';
import { SnackProvider } from 'context/SnackProvider';
import { UserProvider } from 'context/UserProvider';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <DevicesProvider>
        <SnackProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SnackProvider>
      </DevicesProvider>
    </UserProvider>
  </React.StrictMode>
);
