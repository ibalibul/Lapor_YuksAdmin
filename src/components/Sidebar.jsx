import { NavLink, useNavigate } from "react-router-dom";
import {
  wisata,
  dashboard,
  pengaduan,
  statistik,
  akun,
} from "../constant/routes";


const Sidebar = () => {
  const listRoute = [
    { name: "Dashboard", path: dashboard },
    { name: "Pengaduan", path: pengaduan },
    { name: "Wisata", path: wisata },
    { name: "Statistik", path: statistik },
    { name: "Akun", path: akun },
    // { name: "Table", path: table },
  ];

  return (
    <div className="h-full bg-customBlue relative">
      <div className="sidebar h-screen sticky top-0 lg:left-0 p-2 w-full lg:w-[250px] overflow-y-auto text-center lg:text-left">
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center">
            <i className="bi bi-app-indicator px-2 py-1 rounded-md bg-blue-600"></i>
            <h1 className="font-bold text-gray-200 text-[15px] ml-3">
              Dashboard Admin
            </h1>
            <i className="bi bi-x cursor-pointer ml-28 lg:hidden"></i>
          </div>
          <div className="my-2 bg-gray-600 h-[1px]"></div>
        </div>
        {listRoute.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `${
                isActive && "bg-gray-800"
              } p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-gray-600 text-[15px] text-gray-200 font-bold`
            }
          >
            {item.name}
          </NavLink>
        ))}

      </div>
    </div>
  );
};

export default Sidebar;
