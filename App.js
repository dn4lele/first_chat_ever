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
  const users = useUser();
  const setUsers = useSetUser();

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

  function submit_user() {
    const newuser = {
      FirstName: name,
      LastName: lastName,
      Age: age,
      Gender: gender,
      Email: email,
      id: socket.id,
    };
    setUsers([...users, newuser]);

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
      <View style={styles.button}>
        <Button title="Submit User" onPress={() => submit_user()} />
        <Button title="Give faker data" onPress={() => give_faker_data()} />
      </View>
    </View>
  );
}

function chatScreen({ navigation }) {
  const user = useUser();
  const setUser = useSetUser();

  const [message, setMessage] = useState("");
  const [messageList, setmessageList] = useState([]);

  socket.on("message", (msg) => {
    setmessageList([...messageList, msg]);
  });

  console.log(user);
  console.log(messageList);
  return (
    <>
      <ScrollView style={styles.scrollView}>
        {messageList.map((msg, index) => (
          <Text
            key={index}
            style={{
              color: msg.checkid != socket.id ? "red" : "green",
              style: "solid",
              width: "100%",
              fontSize: 20,
              padding: 10,
              textAlign: msg.checkid != socket.id ? "left" : "right",
              backgroundColor:
                msg.checkid != socket.id ? "#FF7F7F" : "lightgreen",
            }}
          >
            {msg.str}
          </Text>
        ))}
      </ScrollView>

      <View>
        <Input
          placeholder="type here"
          value={message}
          onChangeText={setMessage}
        />
        <Button
          title="send"
          onPress={() => {
            socket.emit("message", {
              str: message,
              checkid: socket.id,
            });
            setMessage("");
          }}
        />
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
          <Stack.Screen
            name="create_user"
            component={Create_User}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="chatScreen"
            component={chatScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "80%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  scrollView: {
    backgroundColor: "lightgray",
    height: "85%",
    width: "100%",
  },
  TextAvatar: {
    margin: 25,
  },
  detailContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
});
