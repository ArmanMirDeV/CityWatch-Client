import React from "react";
import { NavLink } from "react-router";
import Logo from "../Logo/Logo";

const Navbar = () => {
  // Menu items
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "All Issues", path: "/all-issues" },
    { name: "Top Issues", path: "/top-issues" },
    { name: "City Map", path: "/city-map" },
  ];

  return (
    <div className="navbar bg-base-100 shadow-md px-4 md:px-8">
      {/* Navbar Start */}
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "text-blue-600 font-semibold" : ""
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
            <li className="mt-2 border-t pt-2">
              <NavLink to="/login" className="btn btn-sm w-full mb-2">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-sm btn-outline w-full">
                Register
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <NavLink
          to="/"
          className="btn btn-ghost normal-case text-xl font-bold flex items-center gap-2"
        >
          <Logo />
        </NavLink>
      </div>

      {/* Navbar Center (Desktop Menu) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-semibold text-gray-700">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "text-blue-600 border-b-2 border-blue-600" : ""
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end hidden lg:flex gap-2">
        <NavLink to="/login" className="btn btn-sm">
          Login
        </NavLink>
        <NavLink to="/register" className="btn btn-sm btn-outline">
          Register
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
