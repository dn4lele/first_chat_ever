import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState, useRef, createRef } from "react";
import { Button, Input } from "@rneui/base";
import socket from "../utils/socket";
import TextAvatar from "react-native-text-avatar";
import { useUser, useSetUser, UserProvider } from "../contexts/UserContext";
import { Platform } from "react-native";
import colorHash from "../utils/hashcolor";
import { useOtherUsers, useSetOtherUsers } from "../contexts/OtherUsersContext";

export default function ChatScreen({ navigation }) {
  const mysocket = useRef();
  const input = useRef();
  const scrollv_ref = useRef();

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Enter") {
      send();
      input.focus();
    }
  };

  const user = useUser();
  const setUser = useSetUser();

  const OU = useOtherUsers();
  const SOU = useSetOtherUsers();

  const [message, setMessage] = useState("");
  const [messageList, setmessageList] = useState([]);

  useEffect(() => {
    scrollv_ref.current.scrollToEnd({ animated: true });
  }, [messageList]);

  useEffect(() => {
    mysocket.current = socket.connect();
    if (user != null) {
      mysocket.current.emit("message", {
        message: user.FirstName + " has connected",
        type: "connectUser",
        user: user,
      });
    }
    mysocket.current.on("message", (msg) => {
      setmessageList(msg);
    });

    mysocket.current.on("getPeople", (allusers) => {
      let otheru = allusers.filter((user) => user.id != mysocket.current.id);
      if (otheru.length > 0) {
        SOU(otheru);
      } else {
        SOU([]);
      }
    });
  }, []);

  function send() {
    mysocket.current.emit("message", {
      str: message,
      checkid: mysocket.current.id,
      Usersender: user,
      type: "chatmessage",
    });
    setMessage("");
  }

  return (
    <>
      {OU.length > 0 && (
        <Button
          title="People List"
          //i want to move to screen poeple_list but to pass this screen otherusers
          onPress={() => navigation.navigate("poeple_list")}
        >
          <Text>{OU.length} people connected</Text>
        </Button>
      )}
      <ScrollView style={styles.scrollView} ref={scrollv_ref}>
        {messageList.map((msg, index) => (
          <View key={index}>
            {msg.type == "chatmessage" && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 10,
                  justifyContent:
                    msg.checkid != mysocket.current.id
                      ? "flex-start"
                      : "flex-end",
                }}
              >
                <View>
                  {msg.checkid != mysocket.current.id && (
                    <TextAvatar
                      style={styles.TextAvatar}
                      backgroundColor={colorHash(msg.Usersender.FirstName).hex}
                      textColor={colorHash(msg.Usersender.LastName).hex}
                      size={Platform.OS === "web" ? 60 : 40}
                      type={"circle"}
                    >
                      {msg.Usersender.FirstName + " " + msg.Usersender.LastName}
                    </TextAvatar>
                  )}
                </View>

                <Text
                  style={{
                    width: "70%",
                    color: msg.checkid != mysocket.current.id ? "red" : "green",
                    style: "solid",
                    fontSize: 20,
                    padding: 20,
                    textAlign:
                      msg.checkid != mysocket.current.id ? "left" : "right",
                    backgroundColor:
                      msg.checkid != mysocket.current.id
                        ? "#FF7F7F"
                        : "lightgreen",
                  }}
                >
                  {msg.str}
                </Text>

                <View>
                  {msg.checkid == mysocket.current.id && (
                    <TextAvatar
                      style={styles.TextAvatar}
                      backgroundColor={colorHash(msg.Usersender.FirstName).hex}
                      textColor={colorHash(msg.Usersender.LastName).hex}
                      size={Platform.OS === "web" ? 60 : 40}
                      type={"circle"}
                    >
                      {msg.Usersender.FirstName + " " + msg.Usersender.LastName}
                    </TextAvatar>
                  )}
                </View>
              </View>
            )}
            {(msg.type == "connectUser" || msg.type == "disconnectuser") && (
              <View style={styles.userjoinedleft}>
                <View style={styles.userjoined}>
                  <Text style={styles.userjoinedtext}>{msg.message}</Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomchat}>
        <View style={styles.InputChat}>
          <Input
            placeholder="type here"
            value={message}
            onKeyPress={handleKeyPress}
            onChangeText={setMessage}
            ref={input}
          />
        </View>
        <View>
          <Button
            title="send"
            onPress={() => {
              send();
              input.current.focus();
            }}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    margin: 5,
    borderWidth: 1,
  },
  scrollView: {
    backgroundColor: "lightgray",
    height: "85%",
    width: "100%",
  },
  TextAvatar: {
    margin: 25,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: 290,
  },
  bottomchat: {
    display: "flex",
    flexDirection: "row",
  },
  InputChat: {
    width: "80%",
  },
  userjoined: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    padding: 10,
    backgroundColor: "gray",
    width: "40%",
    borderRadius: 20,
  },
  userjoinedtext: {
    width: "70%",
    color: "black",
    style: "solid",
    fontSize: 20,
    padding: 20,
    textAlign: "center",
  },
  userjoinedleft: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    padding: 10,
  },
});
