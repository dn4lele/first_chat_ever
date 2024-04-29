import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useUser, useSetUser, UserProvider } from "./contexts/UserContext";
import {
  useOtherUsers,
  useSetOtherUsers,
  OtherUsersProvider,
} from "./contexts/OtherUsersContext";
import Chat_screen from "./pages/Chat_screen";
import Create_User from "./pages/Create_User";
import Poeple_list from "./pages/poeple_list";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Secound_screen() {
  return (
    <Drawer.Navigator initialRouteName="chat_screen">
      <Drawer.Screen name="chat_screen" component={Chat_screen} />
      <Drawer.Screen name="poeple_list" component={Poeple_list} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <>
      <OtherUsersProvider>
        <UserProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="create_user">
              <Stack.Screen name="create_user" component={Create_User} />
              <Stack.Screen
                name="secound_screen"
                component={Secound_screen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </UserProvider>
      </OtherUsersProvider>
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
});
