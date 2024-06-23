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
import ModeratorPanel from "../pages/Dashboard/ModeratorPanel";
import AllScholarship from "../pages/AllScholarship/AllScholarship";
import ManageScholarships from "../pages/Dashboard/ManageScholarships/ManageScholarships";
import EditScholarship from "../pages/Dashboard/ManageScholarships/EditScholarship";
import AllReviews from "../pages/Dashboard/MyReviews/AllReviews";

const Routes = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "details/:id",
                element: <ScholarshipDetails />,
            },
            {
                path: "payment",
                element: <Payment />,
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
                element: <ScholarshipApplicationForm />,
            },
            {
                path: "allScholarship",
                element: <AllScholarship />,
            },
        ],
    },
    {
        path: "dashboard",
        element: <Dashboard />,
        children: [
            {
                path: "myProfile",
                element: <MyProfile />,
            },
            {
                path: "paymentHistory",
                element: <PaymentHistory />,
            },
            {
                path: "myApplication",
                element: <MyApplication />,
            },
            {
                path: "myReviews",
                element: <MyReviews />,
            },
            {
                path: "editApplication/:id",
                element: <EditApplicationForm />,
            },
            {
                path: "moderatorPanel",
                element: <ModeratorPanel />,
            },
            {
                path: "manageScholarships",
                element: <ManageScholarships />,
            },
            {
                path: "editScholarship/:id",
                element: <EditScholarship />,
            },
            {
                path: "allReviews",
                element: <AllReviews />,
            },
        ],
    },
]);

export default Routes;
