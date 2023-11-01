import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {RestLink} from 'apollo-link-rest';
import React from 'react';
import {MMKVWrapper, CachePersistor} from 'apollo3-cache-persist';
import {MMKV} from 'react-native-mmkv';
import {OfflineStorage} from './src/screens/OfflineStorage';

export const restLink = new RestLink({
  uri: 'https://ys348mdckl.execute-api.ap-south-1.amazonaws.com/dev/crud/empapp/',
});

export const MMKV_STORAGE = new MMKV();
const cache = new InMemoryCache();

export const client = new ApolloClient({
  cache: cache,
  link: restLink,
});

export const persistor = new CachePersistor({
  cache,
  storage: new MMKVWrapper(MMKV_STORAGE),
  maxSize: false,
  trigger: 'background',
});

persistor.restore();

const App = () => {
  return (
    <ApolloProvider client={client}>
      <OfflineStorage />
    </ApolloProvider>
  );
};

export default App;
