import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import loading from "../../assets/loading.json"
import Lottie from "lottie-react";


const PrivateRoute = ({ children }) => {
  const { user, loader } = useAuth();
  const location = useLocation();

  if (loader) {
    return (
      <div className="flex items-center justify-center  min-h-[calc(100vh-300px)]">
          <Lottie animationData={loading} loop={true} className="h-44"></Lottie>
        </div>
    );
  }

  if (user) {
    return <div>{children}</div>;
  }
  return <Navigate to={"/login"} state={location?.pathname || "/"}></Navigate>;
};

export default PrivateRoute;
