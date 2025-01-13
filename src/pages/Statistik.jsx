import React from "react";
import VerticalBarChart from "../components/VerticalBarChart";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config/config";
import Modal from "../components/Modal";
import BodyModal from "../components/BodyModal";
import Header from "../components/Header";
import FooterModal from "../components/FooterModal";
import Loading from "../components/Loading";

const convertToDatasets = (data, labels, colors) => {
  return Object.keys(data).map((key, index) => {
    const label = labels[key];
    const value = data[key];
    const backgroundColor = colors[index];

    return {
      label,
      data: [value],
      backgroundColor,
    };
  });
};

const bgColorsEdu = [
  "#A7C7E7", // Light Blue (Pastel)
  "#F7A4A4", // Soft Pink
  "#F9D976", // Pastel Yellow
  "#A8D5BA", // Pastel Green
  "#D8BFD8", // Thistle (Pastel Purple)
];

const bgColorsJob = [
  "#A7C7E7", // Light Blue (Pastel)
  "#ADD8E6", // Sky Blue (Pastel)
  "#F7A4A4", // Soft Pink
  "#A8D5BA", // Pastel Green
  "#F9D976", // Pastel Yellow
  "#D8BFD8", // Thistle (Pastel Purple)
  "#F2B8B8", // Light Coral (Pastel Red)
];

const bgColorsPenduduk = [
  "#A7C7E7", // Light Blue (Pastel)
  "#ADD8E6", // Sky Blue (Pastel)
];

const labelsEdu = {
  kuliah: "Kuliah",
  sd: "SD",
  smp: "SMP",
  sma: "SMA",
  tidak_sekolah: "Tidak Sekolah",
};
const labelsJob = {
  buruh: "Buruh",
  pegawai_swasta: "Pegawai Swasta",
  pns: "PNS",
  polri: "Polri",
  tni: "Tni",
  wirausaha: "Wirausaha",
  tidak_bekerja: "Tidak Bekerja",
};
const labelsPenduduk = {
  laki: "Laki - Laki",
  wanita: "Wanita",
};

const Statistik = () => {
  const [dataStatistik, setDataStatistik] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [laki, setLaki] = React.useState(0);
  const [wanita, setWanita] = React.useState(0);
  const [kuliah, setKuliah] = React.useState(0);
  const [sd, setSd] = React.useState(0);
  const [smp, setSmp] = React.useState(0);
  const [sma, setSma] = React.useState(0);
  const [openModal, setOpenModal] = React.useState(false);
  const [tidak_sekolah, setTidakSekolah] = React.useState(0);

  const [editPenduduk, setEditPenduduk] = React.useState(false);
  const [editEdu, setEditEdu] = React.useState(false);
  const [editJob, setEditJob] = React.useState(false);

  const [buruh, setBuruh] = React.useState(0);
  const [pegawai_swasta, setPegawaiSwasta] = React.useState(0);
  const [pns, setPns] = React.useState(0);
  const [polri, setPolri] = React.useState(0);
  const [tni, setTni] = React.useState(0);
  const [wirausaha, setWirausaha] = React.useState(0);
  const [tidak_bekerja, setTidakBekerja] = React.useState(0);

  const educationData =
    dataStatistik.length > 0 &&
    convertToDatasets(dataStatistik[0], labelsEdu, bgColorsEdu);
  const jobData =
    dataStatistik.length > 0 &&
    convertToDatasets(dataStatistik[2], labelsJob, bgColorsJob);
  const pendudukData =
    dataStatistik.length > 0 &&
    convertToDatasets(dataStatistik[1], labelsPenduduk, bgColorsPenduduk);
  const totalEdu =
    dataStatistik.length > 0 &&
    Object.values(dataStatistik[0]).reduce((acc, curr) => acc + curr, 0);
  const totalJob =
    dataStatistik.length > 0 &&
    Object.values(dataStatistik[2]).reduce((acc, curr) => acc + curr, 0);
  const totalPenduduk =
    dataStatistik.length > 0 &&
    Object.values(dataStatistik[1]).reduce((acc, curr) => acc + curr, 0);
  const statistikCollection = collection(db, "statistik");
  const inputsEdu = [
    { type: "number", label: "Kuliah", value: kuliah, setValue: setKuliah },
    { type: "number", label: "SD", value: sd, setValue: setSd },
    { type: "number", label: "SMP", value: smp, setValue: setSmp },
    { type: "number", label: "SMA", value: sma, setValue: setSma },
    {
      type: "number",
      label: "Tidak Sekolah",
      value: tidak_sekolah,
      setValue: setTidakSekolah,
    },
  ];
  const inputsPenduduk = [
    { type: "number", label: "Laki - Laki", value: laki, setValue: setLaki },
    { type: "number", label: "Wanita", value: wanita, setValue: setWanita },
  ];
  const inputsJob = [
    { type: "number", label: "Buruh", value: buruh, setValue: setBuruh },
    {
      type: "number",
      label: "Pegawai Swasta",
      value: pegawai_swasta,
      setValue: setPegawaiSwasta,
    },
    { type: "number", label: "PNS", value: pns, setValue: setPns },
    { type: "number", label: "Polri", value: polri, setValue: setPolri },
    { type: "number", label: "Tni", value: tni, setValue: setTni },
    {
      type: "number",
      label: "Wirausaha",
      value: wirausaha,
      setValue: setWirausaha,
    },
    {
      type: "number",
      label: "Tidak Bekerja",
      value: tidak_bekerja,
      setValue: setTidakBekerja,
    },
  ];
  const handleClose = () => {
    setEditPenduduk(false);
    setOpenModal(false);
  };
  const onEditPenduduk = () => {
    setEditPenduduk(true);
    setEditEdu(false);
    setEditJob(false);
    setOpenModal(true);
    setLaki(dataStatistik[1].laki);
    setWanita(dataStatistik[1].wanita);
  };
  const onEditEdu = () => {
    setEditPenduduk(false); 
    setEditEdu(true);
    setEditJob(false); 
    setOpenModal(true);
    setSd(dataStatistik[0].sd);
    setSmp(dataStatistik[0].smp);
    setSma(dataStatistik[0].sma);
    setKuliah(dataStatistik[0].kuliah);
    setTidakSekolah(dataStatistik[0].tidak_sekolah);
  };
  const onEditJob = () => {
    setEditPenduduk(false); 
    setEditEdu(false); 
    setEditJob(true);
    setOpenModal(true);
    setBuruh(dataStatistik[2].buruh);
    setPegawaiSwasta(dataStatistik[2].pegawai_swasta);
    setPns(dataStatistik[2].pns);
    setPolri(dataStatistik[2].polri);
    setTni(dataStatistik[2].tni);
    setWirausaha(dataStatistik[2].wirausaha);
    setTidakBekerja(dataStatistik[2].tidak_bekerja);
    
  };
  const handleEditPenduduk = async () => {
    try {
      await updateDoc(doc(db, "statistik", "gender"), {
        laki: Number(laki),
        wanita: Number(wanita),
      });
      await fetchData();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditEdu = async () => {
    console.log("dasdasd");
    try {
      await updateDoc(doc(db, "statistik", "education"), {
        sd: Number(sd),
        smp: Number(smp),
        sma: Number(sma),
        sarjana: Number(kuliah),
        tidak_sekolah: Number(tidak_sekolah),
      });
      await fetchData();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditJob = async () => {
    console.log("dasdasd");
    try {
      await updateDoc(doc(db, "statistik", "job"), {
        buruh: Number(buruh),
        pegawai_swasta: Number(pegawai_swasta),
        pns: Number(pns),
        polri: Number(polri),
        tni: Number(tni),
        wirausaha: Number(wirausaha),
        tidak_bekerja: Number(tidak_bekerja),
      });
      await fetchData();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDocs(statistikCollection);
      const responseData = response.docs.map((doc) => ({
        ...doc.data(),
      }));
      const data = responseData.map(
        ({
          sd,
          smp,
          sma,
          kuliah,
          tidak_sekolah,
          laki,
          wanita,
          buruh,
          pegawai_swasta,
          pns,
          polri,
          tni,
          wirausaha,
          tidak_bekerja,
        }) => ({
          ...(tidak_sekolah ? { tidak_sekolah } : {}),
          ...(sd ? { sd } : {}),
          ...(smp ? { smp } : {}),
          ...(sma ? { sma } : {}),
          ...(kuliah ? { kuliah } : {}),
          ...(laki ? { laki } : {}),
          ...(wanita ? { wanita } : {}),
          ...(buruh ? { buruh } : {}),
          ...(pegawai_swasta ? { pegawai_swasta } : {}),
          ...(pns ? { pns } : {}),
          ...(polri ? { polri } : {}),
          ...(tni ? { tni } : {}),
          ...(wirausaha ? { wirausaha } : {}),
          ...(tidak_bekerja ? { tidak_bekerja } : {}),
        })
      );
      console.log(data);
      setDataStatistik(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loading size="24" /> {/* Increase the size */}
      </div>
    );
  }

  return (
    <div>
      <Header title="Statistik"/>
      <h1 className="text-3xl font-bold mb-6"></h1>
      {
        <div>
          <div>
            <div className="mb-6 flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Pendidikan</h2>
              <div className="flex justify-between items-center">
                <button
                  onClick={onEditEdu}
                  className="bg-customBlue hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <div>
                  <p className="text-xl font-semibold">Total Pendidikan</p>
                  <p className="text-center font-bold text-blue-800 text-xl">
                    {totalEdu}
                  </p>
                </div>
              </div>
              <div className="flex h-[400px]">
                <VerticalBarChart
                  datasets={educationData}
                  labels={["Total Pendidikan"]}
                />
              </div>
            </div>
            <div className="mb-6 flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Pekerjaan</h2>
              <div className="flex justify-between items-center">
                <button
                  onClick={onEditJob}
                  className="bg-customBlue hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <div>
                  <p className="text-xl font-semibold">Total Pekerjaan</p>
                  <p className="text-center font-bold text-blue-800 text-xl">
                    {totalJob}
                  </p>
                </div>
              </div>
              <div className="flex h-[400px]">
                <VerticalBarChart
                  datasets={jobData}
                  labels={["Total Pekerjaan"]}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Jenis Kelamin</h2>
              <div className="flex justify-between items-center">
                <button
                  onClick={onEditPenduduk}
                  className="bg-customBlue hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <div>
                  <p className="text-xl font-semibold">Total Penduduk</p>
                  <p className="text-center font-bold text-blue-800 text-xl">
                    {totalPenduduk}
                  </p>
                </div>
              </div>
              <div className="flex h-[400px]">
                <VerticalBarChart
                  datasets={pendudukData}
                  labels={["Total Penduduk"]}
                />
              </div>
            </div>
          </div>
        </div>
      }
      <Modal
        open={openModal}
        onClose={handleClose}
        body={
          <BodyModal
            inputs={
              editPenduduk ? inputsPenduduk : editEdu ? inputsEdu : inputsJob // Tambahkan untuk pekerjaan
            }
          />
        }
        footer={
          <FooterModal
            onClick={
              editPenduduk
                ? handleEditPenduduk
                : editEdu
                ? handleEditEdu
                : handleEditJob // Tambahkan untuk pekerjaan
            }
            title={"Edit"}
          />
        }
        title={
          editPenduduk
            ? "Edit Statistik Penduduk"
            : editEdu
            ? "Edit Statistik Pendidikan"
            : "Edit Statistik Pekerjaan" // Tambahkan untuk pekerjaan
        }
      />
    </div>
  );
};

export default Statistik;
