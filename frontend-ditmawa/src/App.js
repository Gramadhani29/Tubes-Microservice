import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';
import EventDetail from './components/EventDetail';
import EventApproval from './components/EventApproval';
import './App.css';

// Create links for each microservice
const allEventsLink = new HttpLink({
  uri: 'http://localhost:5003/graphql'
});

const approveEventLink = new HttpLink({
  uri: 'http://localhost:5005/graphql'
});

// Create Apollo Client with multiple endpoints
const client = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().clientName === 'allEvents',
    allEventsLink,
    approveEventLink
  ),
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h1>Ditmawa Portal - Manajemen Event</h1>
        </header>
        <main>
          <EventDetail />
          <EventApproval />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;