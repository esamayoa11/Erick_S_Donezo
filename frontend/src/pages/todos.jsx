import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function Todos() {
  const modalRef = useRef();

  const toggleNewTodoModal = () => {
    if (modalRef.current.open) {
      modalRef.current.close();
    } else {
      modalRef.current.showModal();
    }
  };

  // Child components inside Todos to access modalRef and toggle handler
  function NewTodoButton() {
    return (
      <button className="btn btn-primary" onClick={toggleNewTodoModal}>
        New Todo
      </button>
    );
  }

  function TodoModal() {
    return (
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">New Todo</h3>
          <form>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name of Todo</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create Todo
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={toggleNewTodoModal}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }

  return (
    <>
      <NewTodoButton />
      <TodoModal />
    </>
  );
}
