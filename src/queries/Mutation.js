import {gql} from '@apollo/client';

const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($name: String!) {
    createEmployee(input: {name: $name})
      @rest(type: "Employee", path: "employee", method: "POST") {
      id
      name
    }
  }
`;

// const UPDATE_TODO_MUTATION = gql`
//   mutation UpdateTodo($input: UpdateTodoInput!) {
//     updateTodo(input: $input)
//       @rest(type: "Employee", path: "employees", method: "PUT") {
//       id
//       name
//       department
//       designation
//       phoneNumber
//       salary
//       active
//     }
//   }
// `;

const DELETE_TODO_MUTATION = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id)
      @rest(type: "Employee", path: "employees/{args.id}", method: "DELETE") {
      id
    }
  }
`;

export {CREATE_EMPLOYEE, DELETE_TODO_MUTATION};
