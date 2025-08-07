import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form"; 
import axios from "axios";
import supabase from "../client";

export default function Todos() {
  // 47. Create ref for the modal dialog element
  const modalRef = useRef();

  // React Query client to invalidate queries later (used to refresh todos after mutation)
  const queryClient = useQueryClient();

  // 60. Mutation: Create a new todo using Supabase-authenticated request
  const { mutate: createNewTodo } = useMutation({
    mutationKey: ["newTodo"],
    mutationFn: async (newTodo) => {
      // 1. Get access token from Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      console.log("Access token inside mutationFn:", token); // Debug

      if (!token) throw new Error("No access token found.");

      // 2. Create axios instance with token in Authorization header
      const axiosInstance = axios.create({
        baseURL: "http://localhost:8080",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 3. Send new todo to backend
      const { data } = await axiosInstance.post("/todos", newTodo);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]); // Refresh list after creating
    }
  });

  // 61. Mutation: Mark a todo as completed using Supabase-authenticated request
  const { mutate: markAsCompleted } = useMutation({
    mutationKey: ["markAsCompleted"],
    mutationFn: async (todoId) => {
      // 1. Get Supabase token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      console.log("Access token inside markAsCompleted:", token); // Debug

      if (!token) throw new Error("No access token found.");

      // 2. Authenticated axios call
      const axiosInstance = axios.create({
        baseURL: "http://localhost:8080",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 3. Send update to backend
      const { data } = await axiosInstance.put(`/todos/${todoId}/completed`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]); // Refresh list after marking complete
    }
  });

  // 63. useQuery hook to fetch todos from the backend
  const { data, isError, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      console.log("Access token inside queryFn:", token); // Debug

      if (!token) throw new Error("No access token found.");

      const axiosInstance = axios.create({
        baseURL: "http://localhost:8080",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = await axiosInstance.get("/todos");
      return data;
    }
  });

  // 49. Toggle modal visibility using a ref
  const toggleNewTodoModal = () => {
    if (modalRef.current.open) {
      modalRef.current.close();
    } else {
      modalRef.current.showModal();
    }
  };

  // 51. Set up react-hook-form for form handling
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      description: ""
    }
  });

  // 54. Handle form submission and create todo
  const handleNewTodo = (values) => {
    console.log("Form submitted with:", values); // Debug
    createNewTodo(values);
    reset(); // Clear form after submit
    toggleNewTodoModal(); // Close modal
  };

  // 64. Show loading or error state if needed
  if (isLoading) return <div className="text-center p-4">Loading Todos...</div>;
  if (isError) return <div className="text-center text-red-600 p-4">Error loading todos.</div>;

  // 44. Button to open the new todo modal
  function NewTodoButton() {
    return (
      <div className="flex justify-center my-6">
        <button className="btn btn-primary" onClick={toggleNewTodoModal}>
          + New Todo
        </button>
      </div>
    );
  }

  // 46. Modal with form for creating a new todo
  function TodoModal() {
    return (
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">New Todo</h3>
          <form onSubmit={handleSubmit(handleNewTodo)} className="space-y-4">
            {/* Todo Name */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name of Todo</span>
              </div>
              <input
                type="text"
                placeholder="Type name here"
                className="input input-bordered w-full"
                {...register("name", { required: true })}
              />
            </label>

            {/* Todo Description */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <input
                type="text"
                placeholder="Type description here"
                className="input input-bordered w-full"
                {...register("description")}
              />
            </label>

            {/* Modal Actions */}
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create Todo
              </button>
              <button
                type="button"
                onClick={toggleNewTodoModal}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }

  // 65. Renders list of todos with spacing, styling, and completed label
  function TodoItemList() {
    return (
      <div className="max-w-3xl mx-auto px-4">
        {data.success && data.todos && data.todos.length > 0 ? (
          <ul className="flex flex-col gap-6">
            {data.todos.map((todo) => (
              <li
                key={todo.id}
                className="p-4 bg-white rounded-lg shadow-md border border-gray-200 flex justify-between items-start"
              >
                {/* Left: Name + Description */}
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${todo.completed ? "line-through text-gray-400" : ""}`}>
                    {todo.name}
                  </h3>
                  <p className={`mt-1 text-sm ${todo.completed ? "text-gray-400 italic" : "text-gray-600"}`}>
                    {todo.description || "No description provided."}
                  </p>
                </div>

                {/* Right: Complete checkbox */}
                <div className="ml-4 pt-2">
                  {!todo.completed ? (
                    <input
                      type="checkbox"
                      className="checkbox checkbox-success"
                      onChange={() => markAsCompleted(todo.id)}
                      title="Mark as completed"
                    />
                  ) : (
                    <span className="text-xs text-green-600 font-medium">Completed</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-8">No todos yet. Create one!</p>
        )}
      </div>
    );
  }

  // 66. Render page with button, list, and modal
  return (
    <>
      <NewTodoButton />
      <TodoItemList />
      <TodoModal />
    </>
  );
}
