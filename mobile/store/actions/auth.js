import { AsyncStorage } from "react-native";
import NavigationService from "../../navigation/NavigationService";
import jwtDecode from "jwt-decode";
import { uiStartLoading, uiStopLoading } from "./ui";
import { fetchUsersFamilyMembers } from "./family";
import {
  AUTH_ERROR,
  LOGIN,
  AUTH_REMOVE_TOKEN,
  AUTH_SET_TOKEN
} from "./actionTypes";
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
        dispatch(uiStopLoading());
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
  return dispatch => {
    dispatch(authStoreToken(authData.token, authData.tokenExpiration));
    dispatch({
      type: LOGIN,
      user: jwtDecode(authData.token)
    });
    dispatch(fetchUsersFamilyMembers(authData.userId));
  };
};
export const authStoreToken = (token, expiresIn) => {
  return dispatch => {
    const now = new Date();
    const expiryDate = now.getTime() + expiresIn * 1000;
    dispatch(authSetToken(token, expiryDate));
    AsyncStorage.setItem("ap:auth:token", token);
    AsyncStorage.setItem("ap:auth:expiryDate", expiryDate.toString());
  };
};

export const authSetToken = (token, expiryDate) => {
  return {
    type: AUTH_SET_TOKEN,
    token: token,
    expiryDate: expiryDate
  };
};
export const authAutoSignIn = () => {
  return dispatch => {
    dispatch(authGetToken())
      .then(token => {
        NavigationService.navigate("Home");
      })
      .catch(err => console.log("Nie udało się pobrać tokena"));
  };
};

export const authGetToken = () => {
  return (dispatch, getState) => {
    const promise = new Promise((resolve, reject) => {
      const token = getState().auth.token;
      const expiryDate = getState().auth.expiryDate;
      if (!token || new Date(expiryDate) <= new Date()) {
        let fetchedToken;
        AsyncStorage.getItem("ap:auth:token")
          .catch(err => reject())
          .then(tokenFromStorage => {
            fetchedToken = tokenFromStorage;
            if (!tokenFromStorage) {
              reject();
              return;
            }
            return AsyncStorage.getItem("ap:auth:expiryDate");
          })
          .then(expiryDate => {
            const parsedExpiryDate = new Date(parseInt(expiryDate));
            const now = new Date();
            if (parsedExpiryDate > now) {
              dispatch(authSetToken(fetchedToken));
              resolve(fetchedToken);
            } else {
              reject();
            }
          })
          .catch(err => reject());
      } else {
        resolve(token);
      }
    });
    return promise
      .catch(err => {
        throw new Error("Błąd auto logowania");
      })
      .then(token => {
        if (!token) {
          throw new Error();
        } else {
          return token;
        }
      });
  };
};
export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem("ap:auth:expiryDate");
    return AsyncStorage.removeItem("ap:auth:token");
  };
};

export const authLogout = () => {
  return dispatch => {
    NavigationService.navigate("LoginScreen");
    dispatch(authClearStorage()).then(() => {
      dispatch(authRemoveToken());
    });
  };
};

export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  };
};
