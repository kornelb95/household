import React, { Component } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import {
  ActivityIndicator,
  TouchableRipple,
  Button,
  Paragraph,
  Dialog,
  Portal,
  withTheme,
  Divider,
  TextInput
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import Header from "../components/Header";
import { joinToFamily } from "../store/actions/user";

class HomeScreen extends Component {
  state = {
    visible: false,
    pin: ""
  };

  _showDialog = () => this.setState({ visible: true });

  _hideDialog = () => this.setState({ visible: false });
  render() {
    const user = this.props.loggedUser;
    const family = this.props.family;
    return (
      <ScrollView>
        {this.props.isLoading ? (
          <View style={styles.container}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.container}>
            <Header />
            <View style={styles.userDataArea}>
              <View style={{ flex: 1, paddingTop: 20 }}>
                <Text style={styles.userName}>
                  {user.name}
                  {family &&
                  family.creator &&
                  family.creator._id === user.userId
                    ? " - Założyciel"
                    : null}
                </Text>
                <Text
                  style={[
                    styles.userName,
                    { fontSize: 20, alignItems: "flex-start" }
                  ]}
                >
                  Grupa: {family ? family.name : "Brak"}
                </Text>
              </View>
              <TouchableRipple
                onPress={() => this._showDialog()}
                style={styles.connectedIcon}
              >
                <Ionicons
                  style={{ lineHeight: 120, textAlign: "center" }}
                  name="ios-link"
                  color="white"
                  size={32}
                />
              </TouchableRipple>
              <View>
                <Portal>
                  <Dialog
                    visible={this.state.visible}
                    onDismiss={this._hideDialog}
                  >
                    <Dialog.Title
                      style={{ color: "#000", textAlign: "center" }}
                    >
                      Dołącz do grupy i zacznij zabawę
                    </Dialog.Title>
                    <Divider />
                    {family === null ? (
                      <Dialog.Content>
                        <Paragraph style={{ color: "#000" }}>
                          Aby dołączyć do grupy, wpisz numer PIN od założyciela.
                        </Paragraph>
                        <TextInput
                          label="kod PIN grupy"
                          value={this.state.pin}
                          onChangeText={pin => this.setState({ pin })}
                          style={{ marginVertical: 20 }}
                        />
                        <Button
                          mode="contained"
                          onPress={() =>
                            this.props.onJoinToFamily(
                              user.userId,
                              this.state.pin
                            )
                          }
                        >
                          Zatwierdź
                        </Button>
                      </Dialog.Content>
                    ) : (
                      <Dialog.Content>
                        <Paragraph style={{ color: "#000" }}>
                          {family &&
                          family.creator &&
                          family.creator._id === user.userId
                            ? "Udostępnij kod PIN użytkownikowi, aby dołączył."
                            : "Jesteś już członkiem grupy."}
                        </Paragraph>
                        {family &&
                        family.creator &&
                        family.creator._id === user.userId ? (
                          <Text
                            style={{
                              textAlign: "center",
                              fontSize: 20,
                              color: "#D916AB"
                            }}
                          >
                            {family.pin}
                          </Text>
                        ) : null}
                      </Dialog.Content>
                    )}
                    <Dialog.Actions>
                      <Button onPress={this._hideDialog}>Zamknij</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
              </View>
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
        )}
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
    borderLeftColor: "white",
    borderLeftWidth: 4
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
    loggedUser: state.user.loggedUser,
    family: state.user.family,
    isLoading: state.ui.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onJoinToFamily: (userID, pin) => dispatch(joinToFamily(userID, pin))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(HomeScreen));
