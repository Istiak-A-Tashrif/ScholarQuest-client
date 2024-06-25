import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import login from "../../assets/login.json";
import Lottie from "lottie-react";
import { Link, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { Slide, toast } from "react-toastify";
import axios from "axios";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginUser, googleSignIn, notifyError, user, loader } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  // handle social errors
  const handleSocialLogin = (socialProvider) => {
  socialProvider()
    .then(async (res) => {
      if (res.user) {
        try {
          // Call backend endpoint to get JWT token
          const { data } = await axiosSecure.post("/jwt", {
            email: res.user.email,
          });

          localStorage.setItem('token', data.token);
          // Send user data to backend (assuming sendUserData is defined)
          await sendUserData(res.user.email, res.user.displayName, res.user.photoURL);

          // Show success toast notification
          toast.success("Logged in", {
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

          // Navigate to the specified location or default "/"
          navigate(location?.state || "/");
        } catch (error) {
          console.error('Error during social login:', error.message);
          // Notify user about the error
          notifyError();
        }
      } else {
        console.error('Social login response does not contain user information:', res);
        // Notify user about the issue
        notifyError();
      }
    })
    .catch((error) => {
      console.error('Error during social login:', error.message);
      // Notify user about the error
      notifyError();
    });
};

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    loginUser(email, password)
      .then(async (res) => {
        const { data } = await axiosSecure.post("/jwt", {
          email: res.user.email,
        });

        localStorage.setItem('token', data.token)
        // Send user data to backend
        sendUserData(res.user.email, res.user.displayName, res.user.photoURL);
        
        toast.success("Logged in", {
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
        navigate(location?.state || "/");
      })
      .catch((error) => {
        console.error("error", error.message);
        notifyError();
      });
  };

  const sendUserData = async (email, name, photo) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/registerUser`, {
        email,
        name,
        photo,
      });
     
    } catch (error) {
      console.error('Failed to send user data to server:', error);
      // Optionally handle error or display an error message to the user
    }
  };

  if (user || loader) return;

  return (
    <div className="min-h-[60vh] flex justify-center items-center mt-4">
      <title>StudyNexus | Login</title>
      <ScrollRestoration />
      <div className="flex items-center bg-[#FFE6E6] rounded-md justify-center flex-col md:flex-row">
        <div>
          <Lottie animationData={login} loop={true} />
        </div>

        <div className="w-full max-w-md p-8 pt-0  -mt-12 md:m-0 md:pt-8 space-y-3 rounded-xl text-gray-800">
          <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
          <form
            noValidate=""
            action=""
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-1 text-sm">
              <label
                htmlFor="email"
                className="block text-gray-700 dark:text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-md border focus:outline-none focus:border-violet-600 bg-white"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="space-y-1 text-sm">
              <label
                htmlFor="password"
                className="block text-gray-700 dark:text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-md border focus:outline-none focus:border-violet-600 bg-white"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <div className="flex justify-end text-xs text-gray-600 dark:text-gray-600">
                <a
                  className="hover:text-blue-600 cursor-pointer"
                  rel="noopener noreferrer"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            <button className="block w-full p-3 text-center rounded-sm bg-[#7469B6] text-white font-bold hover:bg-blue-200 focus:outline-none focus:bg-[#AD88C6]">
              Log in
            </button>
          </form>
          <div className="flex items-center pt-4 space-x-1">
            <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
            <p className="px-3 text-sm text-gray-600">
              Login with social accounts
            </p>
            <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              aria-label="Log in with Google"
              className="btn btn-ghost flex items-center gap-2"
              onClick={() => handleSocialLogin(googleSignIn)}
            >
              <FaGoogle />
              <span className="font-bold">Google</span>
            </button>
          </div>
          <p className="text-xs text-center sm:px-6">
            Don't have an account?{" "}
            <Link to={"/register"} className="underline hover:text-blue-600">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
