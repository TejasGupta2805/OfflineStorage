import {gql, useQuery, useMutation} from '@apollo/client';
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
} from 'react-native';
import {client} from '../../App';
import {
  CREATE_TODO,
  UPDATE_TODO_MUTATION,
  DELETE_TODO_MUTATION,
} from '../queries/Mutation';
import query from '../queries/Query';

export const TodoList = () => {
  const [title, setTitle] = useState('');
  const [todoId, setTodoId] = useState(null);
  const [isTitleClicked, setIsTitleClicked] = useState(false);
  const {loading, error, data, refetch} = useQuery(query);

  const [createTodo] = useMutation(CREATE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO_MUTATION);
  const [deleteTodo] = useMutation(DELETE_TODO_MUTATION);

  useEffect(() => {
    if (data) {
      console.log('Data Called', data);
    }
    if (error) {
      console.error('Error in GraphQL query:', error);
    }
  }, [data, error]);

  const handleCreateTodo = async () => {
    if (!title) {
      Alert.alert('Title Required', 'Please enter a title.');
      return;
    }

    try {
      const result = await createTodo({
        variables: {title},
      });

      console.log('NEW CALLED', result);

      if (result.errors) {
        const errorMessage = result.errors.map(err => err.message).join('\n');
        console.error('Error creating todo:', errorMessage);
        Alert.alert('Error', errorMessage);
      } else {
        setTitle('');
        refetch();
        Alert.alert('Todo Added', `Todo with title "${title}" has been added.`);
      }
    } catch (error) {
      setTitle('');
      console.error('Error creating todo:', error.message);
      Alert.alert('Error', 'Failed to create todo.');
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

  const handleUpdateData = async (id, titles) => {
    console.log('Current Title', titles);
    setTitle(titles);
    setTodoId(id);
    setIsTitleClicked(true);
  };

  const handleUpdateTodo = async () => {
    try {
      const result = await updateTodo({
        variables: {
          input: {
            id: parseInt(todoId),
            title,
          },
        },
      });

      console.log('Updated Result', result);

      if (result.errors) {
        const errorMessage = result.errors.map(err => err.message).join('\n');
        console.error('Error updating todo:', errorMessage);
        Alert.alert('Error', errorMessage);
      } else {
        setTitle('');
        setTodoId(null);
        setIsTitleClicked(false);
        refetch();
        Alert.alert(
          'Todo Updated',
          `Todo with title "${title}" has been updated.`,
        );
      }
    } catch (error) {
      setTitle('');
      console.error('Error creating todo:', error.message);
      Alert.alert('Error', 'Failed to create todo.');
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
            try {
              const result = await deleteTodo({
                variables: {
                  id: id,
                },
              });

              console.log('NEW DELETE', result);
              refetch();
            } catch (error) {
              console.error('Error deleting todo:', error.message);
              Alert.alert('Error', 'Failed to delete todo.');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
      }}>
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
          height: 1,
          borderWidth: 0.3,
          borderColor: 'gray',
          width: '100%',
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
          fontWeight: isTitleClicked ? 'bold' : '500',
          fontSize: isTitleClicked ? 21 : 18,
          marginTop: 40,
        }}
        placeholder="Enter a title"
        placeholderTextColor={isTitleClicked ? 'black' : 'gray'}
        value={title}
        onChangeText={text => setTitle(text)}
      />

      <Pressable
        style={{
          margin: 10,
          backgroundColor: isTitleClicked ? 'blue' : 'green',
          padding: 10,
          borderWidth: 1,
          borderColor: isTitleClicked ? 'blue' : 'green',
          borderRadius: 10,
        }}
        onPress={isTitleClicked ? handleUpdateTodo : handleCreateTodo}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
          {isTitleClicked ? 'Update Todo' : 'Create Todo'}
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
        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
          Refresh
        </Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{marginTop: 50}}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 300, width: '100%'}}>
          {data &&
            data.todos &&
            data.todos.map(todo => (
              <Pressable
                style={{alignItems: 'center', marginTop: 15}}
                key={todo.id}
                onPress={() => handleUpdateData(todo.id, todo.title)}
                onLongPress={() => handleLongPressDelete(todo.id, todo.title)}>
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
              </Pressable>
            ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
