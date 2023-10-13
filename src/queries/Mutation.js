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
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input)
      @rest(type: "Todo", path: "todos/{args.input.id}", method: "PUT") {
      id
      title
    }
  }
`;

const DELETE_TODO_MUTATION = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id)
      @rest(type: "Todo", path: "todos/{args.id}", method: "DELETE") {
      id
    }
  }
`;

export {CREATE_TODO, UPDATE_TODO_MUTATION, DELETE_TODO_MUTATION};
