import React from "react";
import ViewTodos from "../components/todos/viewTodos";
import { UserProvider } from "../utils/userContext";
const View = () => {
  return (
    <div>
      <UserProvider>
        <ViewTodos />
      </UserProvider>
    </div>
  );
};

export default View;