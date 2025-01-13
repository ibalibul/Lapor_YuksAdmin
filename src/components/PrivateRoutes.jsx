import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/authContext/useAuthContext";
import { login } from "../constant/routes";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config/config";
import { getUid } from "../services/api";

const PrivateRoutes = () => {
  const { auth, setAuth } = useAuthContext();
  const userCollection = collection(db, "user");
  const getUsers = async () => {
    try {
      const response = await getDocs(userCollection);
      const responseData = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const user = responseData.find((user) => user.uid === getUid());
      if (user) {
        setAuth({ profile: user, isLogin: true });
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(auth);
  useEffect(() => {
    if (auth.profile) return;
    if (auth.isLogin) getUsers();
  }, []);
  return auth?.isLogin ? (
    <main>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <aside>
            <Sidebar />
          </aside>
          <section className="flex w-full">
            <div className="p-6 bg-slate-100 w-full">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </main>
  ) : (
    <Navigate to={login} />
    // <Navigate to={downloadPage} />
  );
};

export default PrivateRoutes;
