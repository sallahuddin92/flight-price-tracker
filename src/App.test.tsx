import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from './test/test-utils';
import App from './App';
import userEvent from '@testing-library/user-event';

// Mock the lazy-loaded components
vi.mock('./pages/Home', () => ({
  default: () => <div>Home Page</div>
}));

vi.mock('./pages/Settings', () => ({
  default: () => <div>Settings Page</div>
}));

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />);
    const title = await screen.findByText(/Flight Ticket Price Tracker/i);
    expect(title).toBeInTheDocument();
  });

  it('renders navigation links', async () => {
    render(<App />);
    const nav = await screen.findByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
  });

  it('renders main content area', async () => {
    render(<App />);
    const main = await screen.findByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('renders home page by default', async () => {
    render(<App />);
    const homePage = await screen.findByText('Home Page');
    expect(homePage).toBeInTheDocument();
  });

  it('navigates to settings page when clicking settings link', async () => {
    render(<App />);
    const settingsLink = await screen.findByRole('link', { name: /settings/i });
    await userEvent.click(settingsLink);
    const settingsPage = await screen.findByText('Settings Page');
    expect(settingsPage).toBeInTheDocument();
  });

  it('navigates to home page when clicking home link', async () => {
    render(<App />, { initialEntries: ['/settings'] });
    const homeLink = await screen.findByRole('link', { name: /home/i });
    await userEvent.click(homeLink);
    const homePage = await screen.findByText('Home Page');
    expect(homePage).toBeInTheDocument();
  });
}); 