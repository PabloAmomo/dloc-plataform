import { createContext, useContext } from 'react';
import { SnackbarProvider, useSnackbar, VariantType } from 'notistack';
import { SnackProviderInterface } from 'models/SnackProviderInterface';

const SnackContext = createContext<SnackProviderInterface>({ addSnackbar: () => {} });

export function SnackProvider({ children }: { children: any }) {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <SnackContext.Provider
      value={{
        addSnackbar: (variant: VariantType, message: string) => enqueueSnackbar(message, { variant }),
      }}
    >
      <SnackbarProvider maxSnack={3} />
      {children}
    </SnackContext.Provider>
  );
}

export const useSnackContext = () => useContext(SnackContext);
