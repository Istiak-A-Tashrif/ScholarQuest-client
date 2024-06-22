import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

const Navbar = () => {
  const { user, userSignOut } = useAuth();
  const navigate = useNavigate();

  const navLink = (
    <>
      <li>
        <Link>Home</Link>
      </li>
      <li>
        <Link>All Scholarship</Link>
      </li>
      <li>
        <Link to={"/dashboard"}>Dashboard</Link>
      </li>
        {user ? (
          <li onClick={userSignOut}><Link>Log out</Link></li>
        ) : (
          <li><Link to={"/login"}>Log in</Link></li>
        )}
    </>
  );

  return (
    <>
      <div className="navbar bg-base-100 mb-4">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {navLink}
            </ul>
          </div>

          {/* website Name */}
          <h1 className="text-2xl font-bold font-merriweather text-[#1679AB]">
            Scholar<span className="text-[#102C57]">Quest</span>
          </h1>
        </div>
        <div className="navbar-end hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navLink}</ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
