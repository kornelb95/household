import React from "react";
import { View, Text, Image } from "react-native";
import { connect } from "react-redux";
import { TouchableRipple } from "react-native-paper";
import { makeChoice } from "../socket";
class GameScreen extends React.Component {
  render() {
    const me = this.props.gameRoom.roomMembers.filter(
      member => member.user.userId === this.props.loggedUser.userId
    )[0];
    let opponent = this.props.gameRoom.roomMembers.filter(
      member => member.user.userId !== this.props.loggedUser.userId
    )[0];
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "space-between"
        }}
      >
        <Text
          style={{
            paddingTop: 70,
            textAlign: "center",
            fontFamily: "amatic-font",
            fontSize: 50,
            color: "#fff"
          }}
        >{`${me.user.name} vs ${opponent.user.name}`}</Text>
        <Text
          style={{
            textAlign: "center",
            fontFamily: "amatic-font",
            fontSize: 45,
            color: "#fff"
          }}
        >{`${me.points} : ${opponent.points}`}</Text>
        <Text
          style={{
            textAlign: "center",
            fontFamily: "amatic-font",
            fontSize: 45,
            color: "#fff"
          }}
        >
          {this.props.gameRoom.action}
        </Text>
        <View
          style={{
            alignContent: "flex-end",
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 30
          }}
        >
          <TouchableRipple
            onPress={() => makeChoice("paper", me)}
            rippleColor="rgba(200, 200, 200, .32)"
          >
            <Image
              style={{ width: 60, height: 60 }}
              source={require("../assets/images/paper.png")}
            />
          </TouchableRipple>
          <TouchableRipple
            onPress={() => makeChoice("rock", me)}
            rippleColor="rgba(200, 200, 200, .32)"
          >
            <Image
              style={{ width: 60, height: 60 }}
              source={require("../assets/images/rock.png")}
            />
          </TouchableRipple>
          <TouchableRipple
            onPress={() => makeChoice("scissors", me)}
            rippleColor="rgba(200, 200, 200, .32)"
          >
            <Image
              style={{ width: 60, height: 60 }}
              source={require("../assets/images/scissors.png")}
            />
          </TouchableRipple>
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    loggedUser: state.user.loggedUser,
    isLoading: state.ui.isLoading,
    gameRoom: state.game
  };
};
const mapDispatchToProps = dispatch => {};
export default connect(
  mapStateToProps,
  null
)(GameScreen);
