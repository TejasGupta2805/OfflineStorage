import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {RestLink} from 'apollo-link-rest';
import React from 'react';
import {TodoList} from './src/screens/TodoList';

const restLink = new RestLink({
  uri: 'https://jsonplaceholder.typicode.com/',
});

const clients = new ApolloClient({
  cache: new InMemoryCache(),
  link: restLink,
});

const App = () => {
  return (
    <ApolloProvider client={clients}>
      <TodoList />
    </ApolloProvider>
  );
};

export default App;
