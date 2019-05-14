import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer from "./reducers/user";
import uiReducer from "./reducers/ui";
import taskReducer from "./reducers/task";
import gameReducer from "./reducers/gameRoom";
const rootReducer = combineReducers({
  user: userReducer,
  ui: uiReducer,
  task: taskReducer,
  game: gameReducer
});

let composeEnhancers = compose;
if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;
