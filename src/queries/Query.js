import {gql} from '@apollo/client';

const query = gql`
  query Todos {
    employees @rest(type: "[Employees]", path: "employees") {
      id
      name
    }
  }
`;

export default query;
