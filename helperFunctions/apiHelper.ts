import axios, { AxiosResponse } from "axios";
import { getToken } from "./localStorageHelper";
import { useQuery } from "@tanstack/react-query";
import { createTodo } from "./interfaceHelper";
import { UserData,ApiResponse } from "./interfaceHelper";

const baseUrl = "http://localhost:3000/api";

export const registerUser = async (userData: UserData): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(`${baseUrl}/user/register`, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "An error occurred");
  }
};


export const loginUser = async (userData: UserData): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(`${baseUrl}/user/login`, userData);

    // Ensure that the token is a string
    if (typeof response.data.token !== 'string') {
      throw new Error("Invalid token in response");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "An error occurred");
  }
};


export const createTodoApi = async (todo: createTodo): Promise<any> => {
  const token = getToken();
  if (!token) return;
  
  try {
    const response: AxiosResponse<any> = await axios.post(`${baseUrl}/create`, todo, 
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
    console.log(response);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTodosApi = async (): Promise<any[]> => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response: AxiosResponse<any[]> = await axios.get(`${baseUrl}/todo`,
     {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
  return response.data;
};

export const useTodos = () => {
  return useQuery({ queryKey: ["todos"], queryFn: fetchTodosApi });
};

export const deleteTodoApi = async (id: number): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  await axios.delete(`${baseUrl}/delete`, {
    data: { id },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchTodoByIdApi = async (id: number): Promise<any> => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response: AxiosResponse<any[]> = await axios.get(`${baseUrl}/todo/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data[0];
};

export const updateTodoApi = async (todo: any, id: number): Promise<AxiosResponse<any>> => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response: AxiosResponse<any> = await axios.put(
    `${baseUrl}/update`,
    { todo, id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const shareTodoApi = async (todoId: number, userIds: number[], permissions: any): Promise<any> => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response: AxiosResponse<any> = await axios.post(
    `${baseUrl}/shareTodo`,
    {
      todoId,
      userIds,
      permissions,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);
  return response.data;
};

export const removePermissionsApi = async (todoId: number, userIds: number[], permissions: any): Promise<any> => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response: AxiosResponse<any> = await axios.post(
    `${baseUrl}/removePermissions`,
    {
      todoId,
      userIds,
      permissions,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);
  return response.data;
};

export const showUserNameApi = async (): Promise<any> => {

  const token = getToken();
  if (!token) throw new Error("No token found");

  const response: AxiosResponse<any> = await axios.get(`${baseUrl}/showUserName`,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};