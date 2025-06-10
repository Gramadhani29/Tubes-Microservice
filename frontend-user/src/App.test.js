import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import App from './App';

test('renders user portal title', () => {
  render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  );
  const titleElement = screen.getByText(/User Portal/i);
  expect(titleElement).toBeInTheDocument();
}); 