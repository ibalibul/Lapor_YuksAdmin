import React, { useEffect, useRef } from "react";
import ReusableTable from "../components/ReusableTable";
import Action from "../components/Action";
import Modal from "../components/Modal";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase/config/config";
import Loading from "../components/Loading";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Swal from "sweetalert2";
import Body from "../components/BodyModal";
import Header from "../components/Header";
import Footer from "../components/FooterModal";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Zoom from "react-medium-image-zoom";
import Pagination from "../components/Pagination";

const Wisata = () => {
  const [open, setOpen] = React.useState(false);
  const [menuStates, setMenuStates] = React.useState({});
  const menuRefs = useRef({});

  const toggleMenu = (itemId) => {
    setMenuStates((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleClickOutside = (event) => {
    Object.keys(menuRefs.current).forEach((itemId) => {
      if (
        menuRefs.current[itemId] &&
        !menuRefs.current[itemId].contains(event.target)
      ) {
        setMenuStates((prev) => ({
          ...prev,
          [itemId]: false,
        }));
      }
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isEdit, setIsEdit] = React.useState(false);
  const [dataArtikel, setDataArtikel] = React.useState([]);
  const [id, setId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [deskripsi, setDeskripsi] = React.useState("");
  const [picture, setPicture] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const wisataCollection = collection(db, "wisata");

  const [rowsLimit] = React.useState(5);
  const [rowsToShow, setRowsToShow] = React.useState([]);
  const [customPagination, setCustomPagination] = React.useState([]);
  const [totalPage, setTotalPage] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(0);

  const inputs = [
    { label: "Judul", value: title, setValue: setTitle, type: "text" },
    {
      label: "Deskripsi",
      value: deskripsi,
      setValue: setDeskripsi,
      type: "textarea",
    },
    {
      label: isEdit ? (picture ? "Ganti Gambar" : "Gambar") : "Gambar",
      value: picture,
      setValue: setPicture,
      type: "file",
    },
    { label: "Author", value: author, setValue: setAuthor, type: "text" },
  ];
  const handleReset = () => {
    setTitle("");
    setDeskripsi("");
    setPicture("");
    setAuthor("");
    setId("");
  };
  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    handleReset();
  };
  const uploadImage = async () => {
    if (!picture.name) return;
    const imageRef = ref(storage, `wisata_photos/${picture.name}`);
    await uploadBytes(imageRef, picture);
  };
  const getImageUrl = async () => {
    if (!picture.name) return;
    const imageRef = ref(storage, `wisata_photos/${picture.name}`);
    const url = await getDownloadURL(imageRef);
    return url;
  };
  const navigate = useNavigate();
  const handleOpened = () => navigate("/add-wisata");
  const handleDelete = async (row) => {
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(wisataCollection, row.id));
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          await getWisata();
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  const handleEdit = async () => {
    try {
      await uploadImage();
      const pictureUrl = await getImageUrl();
      await updateDoc(doc(wisataCollection, id), {
        title,
        author,
        ...(!!pictureUrl && { image: pictureUrl }),
        deskripsi,
        date: Timestamp.now(),
      });
      await getWisata();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleOpenedEdit = (item) => {
    navigate("/edit-wisata", { state: { item } });
  };
  const getWisata = async () => {
    setLoading(true);
    try {
      const q = query(wisataCollection, orderBy("createAt", "desc"));
      const response = await getDocs(q);
      const responseData = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const data = responseData.map((v) => {
        const validDate = v?.date?.seconds * 1000;
        return {
          ...v,
          ...(validDate ? { date: new Date(validDate).toISOString() } : {}),
        };
      });
      setDataArtikel(data);
      console.log(data);
      setLoading(false);
      // Ensure to stop loading after data is fetched
      setTotalPage(Math.ceil(data.length / rowsLimit));
      setCustomPagination(Array(Math.ceil(data.length / rowsLimit)).fill(null));
      setRowsToShow(data.slice(0, rowsLimit));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const createArticle = async () => {
    setLoading(true);
    try {
      await uploadImage();
      const pictureUrl = await getImageUrl();
      await addDoc(wisataCollection, {
        title,
        author,
        ...(!!pictureUrl && { image: pictureUrl }),
        deskripsi,
        date: Timestamp.now(),
      });
      await getWisata();
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    {
      key: "image",
      title: "Image",
      render: ({ value }) => (
        <Zoom>
          <img
            src={value}
            alt="ArtikelImage"
            className="w-16 h-auto object-cover cursor-pointer"
            style={{ aspectRatio: "16/9" }}
            onClick={() => {
              null;
            }}
          />
        </Zoom>
      ),
    },
    { key: "name", title: "Nama" },
    {
      key: "description",
      title: "Deskripsi",
      render: ({ value }) => (
        <div dangerouslySetInnerHTML={{ __html: value }} />
      ),
    },
    { key: "alamat", title: "Alamat" },

    // { key: "deskripsi", title: "Deskripsi" },
    // {
    //   key: "createAt",
    //   title: "Date",
    //   render: ({ value }) => {
    //     const date = new Date(value.seconds * 1000 + value.nanoseconds / 1e6); // Konversi ke milidetik
    //     return <p>{dayjs(date).format("DD MMM YYYY, HH:mm")}</p>;
    //   },
    // },
    {
      key: "action",
      title: "",
      render: ({ row }) => (
        <Action row={row} onDelete={handleDelete} onEdit={handleOpenedEdit} />
      ),
    },
  ];
  useEffect(() => {
    getWisata();
  }, []);

  const nextPage = () => {
    const startIndex = rowsLimit * (currentPage + 1);
    const endIndex = startIndex + rowsLimit;
    const newArray = dataArtikel.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(currentPage + 1);
  };
  const changePage = (value) => {
    const startIndex = value * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = dataArtikel.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(value);
  };
  const previousPage = () => {
    const startIndex = (currentPage - 1) * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = dataArtikel.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(0);
    }
  };
  React.useMemo(() => {
    setCustomPagination(
      Array(Math.ceil(dataArtikel?.length / rowsLimit)).fill(null)
    );
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loading size="24" /> {/* Increase the size */}
      </div>
    );
  }

  return (
    <div className="text-gray-900">
      <Header title="Wisata" />

      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl"></h1>
        <button
          type="button"
          // onClick={handleOpen}
          onClick={handleOpened}
          className="bg-customBlue hover:bg-blue-400 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-auto"
        >
          Add
        </button>
      </div>

      <ReusableTable columns={columns} data={rowsToShow} />

      <div>
        <Pagination
          currentPage={currentPage}
          totalPage={Math.ceil(dataArtikel?.length / rowsLimit)}
          rowsLimit={rowsLimit}
          dataLength={dataArtikel?.length}
          customPagination={customPagination}
          previousPage={previousPage}
          nextPage={nextPage}
          changePage={changePage}
        />
      </div>

      {/* <Modal
        open={open}
        title={isEdit ? "Edit Artikel" : "Create Artikel"}
        body={<Body inputs={inputs} />}
        onClose={handleClose}
        footer={
          <Footer
            title={isEdit ? "Edit" : "Create"}
            onClick={isEdit ? handleEdit : createArticle}
          />
        }
      /> */}
    </div>
  );
};

export default Wisata;
