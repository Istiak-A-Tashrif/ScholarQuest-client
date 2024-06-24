import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, ScrollRestoration, useNavigate } from "react-router-dom";
import TermsAndConditionsModal from "./TermsAndConditionsModal";
import useAuth from "../../Hooks/useAuth";
import { Slide, toast } from "react-toastify";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";
import axios from "axios";

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const navigate = useNavigate();
  const { createUser, update, notifyError, googleSignIn, user, setUser, loader } = useAuth();
  const axiosSecure = useAxiosSecure();
  const imghosting = import.meta.env.VITE_IMG;
  const imgUpload = `https://api.imgbb.com/1/upload?key=${imghosting}`;

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const notify = () => toast.success("User created successfully", {
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

  const handleDecline = () => {
    setAccepted(false);
    setModalOpen(false);
  };

  const onSubmit = async (data) => {
    const { email, password, name, photo } = data;

    try {
      const imgFile = new FormData();
      imgFile.append('image', photo[0]);

      const imgRes = await axios.post(imgUpload, imgFile);
      const photoURL = imgRes.data.data.url;

      const userCredential = await createUser(email, password);
      const { data } = await axiosSecure.post("/jwt", {
        email: email,
      });

      localStorage.setItem('token', data.token);
      await update(name, photoURL);
      
      const newUser = {
        displayName: name,
        photoURL: photoURL,
        email: email,
      };

      setUser(newUser);

      // Save user info to database
      await axiosSecure.post('/registerUser', {
        email: newUser.email,
        name: newUser.displayName,
        photo: newUser.photoURL,
      });

      notify();
    } catch (error) {
      console.error("Error:", error.message);
      notifyError();
    }
  };

  const handleSocialLogin = async (socialProvider) => {
    try {
      const res = await socialProvider(); // Assuming socialProvider handles social login
      const user = res.user;
  
      // Send user email to get JWT token (assuming axiosSecure handles secure requests)
      const { data } = await axiosSecure.post("/jwt", {
        email: res.user.email,
      });

      localStorage.setItem('token', data.token)
  
      // Register user if not already registered
      await axios.post(`${import.meta.env.VITE_URL}/registerUser`, {
        email: user.email,
        name: user.displayName,
        photo: user.photoURL || 'https://static.vecteezy.com/system/resources/thumbnails/005/129/844/sm...',
      });
  
      notify(); // Notify user about successful registration
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("User with this email already exists.");
        notify();
      } else {
        console.error('Error:', error.message);
        notifyError(); // Notify user about the error
      }
    }
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

  if (user || loader) return null;

  return (
    <section className="py-6 flex justify-center items-center mt-4">
      <ScrollRestoration />
      <TermsAndConditionsModal
        isOpen={modalOpen}
        onDecline={handleDecline}
        onAccept={handleAcceptance}
      ></TermsAndConditionsModal>

      <div className="max-w-md w-full bg-[#FFE6E6] rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Create an account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Your name</label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="photo" className="block mb-2 text-sm font-medium text-gray-900">Your photo</label>
            <input
              type="file"
              id="photo"
              {...register("photo")}
              className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true })}
              className={`bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.email ? "border-red-500" : ""}`}
              placeholder="name@company.com"
            />
            {errors.email && (
              <span className="text-sm text-red-500">Email is required</span>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password", { required: true, validate: validatePassword })}
                className={`bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 ${errors.password ? "border-red-500" : ""}`}
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
            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                {...register("confirmPassword", { required: true, validate: (value) => value === password })}
                className={`bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
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
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-500">
              I accept the{" "}
              <span
                className="font-bold text-gray-600 hover:underline"
                onClick={() => setModalOpen(true)}
              >
                Terms and Conditions
              </span>
            </label>
          </div>
          <button
            type="submit"
            className={`w-full text-white bg-[#7469B6] hover:bg-blue-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center ${!accepted ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!accepted}
          >
            Create an account
          </button>
        </form>
        <p className="text-sm font-light text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary-600 hover:underline">
            Login here
          </Link>
        </p>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleSocialLogin(googleSignIn)}
            className="bg-white text-gray-700 flex items-center border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200"
          >
            <FaGoogle className="mr-2" />
            Sign in with Google
          </button>
        </div>
      </div>
    </section>
  );
};

export default Register;
