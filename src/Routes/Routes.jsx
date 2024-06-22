import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/Layout";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import MyProfile from "../pages/Dashboard/MyProfile";
import ScholarshipDetails from "../pages/ScholarshipDetails/ScholarshipDetails";
import Payment from "../pages/Payment/Payment";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

const Routes = createBrowserRouter([
    {
        path: '/',
        element: <Layout></Layout>,
        children: [
            {
                index: true,
                element: <Home></Home>,
            },
            {
                path: "/details/:id",
                element: <ScholarshipDetails></ScholarshipDetails>,
            },
            {
                path: "/payment",
                element: <Payment></Payment>,
            },
            {
                path: "/login",
                element: <Login></Login>,
              },
              {
                path: "/register",
                element: <Register></Register>,
              },
        ]
    },
    {
        path: "/dashboard",
        element: <Dashboard></Dashboard>,
        children: [
            {
                index: true,
                element: <MyProfile></MyProfile>
            }
        ]
    }
]);

export default Routes;