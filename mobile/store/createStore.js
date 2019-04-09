import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import authReducer from "./reducers/auth";
import uiReducer from "./reducers/ui";
import taskReducer from "./reducers/task";
const rootReducer = combineReducers({
  auth: authReducer,
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
