import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function Todos() {
  // 47. Create ref for the modal dialog element
  const modalRef = useRef();

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
    toggleNewTodoModal();
  };

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

  // Render the button and modal
  return (
    <>
      <NewTodoButton />
      <TodoModal />
    </>
  );
}
