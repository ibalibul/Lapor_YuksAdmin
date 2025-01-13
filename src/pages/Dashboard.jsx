import React from "react";
import DoughnutChart from "../components/DoughnutChart";
import { FaAddressBook } from "react-icons/fa";
import BoxStatus from "../components/BoxStatus";
import BarChart from "../components/BarChart";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config/config";
import Loading from "../components/Loading";
import Header from "../components/Header";

const Dashboard = () => {
  const [loading, setLoading] = React.useState(false);
  const [pengaduan, setPengaduan] = React.useState([]);
  const pengaduanBelum = pengaduan.filter((item) => item.status === 1);
  const pengaduanDiproses = pengaduan.filter((item) => item.status === 2);
  const pengaduanSelesai = pengaduan.filter((item) => item.status === 3);
  const pengaduanDitolak = pengaduan.filter((item) => item.status === 4);
  const [totalUser, setTotalUser] = React.useState([]);
  const [totalAdmin, setTotalAdmin] = React.useState([]);
  const laporanCollection = collection(db, "laporan");
  const userCollection = collection(db, "user");

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await getDocs(userCollection);
      const responseData = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const users = responseData.filter((user) => user.roleType === "user");
      const admin = responseData.filter((admin) => admin.roleType === "admin");

      setLoading(false);
      setTotalUser(responseData);
      // setTotalUser(users); // Ensure to stop loading after data is fetched
      setTotalAdmin(admin);

      console.log(users);

      return users;
    } catch (error) {
      console.log(error);
      setLoading(false); // Ensure to stop loading in case of error
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDocs(laporanCollection);
      const responseData = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(responseData);
      setPengaduan(responseData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const seriesData = [
    {
      name: "Belum diproses",
      data: [pengaduanBelum.length],
    },
    {
      name: "Diproses",
      data: [pengaduanDiproses.length],
    },
    {
      name: "Ditolak",
      data: [pengaduanDitolak.length],
    },
    {
      name: "Selesai",
      data: [pengaduanSelesai.length],
    },
  ];

  const colorData = ["#93C5FD", "#C4B5FD", "#FCA5A5", "#86EFAC"];
  const categoryData = ["Pengaduan"];

  React.useEffect(() => {
    fetchData();
    getUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loading size="24" /> {/* Increase the size */}
      </div>
    );
  }

  return (
    <main className="flex flex-col flex-1">
      {/* Top Bar */}

      <Header title="Dashboard" />

      {/* Main Content */}
      <section className="p-6 bg-gray-100 flex-1">
        {/* Metrics Section */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-blue-100 p-6 rounded shadow">
            <h3 className="text-lg font-semibold">Belum Diproses</h3>
            <p className="text-2xl font-bold">{pengaduanBelum.length}</p>
          </div>
          <div className="bg-purple-100 p-6 rounded shadow">
            <h3 className="text-lg font-semibold">Diproses</h3>
            <p className="text-2xl font-bold">{pengaduanDiproses.length}</p>
          </div>
          <div className="bg-red-100 p-6 rounded shadow">
            <h3 className="text-lg font-semibold">Ditolak</h3>
            <p className="text-2xl font-bold">{pengaduanDitolak.length}</p>
          </div>
          <div className="bg-green-100 p-6 rounded shadow">
            <h3 className="text-lg font-semibold">Selesai</h3>
            <p className="text-2xl font-bold">{pengaduanSelesai.length}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Bar Charts Full Width */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <BarChart
                series={seriesData}
                colors={colorData}
                categories={categoryData}
              />
            </div>
            <div className="bg-white p-8 flex-1">
              <DoughnutChart
                dataArray={[totalUser.length, totalAdmin.length]}
                label={"Pengguna"}
                labels={["User", "Admin"]}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
