import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer from "./reducers/user";
import uiReducer from "./reducers/ui";
import taskReducer from "./reducers/task";
const rootReducer = combineReducers({
  user: userReducer,
  ui: uiReducer,
  task: taskReducer
});

let composeEnhancers = compose;
if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;
