import { ChangeEvent, Dispatch, SetStateAction } from "react";
import {  createTodo} from "./interfaceHelper";
import { SelectChangeEvent } from "@mui/material/Select";

export const handleCreateChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setTodo: Dispatch<SetStateAction<createTodo>>,
  addTodo: createTodo
) => {
  const value = e.target.value;
  setTodo({ ...addTodo, [e.target.name]: value });
};

type SetTodo = React.Dispatch<React.SetStateAction<createTodo>>;

export const handleEditOnChange = (setTodo: SetTodo) => (e: React.ChangeEvent<HTMLInputElement>) => {
  setTodo((prevTodo) => ({
    ...prevTodo,
    [e.target.name]: e.target.value,
  }));
};


export const handleChangeSelectedUserIds = (
  event: SelectChangeEvent<number[]>,
  setSelectedUserIds: (value: number[]) => void
) => {
  const {
    target: { value },
  } = event;
  setSelectedUserIds(typeof value === "string" ? value.split(",").map(Number) : value);
};

export const handleChangePermissions = (
  event: SelectChangeEvent<string[]>,
  setPermissions: (value: string[]) => void
) => {
  const {
    target: { value },
  } = event;
  setPermissions(typeof value === "string" ? value.split(",") : value);
};


export const handleUsernameChange = (
  setUsername: React.Dispatch<React.SetStateAction<string>>
) => (e: ChangeEvent<HTMLInputElement>) => {
  setUsername(e.target.value);
};

export const handleEmailChange = (
  setEmail: React.Dispatch<React.SetStateAction<string>>
) => (e: ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value);
};

export const handlePasswordChange = (
  setPassword: React.Dispatch<React.SetStateAction<string>>
) => (e: ChangeEvent<HTMLInputElement>) => {
  setPassword(e.target.value);
};

