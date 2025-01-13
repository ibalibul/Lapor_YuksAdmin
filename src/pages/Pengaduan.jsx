import React from "react";
import Loading from "../components/Loading";
import Swal from "sweetalert2";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/config/config";
import Select from "../components/Select";
import ReusableTable from "../components/ReusableTable";
import dayjs from "dayjs";
import Header from "../components/Header";
import Modal from "../components/Modal";
import BodyModal from "../components/BodyModal";
import FooterModal from "../components/FooterModal";
import { useState } from "react";
import Zoom from "react-medium-image-zoom";
import Pagination from "../components/Pagination";

const Pengaduan = () => {
  const [loading, setLoading] = React.useState(false);
  const [laporan, setLaporan] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [deskripsi, setDeskripsi] = React.useState("");
  const [idPengaduan, setIdPengaduan] = React.useState("");
  const [idTanggapan, setIdTanggapan] = React.useState("");
  const [isProses, setIsProses] = React.useState(false);
  const [isTolak, setIsTolak] = React.useState(false);
  const [filteredLaporan, setFilteredLaporan] = React.useState([]);
  const [option, setOption] = React.useState(0);
  const [categoryOption, setCategoryOption] = React.useState(0);
  const laporanCollection = collection(db, "laporan");
  const tanggapanCollection = collection(db, "tanggapan");
  const [tanggapanDetail, setTanggapanDetail] = useState(null);
  const [isModalProses, setIsModalProses] = React.useState(false);
  const [isModalSelesai, setIsModalSelesai] = React.useState(false);
  const [isModalDetail, setIsModalDetail] = React.useState(false);
  const [picture, setPicture] = useState(null);
  const [isModalTolak, setIsModalTolak] = React.useState(false);

  const [rowsLimit] = React.useState(10);
  const [rowsToShow, setRowsToShow] = React.useState([]);
  const [customPagination, setCustomPagination] = React.useState([]);
  const [totalPage, setTotalPage] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(0);

  const [pic, setPic] = React.useState("");

  const options = [
    { value: 0, label: "Semua" },
    { value: 1, label: "Belum Diproses" },
    { value: 2, label: "Diproses" },
    { value: 3, label: "Selesai" },
    { value: 4, label: "Ditolak" },
  ];

  const handleChangeOption = (e) => {
    setOption(e.target.value);
  };

  const columns = [
    {
      key: "photo",
      title: "Foto",
      render: ({ row }) => (
        <Zoom>
          <img
            src={row.image}
            alt="Pengaduan photo"
            className="w-16 h-auto object-cover cursor-pointer"
            style={{ aspectRatio: "16/9" }}
            onClick={() => {
              null;
            }}
          />
        </Zoom>
      ),
    },
    {
      key: "name",
      title: "Nama",
    },
    {
      key: "title",
      title: "Judul",
    },
    // {
    //   key: "createAt",
    //   title: "Tanggal",
    //   render: ({ value }) => <p>{dayjs(value).format("DD MMM YYYY, HH:mm")}</p>,
    // },
    {
      key: "createAt",
      title: "Tanggal",
      render: ({ value }) => {
        const date = new Date(value.seconds * 1000 + value.nanoseconds / 1e6); // Konversi ke milidetik
        return <p>{dayjs(date).format("DD MMM YYYY, HH:mm")}</p>;
      },
    },

    {
      key: "noTlp",
      title: "No Tlp",
    },
    {
      key: "description",
      title: "Isi",
    },
    {
      key: "category",
      title: "Kategori",
    },
    {
      title: "Actions",
      render: ({ row }) => {
        if (row.status == 1) {
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => actionProses(row.id)}
                className="text-sm bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              >
                Proses
              </button>
              <button
                onClick={() => actionTolak(row.id)}
                className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              >
                Tolak
              </button>
            </div>
          );
        } else if (row.status == 2) {
          return (
            <button
              onClick={() => actionSelesai(row.id)}
              className="text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Selesaikan
            </button>
          );
        } else if (row.status == 3) {
          return (
            <a
              href="#"
              onClick={() => actionDetailDone(row.id)}
              className="text-green-500 underline overflow-ellipsis break-words focus:outline-none"
            >
              Pengaduan Telah Selesai
            </a>
          );
        } else if (row.status == 4) {
          return (
            <a
              href="#"
              // onClick={() => actionSelesai(item.id)}
              className="text-red-500 underline focus:outline-none"
            >
              Pengaduan Ditolak
            </a>
          );
        } else {
          return;
        }
      },
    },
  ];
  const inputs = [
    {
      label: "Deskripsi",
      value: deskripsi,
      type: "text",
      setValue: setDeskripsi,
    },
  ];
  const actionSelesai = (id) => {
    // handleOpen();
    setIsModalSelesai(true);
    setIdPengaduan(id);
  };

  const actionDetailDone = (id) => {
    // handleOpen();
    setIsModalDetail(true);
    setIdPengaduan(id);
  };

  const actionProses = (id) => {
    setIsModalProses(true);
    // handleOpen();
    setIsProses(true);
    setIdPengaduan(id);
    setIdTanggapan(id);
  };
  const actionTolak = (id) => {
    setIsModalTolak(true);
    // handleOpen();
    setIsTolak(true);
    setIdPengaduan(id);
  };

  const getLaporan = async () => {
    setOption(0);
    setLoading(true);
    try {
      const q = query(laporanCollection, orderBy("createAt", "desc")); // Mengurutkan berdasarkan tanggal terbaru dan membatasi jumlah dokumen yang diambil
      const response = await getDocs(q);
      const responseData = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(responseData);
      const data = responseData.map((v) => {
        const validDate = v?.date?.seconds * 1000;
        return {
          ...v,
          ...(validDate ? { date: new Date(validDate).toISOString() } : {}),
        };
      });
      handleClose();
      setLaporan(data);
      setFilteredLaporan(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setTotalPage(Math.ceil(filteredLaporan.length / rowsLimit));
    setCustomPagination(
      Array(Math.ceil(filteredLaporan.length / rowsLimit)).fill(null)
    );
    setRowsToShow(filteredLaporan.slice(0, rowsLimit));
  }, [filteredLaporan]);

  const getTanggapanDetail = async () => {
    try {
      const tanggapanDocRef = doc(db, "tanggapan", idPengaduan);
      const tanggapanDoc = await getDoc(tanggapanDocRef);
      if (tanggapanDoc.exists()) {
        setTanggapanDetail(tanggapanDoc.data());
        // setError(null);
      } else {
        setTanggapanDetail(null);
        // setError("Tanggapan not found");
      }
    } catch (error) {
      console.error("Error fetching tanggapan:", error);
      // setError("Error fetching tanggapan");
    }
  };

  const handleProses = async () => {
    await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Anda akan memproses pengaduan ini",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Proses",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          try {
            await setDoc(doc(tanggapanCollection, idPengaduan), {
              id_pengaduan: idPengaduan,
              deskripsiProses: deskripsi,
              pic: pic,
              status: 2,
              dateProses: Timestamp.now(),
            });
            await updateDoc(doc(laporanCollection, idPengaduan), {
              status: 2,
            });
            await getLaporan();
          } catch (error) {
            console.log(error);
            throw error;
          }
          Swal.fire("Berhasil!");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Gagal!");
      });
  };
  const handleTolak = async () => {
    await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Anda akan menolak pengaduan ini",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Tolak",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          try {
            await setDoc(doc(tanggapanCollection, idPengaduan), {
              deskripsiReject: deskripsi,
              id_pengaduan: idPengaduan,
              status: 4,
              dateReject: Timestamp.now(),
            });
            await updateDoc(doc(laporanCollection, idPengaduan), {
              status: 4,
            });
            await getLaporan();
          } catch (error) {
            console.log(error);
            throw error;
          }
          Swal.fire("Berhasil!");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Gagal!");
      });
  };

  const uploadImage = async () => {
    if (!picture) return null;
    const imageRef = ref(storage, `tanggapan_photos/${picture.name}`);
    await uploadBytes(imageRef, picture);
    const url = await getDownloadURL(imageRef);
    return url;
  };

  const handleSelesai = async () => {
    await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Anda akan menyelesaikan pengaduan ini",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Selesaikan",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          try {
            const pictureUrl = await uploadImage();
            await updateDoc(doc(tanggapanCollection, idPengaduan), {
              deskripsiDone: deskripsi,
              id_pengaduan: idPengaduan,
              status: 3,
              dateDone: Timestamp.now(),
              ...(pictureUrl && { image: pictureUrl }),
            });
            await updateDoc(doc(laporanCollection, idPengaduan), {
              status: 3,
            });
            await getLaporan();
          } catch (error) {
            console.log(error);
            throw error;
          }
          Swal.fire("Berhasil!");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Gagal!");
      });
  };
  const handleClose = () => {
    setIsModalProses(false);
    setIsModalDetail(false);
    setIsModalSelesai(false);
    setIsModalTolak(false);
    setOpenModal(false);
    setIsProses(false);
    setDeskripsi("");
    setPic("");
    setIdPengaduan("");
  };
  const handleOpen = () => {
    setOpenModal(true);
  };
  React.useEffect(() => {
    getLaporan();
  }, []);
  React.useEffect(() => {
    getTanggapanDetail();
  }, [idPengaduan]);
  console.log(tanggapanDetail);

  React.useEffect(() => {
    if (option == 0) {
      setFilteredLaporan(laporan);
    } else if (option == 1) {
      setFilteredLaporan(
        laporan.filter((item) => item.status === 1 || !item.status)
      );
      setRowsToShow(filteredLaporan.slice(0, rowsLimit));
      setCurrentPage(0);
    } else if (option == 2) {
      setFilteredLaporan(laporan.filter((item) => item.status === 2));
      setRowsToShow(filteredLaporan.slice(0, rowsLimit));
      setCurrentPage(0);
    } else if (option == 3) {
      setFilteredLaporan(laporan.filter((item) => item.status === 3));
      setRowsToShow(filteredLaporan.slice(0, rowsLimit));
      setCurrentPage(0);
    } else if (option == 4) {
      setFilteredLaporan(laporan.filter((item) => item.status === 4));
      setRowsToShow(filteredLaporan.slice(0, rowsLimit));
      setCurrentPage(0);
    }
  }, [option]);
  console.log(filteredLaporan);

  const nextPage = () => {
    const startIndex = rowsLimit * (currentPage + 1);
    const endIndex = startIndex + rowsLimit;
    const newArray = filteredLaporan.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(currentPage + 1);
  };
  const changePage = (value) => {
    const startIndex = value * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = filteredLaporan.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(value);
  };
  const previousPage = () => {
    const startIndex = (currentPage - 1) * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = filteredLaporan.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(0);
    }
  };
  React.useMemo(() => {
    setCustomPagination(
      Array(Math.ceil(filteredLaporan?.length / rowsLimit)).fill(null)
    );
  }, [filteredLaporan]);

  const generatePagination = () => {
    const pages = [];
    const pageRange = 4;

    if (totalPage <= 1) return pages;

    // Always include the first page
    pages.push(0);

    // Calculate the range around the current page
    const start = Math.max(currentPage - 1, 1);
    const end = Math.min(currentPage + 1, totalPage - 2);

    // Add the range around the current page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Always include the last page if it's not already included
    if (totalPage > 1) {
      pages.push(totalPage - 1);
    }

    return pages;
  };

  const paginationNumbers = generatePagination();

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loading size="24" /> {/* Increase the size */}
      </div>
    );
  }

  return (
    <div className="text-gray-900">
      <Header title="Pengaduan" />

      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold"></h1>

        <div className="flex space-x-2 w-auto">
          <Select
            onChange={handleChangeOption}
            options={options}
            value={option}
          />
        </div>
      </div>

      <ReusableTable columns={columns} data={rowsToShow} />

      <div>
        <Pagination
          currentPage={currentPage}
          totalPage={Math.ceil(filteredLaporan?.length / rowsLimit)}
          rowsLimit={rowsLimit}
          dataLength={filteredLaporan?.length}
          customPagination={customPagination}
          previousPage={previousPage}
          nextPage={nextPage}
          changePage={changePage}
        />
      </div>

      <Modal
        body={<BodyModal inputs={inputs} />}
        footer={
          <FooterModal
            title={"Submit"}
            onClick={() => {
              if (isProses) {
                handleProses();
              } else if (isTolak) {
                handleTolak();
              } else {
                handleSelesai();
              }
            }}
          />
        }
        onClose={handleClose}
        open={openModal}
        title={"Masukkan Tanggapan"}
      />
      {isModalProses && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-1/3">
            <h1 className="text-xl mb-4 text-center">Proses Pengaduan</h1>
            <label
              htmlFor="Name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              PIC
            </label>
            <input
              className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 mb-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              placeholder="Name"
              value={pic}
              onChange={(e) => setPic(e.target.value)}
            />
            <label
              htmlFor="deskripsi"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Tanggapan
            </label>
            <textarea
              className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="tanggapan"
              rows="3"
              placeholder="Tanggapan"
              type="Tanggapan"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />

            <div className="flex justify-end py-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleProses()}
              >
                Submit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                // onClick={() => setIsModalProses(false)}
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalSelesai && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-1/3">
            <h1 className="text-xl mb-4 text-center">Selesaikan Pengaduan</h1>
            {tanggapanDetail ? (
              <div>
                {/* <pre>{JSON.stringify(tanggapanDetail, null, 2)}</pre> */}

                <label
                  htmlFor="Name"
                  className="block mb-2 text-sm font-medium text-gray-900 flex justify-between"
                >
                  <span>PIC: {tanggapanDetail.pic || "Not Available"}</span>

                  <span>Diproses</span>
                </label>

                <label
                  htmlFor="deskripsi"
                  className="block mb-2 text-sm font-medium text-gray-900 flex justify-between"
                >
                  <span>Deskripsi Proses</span>
                  <span>
                    {dayjs(tanggapanDetail.dateProses?.toDate() || "").format(
                      "DD MMM YYYY HH:mm"
                    )}
                  </span>
                </label>
                <p
                  htmlFor="deskripsi"
                  className="block mb-2 text-sm font-regular text-gray-900"
                >
                  {tanggapanDetail.deskripsiProses}
                </p>
              </div>
            ) : (
              <p></p>
            )}

            <div className="w-full mb-2">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="image"
              >
                Image
              </label>
              <input
                className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="image"
                type="file"
                onChange={(e) => setPicture(e.target.files[0])}
              />
            </div>

            <label
              htmlFor="deskripsi"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Tanggapan
            </label>
            <textarea
              className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="tanggapan"
              rows="3"
              placeholder="Tanggapan"
              type="Tanggapan"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />

            <div className="flex justify-end py-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleSelesai()}
              >
                Submit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                // onClick={() => setIsModalProses(false)}
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalTolak && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-1/3">
            <h1 className="text-xl mb-4 text-center">Tolak Pengaduan</h1>

            <label
              htmlFor="deskripsi"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Deskripsi
            </label>

            <textarea
              className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="penolakan"
              rows="3"
              placeholder="Alasan penolakan"
              type="Penolakan"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />

            <div className="flex justify-end py-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleTolak()}
              >
                Submit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                // onClick={() => setIsModalProses(false)}
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalDetail && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-1/3">
            <h1 className="text-xl mb-4 text-center">Detail Tanggapan</h1>
            {tanggapanDetail ? (
              <div>
                {/* <pre>{JSON.stringify(tanggapanDetail, null, 2)}</pre> */}

                <label
                  htmlFor="Name"
                  className="block mb-2 text-sm font-medium text-gray-900 flex justify-between"
                >
                  <span>PIC: {tanggapanDetail.pic || "Not Available"}</span>

                  <span>Diproses</span>
                </label>

                <label
                  htmlFor="deskripsi"
                  className="block mb-2 text-sm font-medium text-gray-900 flex justify-between"
                >
                  <span>Deskripsi Proses</span>
                  <span>
                    {dayjs(tanggapanDetail.dateProses?.toDate() || "").format(
                      "DD MMM YYYY HH:mm"
                    )}
                  </span>
                </label>
                <p
                  htmlFor="deskripsi"
                  className="block mb-2 text-sm font-regular text-gray-900"
                >
                  {tanggapanDetail.deskripsiProses}
                </p>
                <label
                  htmlFor="deskripsi"
                  className="block  text-sm font-medium text-gray-900 flex justify-between"
                >
                  <span></span>
                  <span>Selesai </span>
                </label>
                <label
                  htmlFor="deskripsi"
                  className="block mb-2 text-sm font-medium text-gray-900 flex justify-between"
                >
                  <span>Deskripsi Selesai</span>
                  <span>
                    {dayjs(tanggapanDetail.dateDone?.toDate() || "").format(
                      "DD MMM YYYY HH:mm"
                    )}
                  </span>
                </label>
                <label
                  htmlFor="deskripsi"
                  className="block mb-2 text-sm font-regular text-gray-900 flex justify-between"
                >
                  <span>{tanggapanDetail.deskripsiDone}</span>
                </label>
                {tanggapanDetail.image && (
                  <Zoom>
                    <img
                      src={tanggapanDetail.image}
                      className="w-32 h-auto object-cover cursor-pointer"
                      style={{ aspectRatio: "16/9" }}
                      onClick={() => {
                        null;
                      }}
                    />
                  </Zoom>
                )}
  
              </div>
            ) : (
              <p></p>
            )}

            <div className="flex justify-end py-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                // onClick={() => setIsModalProses(false)}
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pengaduan;
