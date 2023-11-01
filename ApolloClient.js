import {ApolloClient, InMemoryCache} from '@apollo/client';
import {MMKVWrapper, CachePersistor} from 'apollo3-cache-persist';
import {RestLink} from 'apollo-link-rest';
import {MMKV} from 'react-native-mmkv';

const restLink = new RestLink({
  uri: 'https://ys348mdckl.execute-api.ap-south-1.amazonaws.com/dev/crud/empapp/',
});

export const MMKV_STORAGE = new MMKV();
const cache = new InMemoryCache({});
const clients = new ApolloClient({
  cache: cache,
  link: restLink,
});

export const persistor = new CachePersistor({
  cache: cache,
  storage: new MMKVWrapper(MMKV_STORAGE),
  maxSize: false,
  trigger: 'background',
});

persistor.restore();

export const purgeCache = async () => {
  persistor.pause();
  persistor.purge();
  clients.resetStore();
};
