import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import Logo from "../Logo/Logo";
import { AuthContext } from "../../Authentication/Context/AuthContext";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "All Issues", path: "/all-issues" },
    { name: "Top Issues", path: "/top-issues" },
    { name: "City Map", path: "/city-map" },
  ];

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

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

            {/* User Section */}
            {user ? (
              <li className="mt-2 border-t pt-2">
                <div className="flex items-center gap-2 mb-2 px-2">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.displayName || "User"}
                    className="w-10 h-10 rounded-full border-2 border-indigo-500"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{user.displayName}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                </div>
                <NavLink
                  to="/dashboard/citizen"
                  className="btn btn-sm w-fit mb-2"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline w-fit"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="mt-2 border-t pt-2">
                <NavLink to="/login" className="btn btn-sm w-full mb-2">
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn btn-sm btn-outline w-full"
                >
                  Register
                </NavLink>
              </li>
            )}
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

      {/* Navbar End (Desktop) */}
      <div className="navbar-end hidden lg:flex gap-2 items-center">
        {!user ? (
          <>
            <NavLink to="/login" className="btn btn-sm">
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-sm btn-outline">
              Register
            </NavLink>
          </>
        ) : (
          <div className="relative">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt={user.displayName || "User"}
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-500"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold">{user.displayName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <ul className="flex flex-col">
                  <li>
                    <NavLink
                      to="/dashboard/citizen"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
