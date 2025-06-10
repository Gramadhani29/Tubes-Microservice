import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import EventStatus from './components/EventStatus';
import EventSubmission from './components/EventSubmission';
import RoomBookingStatus from './components/RoomBookingStatus';
import './App.css';

// Create links for each microservice
const eventStatusLink = new HttpLink({
  uri: 'http://localhost:5001/graphql'
});

const submitEventLink = new HttpLink({
  uri: 'http://localhost:5004/graphql'
});

const roomBookingLink = new HttpLink({
  uri: 'http://localhost:5002/graphql'
});

// Create Apollo Client with multiple endpoints
const client = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().clientName === 'eventStatus',
    eventStatusLink,
    ApolloLink.split(
      operation => operation.getContext().clientName === 'submitEvent',
      submitEventLink,
      roomBookingLink
    )
  ),
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h1>Sistem Pengajuan Event</h1>
        </header>
        <main>
          <EventSubmission />
          <EventStatus />
          <RoomBookingStatus />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App; 