import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";
import { FaHome } from "react-icons/fa";

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_URL}/checkUserRole`, { email: user?.email });
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [user]);

  // Function to handle closing of the drawer
  const handleDrawerClose = () => {
    const drawerToggle = document.getElementById("my-drawer-3");
    if (drawerToggle.checked) {
      drawerToggle.checked = false;
    }
  };

  return (
    <>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="navbar bg-base-100">
            <div className="flex-none">
              <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <a className="font-semibold pl-2 text-xl">Dashboard</a>
            </div>
            
          </div>
          {/* Page content here */}
          <div className="p-4">
            <Outlet></Outlet>
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li className="py-2">
              <Link to={'/'} className="text-black" onClick={handleDrawerClose}>
                <FaHome className="mr-2" /> Home
              </Link>
            </li>
            <li className="py-2">
              <Link to={'myProfile'} className="text-black" onClick={handleDrawerClose}>
                My Profile
              </Link>
            </li>
            {userRole === 'admin' && (
              <>
                <li className="py-2">
                  <Link to={'userPanel'} className="text-black" onClick={handleDrawerClose}>
                    Admin Panel
                  </Link>
                </li>
                <li className="py-2">
                  <Link to={'addScholarship'} className="text-black" onClick={handleDrawerClose}>
                    Add Scholarship
                  </Link>
                </li>
                <li className="py-2">
                  <Link to={'manageScholarships'} className="text-black" onClick={handleDrawerClose}>
                    Manage Scholarships
                  </Link>
                </li>
                <li className="py-2">
                  <Link to={'allApplication'} className="text-black" onClick={handleDrawerClose}>
                    All Applications
                  </Link>
                </li>
                <li className="py-2">
                  <Link to={'allReviews'} className="text-black" onClick={handleDrawerClose}>
                    All Reviews
                  </Link>
                </li>
              </>
            )}
            {userRole === 'moderator' && (
              <li className="py-2">
                <Link to={'userPanel'} className="text-black" onClick={handleDrawerClose}>
                  Moderator Panel
                </Link>
              </li>
            )}
            <li className="py-2">
              <Link to={'myApplication'} className="text-black" onClick={handleDrawerClose}>
                My Application
              </Link>
            </li>
            <li className="py-2">
              <Link to={'myReviews'} className="text-black" onClick={handleDrawerClose}>
                My Reviews
              </Link>
            </li>
            <li className="py-2">
              <Link to={'paymentHistory'} className="text-black" onClick={handleDrawerClose}>
                Payment History
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
