import React from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
function AddTaskButton({ family, navigate }) {
  return family === null ? (
    <View
      style={[styles.addTaskIconWrapper, { width: "40%", paddingLeft: 15 }]}
    >
      <Text style={{ color: "red", fontSize: 18, fontWeight: "900" }}>
        Najpierw dołącz do rodziny.
      </Text>
    </View>
  ) : (
    <TouchableHighlight
      onPress={() => navigate("addTaskModal")}
      style={styles.addTaskIconWrapper}
    >
      <Ionicons
        style={styles.addTaskIcon}
        name="ios-add-circle"
        color="white"
        size={32}
      />
    </TouchableHighlight>
  );
}
const styles = StyleSheet.create({
  addTaskIconWrapper: {
    borderLeftColor: "white",
    borderLeftWidth: 4,
    width: "20%"
  },
  addTaskIcon: {
    lineHeight: 120,

    textAlign: "center"
  }
});
export default AddTaskButton;
