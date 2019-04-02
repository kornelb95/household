import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
class HomeScreen extends Component {
  state = {};
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>FamilyConnector</Text>
            <Ionicons
              style={styles.headerIcon}
              name="md-settings"
              color="white"
              size={32}
            />
          </View>
          <View style={styles.userDataArea}>
            <Text style={styles.userName}>{this.props.loggedUser.name}</Text>
            <Ionicons
              style={styles.connectedIcon}
              name="ios-link"
              color="white"
              size={32}
            />
          </View>
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: 32,
              color: "#fff",
              lineHeight: 80
            }}
          >
            Statystyki
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.memberStats} />
            <View style={styles.memberStats} />
            <View style={styles.memberStats} />
            <View style={styles.memberStats} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: "10%",
    backgroundColor: "#238e8c"
  },
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
  },
  userDataArea: {
    height: 120,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "white",
    justifyContent: "center"
  },
  userName: {
    color: "white",
    lineHeight: 30,
    fontSize: 30,
    fontStyle: "italic",
    textAlign: "center",
    flex: 1,
    fontWeight: "bold"
  },
  connectedIcon: {
    width: "20%",
    lineHeight: 120,
    borderLeftColor: "white",
    borderLeftWidth: 4,
    textAlign: "center"
  },
  statsContainer: {
    minHeight: 200,
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  memberStats: {
    width: "50%",
    height: 100,
    backgroundColor: "#D916AB",
    borderColor: "white",
    borderWidth: 4
  }
});
const mapStateToProps = state => {
  return {
    loggedUser: state.auth.loggedUser,
    isLoading: state.ui.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
