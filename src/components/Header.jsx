import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext/useAuthContext";
import { login } from "../constant/routes";
import { removeToken, removeUid } from "../services/api";

const Header = ({ title }) => {
  const { auth, resetAuth } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await Swal.fire({
      title: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Replace `removeToken` and `removeUid` with your logout logic
        removeToken();
        removeUid();
        resetAuth();
        navigate(login); // Replace `/login` with your login route
      }
    });
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center rounded">
      <div className="text-2xl font-bold">{title}</div>
      <div className="flex items-center space-x-4">
        <span>👤 Admin</span>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-red-600 hover:text-red-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M17 10a1 1 0 01-1 1H7a1 1 0 110-2h9a1 1 0 011 1zM8.707 4.293a1 1 0 10-1.414 1.414L10.586 9H3a1 1 0 100 2h7.586l-3.293 3.293a1 1 0 101.414 1.414l5-5a1 1 0 000-1.414l-5-5z"
              clipRule="evenodd"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
