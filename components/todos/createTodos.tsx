import { createTodoApi } from "../../helperFunctions/apiHelper";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import ToastConfig from '../../helperFunctions/toastConfig'
import withAuth from "../../utils/withAuth";
import Header from "../Header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {createTodo} from '../../helperFunctions/interfaceHelper'
import {handleCreateChange} from '../../helperFunctions/inputChangeHelper'


const CreateTodos: React.FC = () => {
  // createTodo -> Interface of Todo(generics Type)
  const [addTodo, setTodo] = useState<createTodo>({
    title: "",
    description: "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTodoApi,
    onSuccess: () => {
      // On success, invalidate 'todos' queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTodo({ title: "", description: "" });
      toast("Todo Added SuccessFully...!")
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Validation check
    if (!addTodo.title || !addTodo.description) {
      toast("Title and Description cannot be empty!");
      return;
    }

    // Trigger the mutation with the new todo data
    mutation.mutate(addTodo);
  };

  return (
    <>
      <Header />
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-20 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Add Todo
            </h1>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                    Title
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="title"
                    value={addTodo.title}
                    onChange={(e) => handleCreateChange(e, setTodo, addTodo)}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="message" className="leading-7 text-sm text-gray-600">
                    Description
                  </label>
                  <textarea
                    id="message"
                    name="description"
                    onChange={(e) => handleCreateChange(e, setTodo, addTodo)}
                    value={addTodo.description}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  onClick={handleSubmit}
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                  Add Todo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastConfig/>
    </>
  );
};

// export default CreateTodos;
export default withAuth(CreateTodos);