import {gql} from '@apollo/client';

const query = gql`
  query Todos {
    todos @rest(type: "[Todo]", path: "todos") {
      id
      title
      completed
    }
  }
`;

export default query;
