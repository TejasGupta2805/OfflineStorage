import {
  ApolloClient,
  gql,
  InMemoryCache,
  useMutation,
  useQuery,
} from '@apollo/client';
import {
  ActivityIndicator,
  Alert,
  Button,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {RestLink} from 'apollo-link-rest';
import React, {useEffect, useState} from 'react';
import query from '../queries/Query';
import {
  CREATE_TODO,
  DELETE_TODO_MUTATION,
  UPDATE_TODO_MUTATION,
} from '../queries/Mutation';

export const TodoList = () => {
  const [title, setTitle] = useState('');

  const {loading, error, data, refetch} = useQuery(query);

  const [createTodo] = useMutation(CREATE_TODO, {
    onError: error => {
      console.error('Error creating todo:', error.message);
    },
  });

  const [updateTodo] = useMutation(UPDATE_TODO_MUTATION, {
    onError: error => {
      console.error('Error updating todo:', error.message);
    },
  });

  const [deleteTodo] = useMutation(DELETE_TODO_MUTATION, {
    onError: error => {
      console.error('Error deleting todo:', error.message);
    },
  });

  useEffect(() => {
    console.log('Data:', data);
  }, [data]);

  const handleCreateTodo = async () => {
    if (!title) {
      Alert.alert('Title Required', 'Please enter a title.');
      return;
    }

    try {
      console.log('Creating todo...');
      await createTodo({variables: {title}});
      console.log('Todo created successfully!');
      setTitle('');
      refetch();
      Alert.alert('Todo Added', `Todo with title "${title}" has been added.`);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      console.log('Data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  return (
    <View style={{alignItems: 'center'}}>
      <Text
        style={{
          fontSize: 22,
          color: 'black',
          fontWeight: '500',
          marginTop: 10,
          marginBottom: 12,
        }}>
        ToDo
      </Text>

      <View
        style={{
          width: '100%',
          borderColor: 'gray',
          borderWidth: 0.4,
          height: 1,
        }}
      />

      <TextInput
        style={{
          width: '80%',
          borderColor: 'gray',
          borderWidth: 0.7,
          padding: 8,
          marginVertical: 10,
          borderRadius: 10,
        }}
        placeholder="Enter a title"
        value={title}
        onChangeText={text => setTitle(text)}
      />

      <Pressable
        style={{
          margin: 10,
          backgroundColor: 'blue',
          padding: 10,
          borderWidth: 1,
          borderColor: 'blue',
          borderRadius: 10,
        }}
        onPress={handleCreateTodo}>
        <Text style={{fontSize: 15, fontWeight: '400', color: 'white'}}>
          Create Todo
        </Text>
      </Pressable>

      <Pressable
        style={{
          margin: 10,
          backgroundColor: 'green',
          padding: 10,
          borderWidth: 1,
          borderColor: 'green',
          borderRadius: 10,
        }}
        onPress={handleRefresh}>
        <Text style={{fontSize: 15, fontWeight: '400', color: 'white'}}>
          Refresh
        </Text>
      </Pressable>

      {loading ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={{alignItems: 'center', marginTop: 10}}>
          <ScrollView style={{marginBottom: 120}}>
            {data.todos.map(todo => (
              <View key={todo.id}>
                <Text
                  style={{
                    fontSize: 23,
                    marginHorizontal: 8,
                    marginVertical: 8,
                    color: 'black',
                    fontWeight: '500',
                  }}>
                  Title: {todo.title}
                </Text>
                <View
                  style={{
                    width: '100%',
                    borderColor: 'gray',
                    borderWidth: 0.4,
                    height: 1,
                  }}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
