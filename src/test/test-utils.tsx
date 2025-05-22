import { render, RenderOptions } from '@testing-library/react';
import { AlertProvider } from '../context/AlertContext';
import { ThemeProvider } from '../context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

const Providers = ({ children, initialEntries = ['/'] }: { children: ReactNode; initialEntries?: string[] }) => (
  <HelmetProvider>
    <ThemeProvider>
      <AlertProvider>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </AlertProvider>
    </ThemeProvider>
  </HelmetProvider>
);

const customRender = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialEntries, ...restOptions } = options;
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={initialEntries}>
        <Providers>{children}</Providers>
      </MemoryRouter>
    ),
    ...restOptions,
  });
};

export * from '@testing-library/react';
export { customRender as render }; 