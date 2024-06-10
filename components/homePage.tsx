import React, { useContext } from "react";
import { UserContext } from "../utils/userContext";

const HomePage = () => {
  const { user, setUser } = useContext(UserContext);
  const { authenticated, setAuthenticated } = useContext(UserContext);
  // console.log(user);
  // console.log(isLogin);
  return (
    <>
      <div>
        {user && authenticated ? (
          <h1>Welcome, {user}!, Finish Your Today's task...!</h1>
        ) : (
          <h1>Welcome Guest, Please Login to View Today's Task...!</h1>
        )}
      </div>
      
    </>
  );
};

export default HomePage;