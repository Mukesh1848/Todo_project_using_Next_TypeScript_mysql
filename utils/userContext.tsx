import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import axios, { AxiosResponse } from "axios";
import { getToken } from "../helperFunctions/localStorageHelper";

interface UserContextType {
  user: string | null;
  setUser: Dispatch<SetStateAction<string | null>>;
  authenticated: boolean;
  setAuthenticated: Dispatch<SetStateAction<boolean>>;
}

const initialUserContext: UserContextType = {
  user: "",
  setUser: () => {},
  authenticated: false,
  setAuthenticated: () => {},
};

export const UserContext = createContext<UserContextType>(initialUserContext);

interface UserProviderProps {
  children: ReactNode;
}

// <{ userName: string }>
const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);


  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (token) {
        try {
          const response:AxiosResponse<any> = await axios.get("/api/getUserName", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.userName);
          setAuthenticated(true);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          //please Handle error (e.g., remove invalid token, redirect to login)
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, authenticated, setAuthenticated }}>
     {children}
    </UserContext.Provider>

    
  );
};

export { UserProvider };


