import React from "react";
import Edit from "../../components/edit/[id]";
import { UserProvider } from "../../utils/userContext";

const Id = () => {
  return (
    <div>
      <UserProvider>
        <Edit />
      </UserProvider>
    </div>
  );
};

export default Id;