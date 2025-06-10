import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import client from './apolloClient';

test('renders welcome message', () => {
  render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  );
  const welcomeElement = screen.getByText(/Selamat Datang di Sistem Kemahasiswaan/i);
  expect(welcomeElement).toBeInTheDocument();
});
