import {
  gql,
  useQuery,
  useMutation,
  useApolloClient,
  ApolloClient,
  makeVar,
  useReactiveVar,
} from '@apollo/client';
import NetInfo from '@react-native-community/netinfo';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import {MMKV_STORAGE, purgeCache} from '../../ApolloClient';
import {client, persistor} from '../../App';
import {DELETE_TODO_MUTATION, CREATE_EMPLOYEE} from '../queries/Mutation';
import query from '../queries/Query';

export const OfflineStorage = () => {
  const [title, setTitle] = useState('');
  const [offlineData, setOfflineData] = useState([]);
  const [todoId, setTodoId] = useState(null);
  const [isTitleClicked, setIsTitleClicked] = useState(false);
  const {loading, error, data, refetch} = useQuery(query, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 500,
  });

  const apolloClient = useApolloClient();
  const cacheClearedVar = makeVar(false);
  const cacheCleared = useReactiveVar(cacheClearedVar);

  const [isConnected, setIsConnected] = useState(false);
  const [showNetworkStatus, setShowNetworkStatus] = useState(true);
  const [createEmployee] = useMutation(CREATE_EMPLOYEE);
  const [deleteTodo] = useMutation(DELETE_TODO_MUTATION);

  const createItemOffline = (key, value) => {
    const offlineDatas = MMKV.getString('offlineData');
    const parsedData = offlineDatas ? JSON.parse(offlineData) : [];
    parsedData.push({key, value});
    MMKV.setString('offlineData', JSON.stringify(parsedData));
  };

  const deleteItemOffline = key => {
    const offlineData = MMKV.getString('offlineData');
    const parsedData = offlineData ? JSON.parse(offlineData) : [];
    parsedData.push({key, value: null});
    MMKV.setString('offlineData', JSON.stringify(parsedData));
  };

  useEffect(() => {
    if (cacheCleared) {
      console.log('Cache cleared');
    }
  }, [cacheCleared]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setShowNetworkStatus(true);
      setTimeout(() => {
        setShowNetworkStatus(false);
      }, 3000);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleCreateEmployee = async () => {
    if (!title) {
      Alert.alert('Title Required', 'Please enter a title.');
      return;
    }

    if (isConnected) {
      try {
        const result = await createEmployee({
          variables: {name: title},
        });

        if (result.errors) {
          const errorMessage = result.errors.map(err => err.message).join('\n');
          console.error('Error creating todo:', errorMessage);
          Alert.alert('Error', errorMessage);
        } else {
          setTitle('');
          refetch();
          Alert.alert(
            'Todo Added',
            `Todo with title "${title}" has been added.`,
          );
        }
      } catch (error) {
        setTitle('');
        console.error('Error creating todo:', error.message);
        Alert.alert('Error', 'Failed to create todo.');
      }
    } else {
      try {
        createItemOffline('employeeName', title);
        setTitle('');
      } catch (error) {
        console.error('Error creating offline item:', error);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      Alert.alert('Data Refreshed', 'Data refreshed successfully!');
      setTitle('');
      setIsTitleClicked(false);
    } catch (error) {
      console.error('Error refreshing data:', error.message);
      Alert.alert('Error', 'Failed to refresh data.');
    }
  };

  const handleLongPressDelete = (id, title) => {
    Alert.alert(
      'Delete Todo',
      `Are you sure you want to delete this ${title}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            if (isConnected) {
              try {
                const result = await deleteTodo({
                  variables: {
                    id: id,
                  },
                });

                refetch();
              } catch (error) {
                console.error('Error deleting todo:', error.message);
                Alert.alert('Error', 'Failed to delete todo.');
              }
            }
          },
        },
      ],
    );
  };

  const handleCacheData = () => {
    console.log('logged out!!');
    const keys = MMKV_STORAGE.getAllKeys();
    const res = MMKV_STORAGE.getString('apollo-cache-persist');
    console.log('keys', res);
    console.log('========================');
  };

  const handleDeleteAllEmployees = () => {
    apolloClient.cache.reset();
    persistor.persist();
    cacheClearedVar(true);
    refetch();
    cacheClearedVar(false);
    Alert.alert('Cache Deleted', 'Cache deleted successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>MetaData</Text>
      <View style={styles.horizontalLine} />
      <TextInput
        style={styles.input}
        placeholder="Enter a title"
        placeholderTextColor={isTitleClicked ? 'black' : 'gray'}
        value={title}
        onChangeText={text => setTitle(text)}
      />
      <Pressable
        style={[
          styles.createButton,
          {backgroundColor: isTitleClicked ? '#3498db' : '#2980b9'},
        ]}
        onPress={handleCreateEmployee}>
        <Text style={styles.createButtonText}>
          {isTitleClicked ? 'Update Todo' : 'Create Data'}
        </Text>
      </Pressable>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </Pressable>

        <Pressable style={styles.cacheButton} onPress={handleCacheData}>
          <Text style={styles.cacheButtonText}>Cache</Text>
        </Pressable>

        <Pressable
          style={styles.deleteAllButton}
          onPress={handleDeleteAllEmployees}>
          <Text style={styles.deleteAllButtonText}>Delete All</Text>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.activityIndicator}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          {data &&
            data.employees &&
            data.employees.map(employee => (
              <Pressable
                style={styles.employeeContainer}
                key={employee.id}
                onLongPress={() =>
                  handleLongPressDelete(employee.id, employee.name)
                }>
                <Text style={styles.employeeText}>Title: {employee.name}</Text>
                <View style={styles.separator} />
              </Pressable>
            ))}
        </ScrollView>
      )}
      {showNetworkStatus && (
        <View
          style={[
            styles.networkStatus,
            {backgroundColor: isConnected ? 'black' : 'red'},
          ]}>
          <Text style={styles.networkStatusText}>
            Network Status: {isConnected ? 'Connected' : 'Not Connected'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  title: {
    fontSize: 22,
    color: '#111',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 12,
  },
  horizontalLine: {
    height: 1,
    borderWidth: 0.3,
    borderColor: 'gray',
    width: '100%',
  },
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 0.7,
    padding: 8,
    marginVertical: 10,
    borderRadius: 10,
    fontWeight: 'bold',
    fontSize: 21,
    marginTop: 40,
  },
  createButton: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
  refreshButton: {
    margin: 10,
    backgroundColor: '#3498db',
    padding: 10,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 10,
  },
  refreshButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cacheButton: {
    margin: 10,
    backgroundColor: '#3498db',
    padding: 10,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 10,
  },
  cacheButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  deleteAllButton: {
    margin: 10,
    backgroundColor: '#ff0000',
    padding: 10,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteAllButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  activityIndicator: {
    marginTop: 50,
  },
  scrollView: {
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'gray',
    minHeight: 300,
    maxHeight: 600,
  },

  employeeContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  employeeText: {
    fontSize: 23,
    marginHorizontal: 8,
    marginVertical: 8,
    color: 'black',
    fontWeight: '500',
  },
  separator: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 0.4,
    height: 1,
  },
  networkStatus: {
    backgroundColor: 'red',
    paddingVertical: 3,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
  },
  networkStatusText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 6,
  },
  scrollContent: {
    minHeight: 300,
  },
});
