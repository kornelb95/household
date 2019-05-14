import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";
import HomeTabNavigator from "../navigation/HomeTabNavigator";
import MainScreen from "../screens/MainScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";

const mainStackNav = createStackNavigator({
  MainScreen,
  LoginScreen,
  SignupScreen
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Main: mainStackNav,
      Home: HomeTabNavigator
    },
    {
      resetOnBlur: true
    }
  )
);
