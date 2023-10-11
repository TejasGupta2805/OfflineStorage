import {gql} from '@apollo/client';

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(input: {title: $title})
      @rest(type: "Todo", path: "todos", method: "POST") {
      id
      title
    }
  }
`;

const UPDATE_TODO_MUTATION = gql`
  mutation UpdateTodo($id: ID!, $title: String!) {
    updateTodo(id: $id, title: $title) {
      id
      title
    }
  }
`;

const DELETE_TODO_MUTATION = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
    }
  }
`;

export {CREATE_TODO, UPDATE_TODO_MUTATION, DELETE_TODO_MUTATION};
