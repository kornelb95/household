import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Menu, Divider, TouchableRipple } from "react-native-paper";
import { authLogout } from "../store/actions/user";
import { connect } from "react-redux";
class Header extends Component {
  state = {
    visible: false
  };
  _openMenu = () => this.setState({ visible: true });

  _closeMenu = () => this.setState({ visible: false });
  render() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>TaskConnector</Text>

        <Menu
          visible={this.state.visible}
          onDismiss={this._closeMenu}
          style={{ backgroundColor: "#000" }}
          anchor={
            <TouchableRipple
              style={{ justifyContent: "center" }}
              onPress={this._openMenu}
            >
              <Ionicons
                style={styles.headerIcon}
                name="md-settings"
                color="white"
                size={32}
              />
            </TouchableRipple>
          }
        >
          <Menu.Item
            style={{ color: "#000" }}
            onPress={() => {
              this.props.onLogout();
            }}
            title="Wyloguj"
            icon={(size, color) => (
              <Ionicons name="ios-log-out" color="white" size={32} />
            )}
          />
        </Menu>
      </View>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(authLogout())
  };
};
export default connect(
  null,
  mapDispatchToProps
)(Header);
const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    height: 80,
    width: "100%",
    borderBottomColor: "#ddd",
    borderBottomWidth: 4,
    paddingHorizontal: 10,
    justifyContent: "center"
  },
  headerText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    lineHeight: 80
  },
  headerIcon: {
    alignSelf: "center",
    alignContent: "flex-end",
    lineHeight: 80
  }
});
