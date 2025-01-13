import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PublicRoutes from "./components/PublicRoutes";
import {
  addWisata,
  akun,
  wisata,
  dashboard,
  login,
  pengaduan,
  resetPassword,
  statistik,
  editWisata,
} from "./constant/routes";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Pengaduan from "./pages/Pengaduan";
import Statistik from "./pages/Statistik";
import PrivateRoutes from "./components/PrivateRoutes";
import Wisata from "./pages/Wisata";
import AddWisata from "./pages/AddWisata";
import Akun from "./pages/Akun";
import EditWisata from "./pages/EditWisata";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PrivateRoutes />,
      children: [
        {
          path: dashboard,
          element: <Dashboard />,
        },
        {
          path: pengaduan,
          element: <Pengaduan />,
        },
      
        {
          path: statistik,
          element: <Statistik />,
        },
        {
          path: wisata,
          element: <Wisata />,
        },
        {
          path: addWisata,
          element: <AddWisata />,
        },
        {
          path: editWisata,
          element: <EditWisata />,
        },
        {
          path: akun,
          element: <Akun />,
        },
      ],
    },
    {
      element: <PublicRoutes />,
      children: [
        {
          path: login,
          element: <Login />,
        },
    
        {
          path: resetPassword,
          element: <ResetPassword />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
