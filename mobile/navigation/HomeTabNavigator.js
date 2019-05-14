import React from "react";
import { createStackNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ChoresScreen from "../screens/ChoresScreen";
import addTaskModal from "../screens/addTaskModal";
import Argues from "../screens/Argues";
const choresAddTaskModalStack = createStackNavigator(
  {
    ChoresScreen: {
      screen: ChoresScreen
    },
    addTaskModal: {
      screen: addTaskModal
    }
  },
  {
    mode: "card",
    headerMode: "none"
  }
);
export default createMaterialBottomTabNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons name="ios-home" color={tintColor} size={26} />
        )
      }
    },
    ChoresScreen: {
      screen: choresAddTaskModalStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons name="ios-list-box" color={tintColor} size={26} />
        )
      }
    },
    ArguesScreen: {
      screen: Argues,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons name="ios-rocket" color={tintColor} size={26} />
        )
      }
    }
  },
  {
    initialRouteName: "HomeScreen",
    activeColor: "#fff",
    inactiveColor: "#bbb",
    barStyle: { backgroundColor: "#D916AB" },
    labeled: false
  }
);
