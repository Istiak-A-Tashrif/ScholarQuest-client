import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <div className="flex">
      <aside>
        <div className="w-72 h-screen bg-[#1779AB] text-[#102C57]">
            <ul>
                <li className="border-b p-4 font-medium">My Profile</li>
                <li className="border-b p-4 font-medium">Dashboard</li>
                <li className="border-b p-4 font-medium">Dashboard</li>
                <li className="border-b p-4 font-medium">Dashboard</li>
            </ul>
        </div>
      </aside>
      <div className="p-4">
        <Outlet></Outlet>
      </div>
      </div>
    </>
  );
};

export default Dashboard;
