import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <div className="flex">
      <aside>
        <div className="w-72 h-screen bg-[#1779AB] text-[#102C57]">
            <ul>
                <li className="border-b p-4 font-medium"><Link to={'myProfile'}>My Profile</Link></li>
                <li className="border-b p-4 font-medium"><Link to={'myApplication'}>My application</Link></li>
                <li className="border-b p-4 font-medium"><Link to={'paymentHistory'}>Payment History</Link></li>
                <li className="border-b p-4 font-medium">Dashboard</li>
            </ul>
        </div>
      </aside>
      <div className="p-4 w-[calc(100vw-288px)]">
        <Outlet></Outlet>
      </div>
      </div>
    </>
  );
};

export default Dashboard;
