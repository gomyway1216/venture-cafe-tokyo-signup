import { doFetch } from "./doFetch";
import moment from "moment";

export const userSignUp = ({ firstName, lastName, email }) => {
  const requestBody = {
    query: `
      mutation CreateUser($firstName: String!, $lastName: String!, $email: String!, $date: String!) {
        createUser(createUserInput: {firstName: $firstName, lastName: $lastName, email: $email, date: $date}) {
            id: _id
            firstName
            lastName
        }
    }
      `,
    variables: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      date: moment().format()
    }
  };

  return doFetch(requestBody);
};
