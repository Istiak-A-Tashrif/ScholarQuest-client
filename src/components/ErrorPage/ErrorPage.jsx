import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import errorImg from "../../assets/404.json";

const ErrorPage = () => {
  return (
    <div>
      <section className="flex items-center p-16 dark:bg-gray-50 dark:text-gray-800 h-screen">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div className="max-w-md text-center">
            <div className="mb-8 w-1/2 mx-auto">
              <Lottie animationData={errorImg} loop={true} className="" ></Lottie>
            </div>
            <p className="text-2xl mt-4 mb-8 font-semibold md:text-3xl">
              Sorry, we couldn't find this page.
            </p>
            <Link
              to={"/"}
              className="px-8 py-3 text-lg font-semibold rounded hover:text-green-800 underline"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ErrorPage;
