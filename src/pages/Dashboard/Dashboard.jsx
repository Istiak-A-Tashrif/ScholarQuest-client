import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);

  const {user} = useAuth();
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.post (`${import.meta.env.VITE_URL}/checkUserRole`, { email: user?.email});
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [user]);
  
  return (
    <>
      <div className="flex">
        <aside className="bg-[#1779AB]">
          <div className="w-72 h-screen bg-[#1779AB] text-[#102C57] border-red-600 border=[50px]">
            <ul>
              <li className="border-b p-4 font-medium"><Link to={'myProfile'}>My Profile</Link></li>
              {userRole === 'admin' && (
                <li className="border-b p-4 font-medium"><Link to={'moderatorPanel'}>Moderator Panel</Link></li>
              )}
              {userRole === 'admin' && (
                <li className="border-b p-4 font-medium"><Link to={'manageScholarships'}>Manage Scholarships</Link></li>
              )}
              <li className="border-b p-4 font-medium"><Link to={'myApplication'}>My Application</Link></li>
              <li className="border-b p-4 font-medium"><Link to={'paymentHistory'}>Payment History</Link></li>
              <li className="border-b p-4 font-medium"><Link to={'myReviews'}>My Reviews</Link></li>
            </ul>
          </div>
        </aside>
        <div className="pl-4 pt-4 w-[calc(100vw-288px)]">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
