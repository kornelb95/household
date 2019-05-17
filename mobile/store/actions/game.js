import NavigationService from "../../navigation/NavigationService";
import { START_GAME } from "./actionTypes";
export const startGame = () => {
  NavigationService.navigate("GameScreen");
  return dispatch => {
    dispatch({
      type: START_GAME
    });
  };
};
