import React from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../constant/routes";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../firebase/config/config";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { setToken, setUid } from "../services/api";
import { useAuthContext } from "../context/authContext/useAuthContext";
import Swal from "sweetalert2";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [inputError, setInputError] = React.useState(false);
  const [isResetPassword, setIsResetPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const userCollection = collection(db, "user");
  const { setAuth } = useAuthContext();

  React.useEffect(() => {
    setInputError(email === "" || password === "");
  }, [email, password]);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await getDocs(userCollection);
      const responseData = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };
  const handleToResetPass = () => {
    setEmail("");
    setIsResetPassword(true);
  };
  const handleBackToLogin = () => {
    setEmail("");
    setIsResetPassword(false);
  };

  const handleReset = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        icon: "success",
        title: "Email terkirim",
        text: "Silahkan cek email anda untuk mereset password, anda akan dialihkan ke halaman login",
      });
      setLoading(false);
      handleBackToLogin();
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert(error);
    }
  };

  const handleLogin = async (e) => {
    console.log(email, password);
    setLoading(true);
    e.preventDefault();
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const {
        user: { uid, accessToken },
      } = response;
      const users = await getUsers();
      const user = users.find((user) => user.uid === uid);
      if (!user.roleType || user.roleType !== "admin") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Anda bukan admin!",
        });
        setLoading(false);
        return;
      }
      setToken(accessToken);
      setUid(uid);
      setAuth({ profile: user, isLogin: true });
    } catch (error) {
      console.log(error);
      if (error.code === "auth/user-not-found") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Akun tidak ditemukan!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-24 py-12 bg-customBlue">
        <div className="w-full max-w-lg mx-auto justify-center p-8 bg-white shadow-md rounded-lg">
          {isResetPassword ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Reset your password</h2>
              <form onSubmit={handleReset}>
                <div className="mb-4">
                  <label
                    htmlFor="reset-email"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="reset-email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-800 focus:border-gray-800 sm:text-sm"
                    placeholder="admin@email.com"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Send reset link"
                  )}
                </button>
                <div className="flex items-center justify-end mt-4">
                  <button
                    type="button"
                    className="text-sm font-medium text-gray-800 hover:text-gray-900"
                    onClick={handleBackToLogin}
                  >
                    Back to sign in
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">
                Sign in 
              </h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-800 focus:border-gray-800 sm:text-sm"
                    placeholder="admin@email.com"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    id="password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-800 focus:border-gray-800 sm:text-sm"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-end mb-4">
                  <div className="text-sm">
                    <button
                      type="button"
                      className="font-medium text-gray-800 hover:text-gray-900"
                      onClick={handleToResetPass}
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading || inputError}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      {/* Right section */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-800 flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-lg mx-auto justify-center">
  
          <h1 className="text-3xl text-white font-bold mb-4 text-center">
            Download LaporYuks App
          </h1>
          {/* <p className="text-lg text-white mb-8 text-center">
            Get the latest version of our app on the Google Play Store.
          </p> */}
          <div className="flex justify-center mb-2 p-14">
            <img src="/Logo.svg" alt="Pengaduan Logo" className="w-4/5" />
          </div>
          <div className="flex-grow flex flex-col items-center justify-center bg-gray-800 p-8">
            <a
              href="https://play.google.com/"
             
              target="_blank"
              rel="noopener noreferrer"
              className="flex mt-3 w-48 h-14 bg-black text-white rounded-lg items-center justify-center no-underline hover:bg-gray-900"
            >
              <div className="mr-3">
                <svg viewBox="30 336.7 120.9 129.2" width="30">
                  <path
                    fill="#FFD400"
                    d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"
                  />
                  <path
                    fill="#FF3333"
                    d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"
                  />
                  <path
                    fill="#48FF48"
                    d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"
                  />
                  <path
                    fill="#3BCCFF"
                    d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs">GET IT ON</div>
                <div className="text-xl font-semibold font-sans -mt-1">
                  Google Play
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
