import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form"; 
import getAxiosClient from "../axios-instance";

export default function Todos() {
  // 47. Create ref for the modal dialog element
  const modalRef = useRef();

   // React Query client to invalidate queries later (need for refetching)
  const queryClient = useQueryClient();

  // React query mutation to create a new todo on the server
  const { mutate: createNewTodo } = useMutation({
    mutationKey: ["newTodo"],
    mutationFn: async (newTodo) => {
      const axiosInstance = await getAxiosClient();
      const { data } = await axiosInstance.post("http://localhost:8080/todos", newTodo);
      return data;
    },
    onSuccess: () => {
      // Refetch todos after successfully creating a new one
      queryClient.invalidateQueries(["todos"]);
    }
  });

  // 63. useQuery hook to fetch todos from server
  const { data, isError, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const axiosInstance = await getAxiosClient();
      const { data } = await axiosInstance.get("http://localhost:8080/todos");
      return data;
    }
  });

  // 49. Function to toggle the modal open/close
  const toggleNewTodoModal = () => {
    if (modalRef.current.open) {
      modalRef.current.close();
    } else {
      modalRef.current.showModal();
    }
  };

  // 51. Set up react-hook-form
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      description: ""
    }
  });

  // 54. Placeholder submit handler — just closes modal for now
  const handleNewTodo = (values) => {
    console.log("Form submitted with:", values);  // debug log
    createNewTodo(values);
    toggleNewTodoModal();
  };

    // 64. Conditional rendering for loading and error states
  if (isLoading) {
    return <div>Loading Todos...</div>;
  }
  if (isError) {
    return <div>There was an error</div>;
  }

  // 44. Button to open the modal
  function NewTodoButton() {
    return (
      <button className="btn btn-primary" onClick={toggleNewTodoModal}>
        New Todo
      </button>
    );
  }

  // 46. Modal with the form and inputs registered with react-hook-form
  function TodoModal() {
    return (
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">New Todo</h3>
          {/* 55. Add onSubmit handler with handleSubmit wrapping handleNewTodo */}
          <form onSubmit={handleSubmit(handleNewTodo)}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name of Todo</span>
              </div>
              {/* 52. Register input "name" */}
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                {...register("name")}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              {/* 53. Register input "description" */}
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                {...register("description")}
              />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create Todo
              </button>
              <button
                type="button"
                onClick={toggleNewTodoModal}
                className="btn btn-ghost"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }

  // 65 & 67 Component to display the list of todo items
  function TodoItemList() {
    return (
      <div className="w-lg h-sm flex column items-center justify-center gap-4">
        {data.success && data.todos && data.todos.length >= 1 ? (
          <ul className="flex column items-center justify-center gap-4">
            {data.todos.map((todo) => (
              <li key={todo.id} className="inline-flex items-center gap-4">
                <div className="w-md">
                  <h3 className="text-lg">{todo.name}</h3>
                  <p className="text-sm">{todo.description}</p>
                </div>
                <div className="w-md">
                  <label className="swap">
                    <input type="checkbox" onClick={() => markAsCompleted(todo.id)} />
                    <div className="swap-on">Yes</div>
                    <div className="swap-off">No</div>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No todos found. Create one!</p>
        )}
      </div>
    );
  }

  // Render the button, list, and modal
  return (
    <>
      <NewTodoButton />
      <TodoItemList />
      <TodoModal />
    </>
  );
}

// Placeholder for marking todo as completed (no frontend functionality yet)
function markAsCompleted(id) {
  console.log(`Mark todo ${id} as completed (functionality coming soon)`);
}
