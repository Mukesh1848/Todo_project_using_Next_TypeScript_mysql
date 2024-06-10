import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { registerUser } from "../../helperFunctions/apiHelper";
import { useMutation } from "@tanstack/react-query";
import ToastConfig from '../../helperFunctions/toastConfig'
import {handleUsernameChange,handleEmailChange,handlePasswordChange} from '../../helperFunctions/inputChangeHelper'

const UserRegister: React.FC = () => {
  const router = useRouter();
  const [userName, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setUsername("");
      setEmail("");
      setPassword("");
      toast("User Registered Successfully!");
      // setTimeout(() => {
        router.push("/auth/login");
      // }, 1500);
    },
    onError: (err: any) => {
      toast(err.message || "An error occurred");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ userName, email, password });
  };


  return (
    <div>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-20 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Register Here..
            </h1>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="userName" className="leading-7 text-sm text-gray-600">
                    UserName
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={userName}
                    onChange={handleUsernameChange(setUsername)}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange(setEmail)}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="password" className="leading-7 text-sm text-gray-600">
                    Password
                  </label>
                  <input
                    // type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange(setPassword)}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  type="submit"
                  className="flex mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
                >
                  Register
                </button>
                <p className="font-bold text-center">
                  Already have an Account &nbsp;
                  <Link href="/auth/login" className="underline text-blue-600">
                    Login Here..
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
      <ToastConfig/>
    </div>
  );
};

export default UserRegister;
