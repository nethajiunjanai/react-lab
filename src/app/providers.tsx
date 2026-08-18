import type { ReactNode } from 'react';

import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { PrimeReactProvider } from '@primereact/core';
import Aura from '@primeuix/themes/aura';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
});

const primeReactConfig = {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false,
        },
    },
};

type AppProvidersProps = {
    children: ReactNode;
};

export function AppProviders({
    children,
}: AppProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <PrimeReactProvider {...primeReactConfig}>
                {children}
            </PrimeReactProvider>

            {import.meta.env.DEV && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                />
            )}
        </QueryClientProvider>
    );
}