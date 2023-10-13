import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {RestLink} from 'apollo-link-rest';
import React from 'react';
import {TodoList} from './src/screens/TodoList';

const restLink = new RestLink({
  uri: 'http://192.168.0.140:8083/',
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: restLink,
  connectToDevTools: true,
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <TodoList />
    </ApolloProvider>
  );
};

export default App;
