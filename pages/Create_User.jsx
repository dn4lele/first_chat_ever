import { StyleSheet } from "react-native";
import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Input } from "@rneui/base";
import { faker } from "@faker-js/faker";
import TextAvatar from "react-native-text-avatar";
import { useUser, useSetUser, UserProvider } from "../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colorHash from "../utils/hashcolor";

export default function Create_User({ navigation }) {
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
        navigation.navigate("secound_screen");
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
    };
    setUser(newuser);

    storeData(newuser);

    setName("");
    setLastName("");
    setAge("");
    setGender("");
    setEmail("");

    alert("User was created");
    navigation.navigate("secound_screen");
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
