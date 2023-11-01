# OFFLINE STORAGE
We have implemented offline storage with ApolloClient, utilizing MMKV to store data. This implementation covers various operations, including creating, reading, updating, and deleting data. 

Additionally, we've enabled offline functionality with Apollo Client by leveraging the cache. 

Real-time changes are also supported in the background. 

Furthermore, we have implemented the concepts of cache-only and network-only operations. When the data remains the same, it does not trigger a call to the server. 

Instead, it displays only cached data. However, if any changes occur in the background, it will then initiate a server call to fetch the latest updates, which will be stored in the cache.
