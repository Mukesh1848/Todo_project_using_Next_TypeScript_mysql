import React from "react";
import CreateTodos from "../components/todos/createTodos";
import { UserProvider } from "../utils/userContext";

const Create = () => {
  return (
    <>
       <UserProvider>
        <CreateTodos />
       </UserProvider>
    </>
  );
};

export default Create;