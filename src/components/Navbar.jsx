// NavBar.jsx
// import React from 'react';

// const Navbar = () => {
//   return (
//     <nav className="bg-gray-800 p-4">
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
//         <div className="text-white text-lg font-semibold">My App</div>
//         <div className="flex space-x-4">
//           <a href="/" className="text-gray-300 hover:text-white">Home</a>
//           <a href="/about" className="text-gray-300 hover:text-white">About</a>
//           <a href="/contact" className="text-gray-300 hover:text-white">Contact</a>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center">
        {/* Add any other items that should be on the left side of the header */}
      </div>
      <div className="flex items-end">
        <div className="flex items-center ml-auto relative">
          <button className="flex items-center" onClick={toggleDropdown}>
            <img
              src="/Logo.svg"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            {/* <span className="ml-2">Sofia Rivers</span> */}
          </button>
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2"
              style={{ top: "100%" }}
            >
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Settings
              </Link>
              <Link
                to="/signout"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
