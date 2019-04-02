import NavigationService from "../../navigation/NavigationService";
import jwtDecode from "jwt-decode";
import { uiStartLoading, uiStopLoading } from "./ui";
import { AUTH_ERROR, LOGIN } from "./actionTypes";
const uri = "http://192.168.1.12:8000/graphql";
export const signup = userData => {
  return dispatch => {
    dispatch(uiStartLoading());
    const { email, password, name, isFamilyCreating, familyName } = userData;
    const requestBody = {
      query: `
        mutation CreateUser($email: String!, $password: String!, $name: String!, $isFamilyCreating: Boolean!, $familyName: String) {
          createUser(userInput: {email: $email, password: $password, name: $name, isFamilyCreating: $isFamilyCreating, familyName: $familyName}) {
            _id
          }
        }
      `,
      variables: {
        email: email.value,
        password: password.value,
        name: name.value,
        isFamilyCreating: isFamilyCreating.value,
        isFamilyCreating: isFamilyCreating.value,
        familyName: familyName.value
      }
    };
    fetch(uri, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes);
        if (parsedRes.errors) {
          dispatch(authError(parsedRes.errors[0].message));
          dispatch(uiStopLoading());
        } else {
          dispatch(uiStopLoading());
          NavigationService.back();
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(authError(err));
      });
  };
};

export const login = userData => {
  return dispatch => {
    dispatch(uiStartLoading());
    const { email, password } = userData;
    const requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email.value,
        password: password.value
      }
    };
    fetch(uri, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes);
        if (parsedRes.data === null) {
          dispatch(authError(parsedRes.errors[0].message));
          dispatch(uiStopLoading());
        } else {
          dispatch(uiStopLoading());
          NavigationService.navigate("Home");
          dispatch(userLogin(parsedRes.data.login));
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(authError(err));
      });
  };
};

authError = error => {
  return {
    type: AUTH_ERROR,
    error
  };
};

userLogin = authData => {
  return {
    type: LOGIN,
    user: jwtDecode(authData.token)
  };
};
