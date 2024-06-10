import { NextApiRequest } from 'next';

export interface createTodo{
        title: string;
        description:string;
}

 export interface viewTodo {
        id: number;
        title: string;
        description: string;
}
      
export interface User {
        id: number;
        userName: string;
}

export interface UserData {
        userName?: string;
        email: string;
        password: string;
}
      
export interface ApiResponse {
        token: string;
        [key: string]: any;
}

      
export interface User {
  id: number;
}

export interface AuthenticatedRequest extends NextApiRequest {
  user: User;
}
