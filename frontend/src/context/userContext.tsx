import { createContext, Dispatch, SetStateAction } from "react";

export type UserContextType = {
  isLoggedIn: boolean;
  setisLoggedIn: Dispatch<SetStateAction<boolean>>;
  username: string;
  setusername: Dispatch<SetStateAction<string>>;
  email: string;
  setemail: Dispatch<SetStateAction<string>>;
  password: string;
  setpassword: Dispatch<SetStateAction<string>>;
};

export const userContext = createContext<UserContextType | undefined>(
  undefined
);
