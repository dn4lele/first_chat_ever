import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Input } from "@rneui/base";
import socket from "./utils/socket";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { faker } from "@faker-js/faker";
import TextAvatar from "react-native-text-avatar";
import { useUser, useSetUser, UserProvider } from "./contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

function colorHash(inputString) {
  var sum = 0;

  for (var i in inputString) {
    sum += inputString.charCodeAt(i);
  }

  r = ~~(
    ("0." +
      Math.sin(sum + 1)
        .toString()
        .substr(6)) *
    256
  );
  g = ~~(
    ("0." +
      Math.sin(sum + 2)
        .toString()
        .substr(6)) *
    256
  );
  b = ~~(
    ("0." +
      Math.sin(sum + 3)
        .toString()
        .substr(6)) *
    256
  );

  var rgb = "rgb(" + r + ", " + g + ", " + b + ")";

  var hex = "#";

  hex += ("00" + r.toString(16)).substr(-2, 2).toUpperCase();
  hex += ("00" + g.toString(18)).substr(-2, 2).toUpperCase();
  hex += ("00" + b.toString(20)).substr(-2, 2).toUpperCase();

  return {
    r: r,
    g: g,
    b: b,
    rgb: rgb,
    hex: hex,
  };
}

function Create_User({ navigation }) {
  const user = useUser();
  const setUser = useSetUser();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("Person_value");

      if (value !== null) {
        setUser(JSON.parse(value));
        navigation.navigate("chatScreen");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");

  function give_faker_data() {
    setName(faker.person.firstName());
    setLastName(faker.person.lastName());
    setAge("" + Math.floor(Math.random() * 100));
    setGender(faker.person.sexType());
    setEmail(faker.internet.email());
  }

  const storeData = async (person) => {
    try {
      const jsonValue = JSON.stringify(person);
      await AsyncStorage.setItem("Person_value", jsonValue);
    } catch (e) {}
  };

  function submit_user() {
    const newuser = {
      FirstName: name,
      LastName: lastName,
      Age: age,
      Gender: gender,
      Email: email,
      id: socket.id,
    };
    setUser(newuser);

    storeData(newuser);

    setName("");
    setLastName("");
    setAge("");
    setGender("");
    setEmail("");

    alert("User was created");
    navigation.navigate("chatScreen");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Create User</Text>

      <TextAvatar
        style={styles.TextAvatar}
        backgroundColor={colorHash(name).hex}
        textColor={colorHash(lastName).hex}
        size={60}
        type={"circle"}
      >
        {name + " " + lastName}
      </TextAvatar>

      <View style={styles.inputs}>
        <Input
          style={styles.input}
          placeholder="FirstName"
          value={name}
          onChangeText={setName}
        />
        <Input
          style={styles.input}
          placeholder="LastName"
          value={lastName}
          onChangeText={setLastName}
        />
        <Input
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
        />
        <Input
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
        />
        <Input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.button}>
        <Button title="Submit User" onPress={() => submit_user()} />
        <Button title="Give faker data" onPress={() => give_faker_data()} />
      </View>
    </View>
  );
}

function ChatScreen({ navigation }) {
  const user = useUser();
  const setUser = useSetUser();

  const [message, setMessage] = useState("");
  const [messageList, setmessageList] = useState([]);

  socket.on("message", (msg) => {
    setmessageList([...messageList, msg]);
  });

  return (
    <>
      <ScrollView style={styles.scrollView}>
        {messageList.map((msg, index) => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              padding: 10,
              justifyContent:
                msg.checkid != socket.id ? "flex-start" : "flex-end",
            }}
          >
            <View>
              {msg.checkid != socket.id && (
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
              key={index}
              style={{
                width: "70%",
                color: msg.checkid != socket.id ? "red" : "green",
                style: "solid",
                fontSize: 20,
                padding: 20,
                textAlign: msg.checkid != socket.id ? "left" : "right",
                backgroundColor:
                  msg.checkid != socket.id ? "#FF7F7F" : "lightgreen",
              }}
            >
              {msg.str}
            </Text>

            <View>
              {msg.checkid == socket.id && (
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
        ))}
      </ScrollView>
      <View style={styles.bottomchat}>
        <View style={styles.InputChat}>
          <Input
            placeholder="type here"
            value={message}
            onChangeText={setMessage}
          />
        </View>
        <View>
          <Button
            title="send"
            onPress={() => {
              socket.emit("message", {
                str: message,
                checkid: socket.id,
                Usersender: user,
              });
              setMessage("");
            }}
          />
        </View>
      </View>
    </>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="create_user" component={Create_User} />
          <Stack.Screen name="chatScreen" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
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
});
