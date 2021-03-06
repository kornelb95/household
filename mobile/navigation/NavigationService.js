import { NavigationActions, StackActions } from "react-navigation";

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}
function back() {
  _navigator.dispatch(NavigationActions.back());
}
function pop() {
  _navigator.dispatch(StackActions.popToTop());
}
function reset() {
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "MainScreen" })]
    })
  );
}
export default {
  navigate,
  setTopLevelNavigator,
  back,
  reset,
  pop
};
