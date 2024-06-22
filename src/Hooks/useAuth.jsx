import { useContext } from "react";
import { firebaseContext } from "../AuthProvider/AuthProvider";

const useAuth = () => {
  const all = useContext(firebaseContext);
  return all;
};

export default useAuth;
