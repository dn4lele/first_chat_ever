import { createContext, useContext, useState } from "react";

const otherUsersContext = createContext();
const SetOtherUserContext = createContext();

export function useOtherUsers() {
  return useContext(otherUsersContext);
}

export function useSetOtherUsers() {
  return useContext(SetOtherUserContext);
}

export function OtherUsersProvider({ children }) {
  const [otherUsers, setOtherUser] = useState([]);

  return (
    <otherUsersContext.Provider value={otherUsers}>
      <SetOtherUserContext.Provider value={setOtherUser}>
        {children}
      </SetOtherUserContext.Provider>
    </otherUsersContext.Provider>
  );
}
