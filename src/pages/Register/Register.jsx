import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, ScrollRestoration, useNavigate } from "react-router-dom";
import TermsAndConditionsModal from "./TermsAndConditionsModal";
import useAuth from "../../Hooks/useAuth";
import { Slide, toast } from "react-toastify";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const Register = () => {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const navigate = useNavigate();
  const {
    createUser,
    update,
    notifyError,
    googleSignIn,
    user,
    setUser,
    loader,
  } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const notify = () =>
    toast.success("User created successfully", {
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

  const handleAcceptance = () => {
    setAccepted(true);
    setModalOpen(false);
  };

  const handleDecliance = () => {
    setAccepted(false);
    setModalOpen(false);
  };
  
  const onSubmit = (data) => {
    const { email, password, name, photo } = data;

    createUser(email, password)
      .then( (res) => {
        notify();
        update(name, photo).then(() => {
          setUser({
            ...user,
            displayName: name,
            photoURL: photo,
            email: email,
          });
        });
      })
      .catch((error) => {
        console.error("error", error.message);
        notifyError();
      });
  };

  const handleSocialLogin = (socialProvider) => {
    socialProvider()
      .then(async (res) => {
        const { data } = await axiosSecure.post("/jwt", {
          email: res.user.email,
        });
        notify();
      })
      .catch((error) => {
        console.error(error.message);
        notifyError();
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const validatePassword = (value) => {
    if (value.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[!@#$%^&*()]/.test(value)) {
      return "Password must contain at least one special character: !@#$%^&*()";
    }
    return true;
  };
  
  

  if (user || loader) return;
  return (
    <section className="py-6 flex justify-center items-center mt-4">
     
        <title>StudyNexus | Register</title>
     
      <ScrollRestoration/>
      <TermsAndConditionsModal
        isOpen={modalOpen}
        onDecline={handleDecliance}
        onAccept={handleAcceptance}
      ></TermsAndConditionsModal>

      <div className="max-w-md w-full bg-[#FFE6E6] rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Create an account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label
              htmlFor="photo"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your photo (URL)
            </label>
            <input
              type="text"
              id="photo"
              {...register("photo")}
              className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="https://example.com/your-photo.jpg"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true })}
              className={`bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="name@company.com"
            />
            {errors.email && (
              <span className="text-sm text-red-500">Email is required</span>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password", {
                  required: true,
                  validate: validatePassword,
                })}
                className={`bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10   ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-2"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) => value === password,
                })}
                className={`bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10   ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-2"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-sm text-red-500">
                Please confirm your password
              </span>
            )}
          </div>
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              checked={accepted}
              onClick={() => setAccepted(!accepted)}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
              {...register("terms", { required: true })}
            />
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-light text-gray-500">
                I accept the{" "}
              </label>
              <span
                onClick={() => setModalOpen(true)}
                className="font-medium text-primary-600 hover:underline"
              >
                Terms and Conditions
              </span>
            </div>
          </div>
          {errors.terms && !accepted && (
            <span className="text-sm text-red-500">
              Please accept the Terms and Conditions
            </span>
          )}
          <button
            type="submit"
            className="w-full text-white bg-[#7469B6] hover:bg-blue-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Create an account
          </button>
          <div className="flex items-center pt-4 space-x-1">
            <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
            <p className="px-3 text-sm text-gray-600">
              Login with social accounts
            </p>
            <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              aria-label="Log in with Google"
              className="btn btn-ghost flex items-center gap-2 text-gray-900"
              onClick={() => handleSocialLogin(googleSignIn)}
            >
              <FaGoogle />
              <span className="font-bold">Google</span>
            </button>
          </div>
          <p className="text-xs text-center sm:px-6 text-gray-500">
            Don't have an account?{" "}
            <Link
              to={"/login"}
              className="font-medium text-primary-600 hover:underline hover:text-blue-400"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
