import {
  AUTH_ERROR,
  LOGIN_AND_FETCH_FAMILY,
  AUTH_REMOVE_TOKEN,
  AUTH_SET_TOKEN,
  JOIN_TO_FAMILY
} from "../actions/actionTypes";
const initialState = {
  error: "",
  loggedUser: "",
  family: null,
  expiryDate: null,
  token: null
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_ERROR:
      return {
        ...state,
        error: action.error
      };
    case LOGIN_AND_FETCH_FAMILY:
      return {
        ...state,
        loggedUser: action.payload.user,
        family: action.payload.family
      };

    case AUTH_SET_TOKEN:
      return {
        ...state,
        token: action.token,
        expiryDate: action.expiryDate
      };
    case AUTH_REMOVE_TOKEN:
      return {
        ...state,
        token: null,
        expiryDate: null,
        loggedUser: null,
        family: null
      };
    case JOIN_TO_FAMILY:
      return {
        ...state,
        family: action.family
      };
    default:
      return state;
  }
};

export default reducer;
