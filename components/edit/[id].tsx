import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import Header from "../Header";
import "react-toastify/dist/ReactToastify.min.css";
import Link from "next/link";
import { fetchTodoByIdApi, updateTodoApi } from "../../helperFunctions/apiHelper";
import { createTodo } from "../../helperFunctions/interfaceHelper";
import ToastConfig from "../../helperFunctions/toastConfig";
import {handleEditOnChange} from '../../helperFunctions/inputChangeHelper'

const Edit = () => {
  const router = useRouter();
  const { id }= router.query;
  const [todo, setTodo] = useState<createTodo>({ title: "", description: "" });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        if (router.isReady && id) {
          let todoId: number | null = null;
  
          // Check if id is an array
          if (Array.isArray(id)) {
            // Assuming you only expect one ID value, access the first element
            todoId = parseInt(id[0], 10);
          } else {
            // Otherwise, parse id as a number
            todoId = parseInt(id as string, 10);
          }
  
          if (!isNaN(todoId)) {
            const todoData = await fetchTodoByIdApi(todoId);
            setTodo(todoData);
            setLoading(false);
          } else {
            // Handle the case where todoId is NaN (Not a Number)
            setLoading(false);
            toast("Invalid ID");
          }
        }
      } catch (error) {
        toast("Oops Something Went Wrong...!");
        setLoading(false);
      }
    })();
  }, [router.isReady, id]);

  const updateTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let todoId: number | null = null;
  
      // Check if id is an array
      if (Array.isArray(id)) {
        // Assuming you only expect one ID value, access the first element
        todoId = parseInt(id[0], 10);
      } else {
        // Otherwise, parse id as a number
        todoId = parseInt(id as string, 10);
      }
  
      if (!isNaN(todoId)) {
        await updateTodoApi(todo, todoId);
        toast("Todo Updated Successfully...!");
         // router.push("/view");
      } else {
        // Handle the case where todoId is NaN (Not a Number)
        toast("Invalid ID");
      }
    } catch (error:any) { 
      if (error.response && error.response.status === 403) {
        toast(error.response.data.message);
      } else {
        toast("Oops, Something Went Wrong!");
      }
    }
    finally{
      router.push("/view");
    }
  };
  

  return (
    <>
      <Header />
      <div className="my-2 text-3xl">
        {loading ? (
          <div>loading...</div>
        ) : (
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
              <div className="bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
                  Update a Todo
                </h2>
                <div className="relative mb-4">
                  <label
                    htmlFor="title"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Update Todo Title
                  </label>
                  <input
                    onChange={handleEditOnChange(setTodo)}
                    value={todo.title}
                    type="text"
                    id="title"
                    name="title"
                    className="w-full bg-white rounded border border-gray-300 text-base text-gray-700 py-1 px-3"
                  />
                </div>
                <div className="relative mb-4">
                  <label
                    htmlFor="desc"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Update Todo Description
                  </label>
                  <input
                    onChange={handleEditOnChange(setTodo)}
                    value={todo.description}
                    type="text"
                    id="desc"
                    name="description"
                    className="w-full bg-white rounded border border-gray-300 text-base text-gray-700 py-1 px-3"
                  />
                </div>
                <button
                  onClick={updateTodo}
                  className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none w-fit hover:bg-indigo-600 rounded text-lg"
                >
                  Update Todo
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
      <ToastConfig/>
    </>
  );
};

export default Edit;
