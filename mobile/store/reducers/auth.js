import {
  AUTH_ERROR,
  LOGIN,
  AUTH_REMOVE_TOKEN,
  AUTH_SET_TOKEN,
  FETCH_FAMILY_MEMBERS
} from "../actions/actionTypes";
const initialState = {
  error: "",
  loggedUser: "",
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
    case LOGIN:
      return {
        ...state,
        loggedUser: action.user
      };
    case FETCH_FAMILY_MEMBERS:
      return {
        ...state,
        loggedUser: {
          ...state.loggedUser,
          family: {
            ...state.loggedUser.family,
            ...action.family.getUserById.family
          }
        }
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
        loggedUser: null
      };
    default:
      return state;
  }
};

export default reducer;
