import { View, FlatList } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Text } from "@rneui/base";
import socket from "../utils/socket";
import { useOtherUsers, useSetOtherUsers } from "../contexts/OtherUsersContext";
import { StyleSheet } from "react-native";
import TextAvatar from "react-native-text-avatar";
import colorHash from "../utils/hashcolor";

export default function Poeple_list({ navigation }) {
  const OU = useOtherUsers();
  const SOU = useSetOtherUsers();

  return (
    <>
      <Button
        title="People List"
        onPress={() => navigation.navigate("chat_screen")}
      >
        <Text>back to all chat</Text>
      </Button>

      <FlatList
        style={styles.container}
        data={OU}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TextAvatar
              style={styles.TextAvatar}
              backgroundColor={colorHash(item.user.FirstName).hex}
              textColor={colorHash(item.user.LastName).hex}
              size={60}
              type={"circle"}
            >
              {item.user.FirstName + item.user.LastName}
            </TextAvatar>
            <Text style={styles.OUS}>
              {item.user.FirstName} {item.user.LastName}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
  },
  OUS: {
    margin: 10,
    padding: 10,
    fontSize: 20,
  },
  item: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
});
