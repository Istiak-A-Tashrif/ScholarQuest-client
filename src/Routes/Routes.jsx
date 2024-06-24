import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/Layout";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import MyProfile from "../pages/Dashboard/MyProfile";
import ScholarshipDetails from "../pages/ScholarshipDetails/ScholarshipDetails";
import Payment from "../pages/Payment/Payment";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import PaymentHistory from "../pages/Dashboard/PaymentHistory";
import ScholarshipApplicationForm from "../pages/ScholarshipApplicationForm/ScholarshipApplicationForm";
import MyApplication from "../pages/Dashboard/MyApplication/MyApplication";
import MyReviews from "../pages/Dashboard/MyReviews/MyReviews";
import EditApplicationForm from "../pages/Dashboard/MyApplication/EditApplicationForm";
import AllScholarship from "../pages/AllScholarship/AllScholarship";
import ManageScholarships from "../pages/Dashboard/ManageScholarships/ManageScholarships";
import EditScholarship from "../pages/Dashboard/ManageScholarships/EditScholarship";
import AllReviews from "../pages/Dashboard/MyReviews/AllReviews";
import AllApplications from "../pages/Dashboard/AllApplications/AllApplications";
import UserPanel from "../pages/Dashboard/UserPanel";
import AddScholarship from "../pages/Dashboard/AddScholarship";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import ErrorPage from "../components/ErrorPage/ErrorPage";

const Routes = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "details/:id",
                element: <PrivateRoute><ScholarshipDetails /></PrivateRoute>,
            },
            {
                path: "payment",
                element: <PrivateRoute><Payment /></PrivateRoute>,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "apply",
                element: <PrivateRoute><ScholarshipApplicationForm /></PrivateRoute>,
            },
            {
                path: "allScholarship",
                element: <AllScholarship />,
            },
        ],
    },
    {
        path: "dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: "myProfile",
                element: <PrivateRoute><MyProfile /></PrivateRoute>,
            },
            {
                path: "paymentHistory",
                element: <PrivateRoute><PaymentHistory /></PrivateRoute>,
            },
            {
                path: "myApplication",
                element: <PrivateRoute><MyApplication /></PrivateRoute>,
            },
            {
                path: "myReviews",
                element: <PrivateRoute><MyReviews /></PrivateRoute>,
            },
            {
                path: "editApplication/:id",
                element: <PrivateRoute><EditApplicationForm /></PrivateRoute>,
            },
            {
                path: "userPanel",
                element: <PrivateRoute><UserPanel /></PrivateRoute>,
            },
            {
                path: "manageScholarships",
                element: <PrivateRoute><ManageScholarships /></PrivateRoute>,
            },
            {
                path: "addScholarship",
                element: <PrivateRoute><AddScholarship /></PrivateRoute>,
            },
            {
                path: "editScholarship/:id",
                element: <PrivateRoute><EditScholarship /></PrivateRoute>,
            },
            {
                path: "allReviews",
                element: <PrivateRoute><AllReviews /></PrivateRoute>,
            },
            {
                path: "allApplication",
                element: <PrivateRoute><AllApplications /></PrivateRoute>,
            },
        ],
    },
]);

export default Routes;
