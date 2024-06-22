import React from 'react';
import useAuth from '../../Hooks/useAuth';
import { useForm } from 'react-hook-form';
import { Slide, toast } from 'react-toastify';


const myProfile = () => {
    const { user, setUser, update, notifyError } = useAuth();

  const {
    register,
    handleSubmit,
  } = useForm();

  const notify = () =>
    toast.success("Update success!!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });

  const onSubmit = (data) => {
    const { name, photo } = data;
    if (!/^(?=.*[a-zA-Z])[a-zA-Z\s]+$/.test(name)) {
      return notifyError("Give a valid name");
    }
    
    update(name, photo)
      .then( () => {
        setUser({ ...user, displayName: name, photoURL: photo });
        notify();
      }
      )
      .catch((error) => {
        console.error("error", error.message);
        notifyError();
      });
  };
    return (
        <div className="flex justify-center items-center mt-16">
           <div className="w-full max-w-sm overflow-hidden rounded-lg shadow-lg bg-[#FFE6E6] text-gray-900 mx-auto">
            <div className="p-3 bg-gray-100">
            <img
                className="object-cover object-top w-full h-56"
                src={user?.photoURL}
                alt="avatar"
            />
            </div>
            <div className="px-6 py-4">
                <h1 className="text-xl font-semibold pb-2 capitalize">{user?.displayName}</h1>
                <div className="flex items-center mt-4">
                    <svg
                        aria-label="email icon"
                        className="w-6 h-6 fill-current"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.00977 5.83789C3.00977 5.28561 3.45748 4.83789 4.00977 4.83789H20C20.5523 4.83789 21 5.28561 21 5.83789V17.1621C21 18.2667 20.1046 19.1621 19 19.1621H5C3.89543 19.1621 3 18.2667 3 17.1621V6.16211C3 6.11449 3.00333 6.06765 3.00977 6.0218V5.83789ZM5 8.06165V17.1621H19V8.06199L14.1215 12.9405C12.9499 14.1121 11.0504 14.1121 9.87885 12.9405L5 8.06165ZM6.57232 6.80554H17.428L12.7073 11.5263C12.3168 11.9168 11.6836 11.9168 11.2931 11.5263L6.57232 6.80554Z"
                        />
                    </svg>
                    <h1 className="px-2 text-sm">{user?.email}</h1>
                </div>
                <div className="mt-5">
          <button
            className="btn  btn-success"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Edit Info
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm">
                    Your name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="Name"
                    defaultValue={user?.displayName}
                    className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
                    {...register("name")}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="photo" className="block text-sm">
                    Your picture
                  </label>
                  <input
                    type="text"
                    name="photo"
                    id="photo"
                    defaultValue={user?.photoURL}
                    className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
                    {...register("photo")}
                  />
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn">
                    Update
                  </button>
                </div>
              </form>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
            </div>
        </div> 
        </div>
    );
};

export default myProfile;

