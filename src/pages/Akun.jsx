import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/config/config";
import {
  addDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setToken, setUid } from "../services/api";
import { useAuthContext } from "../context/authContext/useAuthContext";
import Loading from "../components/Loading";
import Header from "../components/Header";
import Swal from "sweetalert2";
import TableComponent from "../components/TableComponent";

const Akun = () => {
  const [loading, setLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [listUser, setListUSer] = useState([]);
  const userCollection = collection(db, "user");

  const [rowsLimit] = useState(5);
  const [rowsToShow, setRowsToShow] = useState([]);
  const [customPagination, setCustomPagination] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const addUserWithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User created:", user);
      await updateProfile(user, {
        displayName: name,
      });
      const uuid = user.uid;

      const userDocRef = doc(userCollection, uuid);

      await setDoc(userDocRef, {
        name: name,
        email: email,
        uid: uuid,
        roleType: "admin",
      });

      setIsModalOpen(false);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Akun Admin telah ditambahkan!",
        text: "",
      });

      await getAdmins();

      return user;
    } catch (error) {
      setIsModalOpen(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      });
      console.error("Error adding user:", error);
      throw error;
    }
  };

  const getAdmins = async () => {
    setLoading(true);
    try {
      const response = await getDocs(userCollection);
      const responseData = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Filter users with role 'admin'
      const adminUsers = responseData.filter((user) => user.roleType === "admin");
      //   const adminUsers = responseData;

      setLoading(false); // Ensure to stop loading after data is fetched
      setAdminUsers(adminUsers);
      return adminUsers;
    } catch (error) {
      console.log(error);
      setLoading(false); // Ensure to stop loading in case of error
    }
  };

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await getDocs(userCollection);
      const responseData = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const users = responseData.filter((user) => user.roleType === "user");

      setLoading(false);
      setListUSer(users); // Ensure to stop loading after data is fetched
      setTotalPage(Math.ceil(users.length / rowsLimit));
      setCustomPagination(
        Array(Math.ceil(users.length / rowsLimit)).fill(null)
      );
      setRowsToShow(users.slice(0, rowsLimit)); // Initially set rowsToShow // Ensure to stop loading after data is fetched

      return users;
    } catch (error) {
      console.log(error);
      setLoading(false); // Ensure to stop loading in case of error
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const admin = await getAdmins(setLoading);
      setAdminUsers(admin);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers(setLoading);
      setListUSer(users);
    };

    fetchUsers();
  }, []);

  const nextPage = () => {
    const startIndex = rowsLimit * (currentPage + 1);
    const endIndex = startIndex + rowsLimit;
    const newArray = listUser.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(currentPage + 1);
  };
  const changePage = (value) => {
    const startIndex = value * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = listUser.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(value);
  };
  const previousPage = () => {
    const startIndex = (currentPage - 1) * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = listUser.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(0);
    }
  };
  React.useMemo(() => {
    setCustomPagination(
      Array(Math.ceil(listUser?.length / rowsLimit)).fill(null)
    );
  }, []);

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
          await deleteDoc(doc(userCollection, row.id));
          Swal.fire("Deleted!", "User has been deleted.", "success");
          // await getUsers();
          // Update listUser directly to remove the deleted item
          setListUSer((prevList) =>
            prevList.filter((user) => user.id !== row.id)
          );

          // Update rowsToShow to reflect the modified data on current page
          // Ensure listUser is updated before slicing for rowsToShow
          const updatedListUser = listUser.filter((user) => user.id !== row.id);
          const startIndex = currentPage * rowsLimit;
          const endIndex = startIndex + rowsLimit;

          setTotalPage(Math.ceil(updatedListUser.length / rowsLimit));
          setCustomPagination(
            Array(Math.ceil(updatedListUser.length / rowsLimit)).fill(null)
          );

          setRowsToShow(updatedListUser.slice(startIndex, endIndex));
          await getAdmins();
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loading size="24" /> {/* Increase the size */}
      </div>
    );
  }

  return (

    <div className="text-gray-900">
      <Header title="Akun"/>
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl">Admin</h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-customBlue hover:bg-blue-400 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-auto"
        >
          Add
        </button>
      </div>
      {/* <div className="px-3 py-4 flex justify-center"></div> */}
      <div className="container mx-auto p-4">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="text-left p-3 px-5">Name</th>
                  <th className="text-left p-3 px-5">Email</th>
                  <th className="text-left p-3 px-5">Role</th>
                  <th className="text-right p-3 px-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 bg-gray-60"
                  >
                    <td className="p-3 px-5">{user.name}</td>
                    <td className="p-3 px-5">{user.email}</td>
                    <td className="p-3 px-5">{user.roleType}</td>

                    {/* <td className="p-3 px-5 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      >
                        Delete
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-1/3">
            <h1 className="text-xl mb-4 text-center">Add Admin</h1>
            <label
              htmlFor="Name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Name
            </label>
            <input
              className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 mb-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 mb-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 mb-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={addUserWithEmail}
              >
                Add
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl">User</h1>
      </div>
      <div className="container mx-auto p-4">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left   tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left  tracking-wider">Role</th>
                  <th className="px-6 py-3 text-right tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rowsToShow?.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 bg-gray-60"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.roleType}
                      </div>
                    </td>

                    <td className="px-6 py-4  flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-full  flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-1.5 px-4 items-center">
        <div className="text-lg">
          Showing {currentPage == 0 ? 1 : currentPage * rowsLimit + 1} to{" "}
          {currentPage == totalPage - 1
            ? listUser?.length
            : (currentPage + 1) * rowsLimit}{" "}
          of {listUser?.length} entries
        </div>
        <div className="flex">
          <ul
            className="flex justify-center items-center gap-x-[10px] z-30"
            role="navigation"
            aria-label="Pagination"
          >
            <li
              className={` prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${
                currentPage == 0
                  ? "bg-[#cccccc] pointer-events-none"
                  : " cursor-pointer"
              }
            `}
              onClick={previousPage}
            >
              <img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
            </li>
            {customPagination?.map((data, index) => (
              <li
                className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-[1px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${
                  currentPage == index
                    ? "text-blue-600  border-sky-500"
                    : "border-[#E4E4EB] "
                }`}
                onClick={() => changePage(index)}
                key={index}
              >
                {index + 1}
              </li>
            ))}
            <li
              className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
                currentPage == totalPage - 1
                  ? "bg-[#cccccc] pointer-events-none"
                  : " cursor-pointer"
              }`}
              onClick={nextPage}
            >
              <img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
            </li>
          </ul>
        </div>
      </div>

      {/* <div className="px-3 py-4 flex justify-center"></div> */}
      {/* <div className="px-3 py-4 flex justify-center"> */}
      {/* <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="w-full text-md bg-white shadow-md rounded mb-4">
          <tbody>
            <tr className="border-b">
              <th className="text-left p-3 px-5">Name</th>
              <th className="text-left p-3 px-5">Email</th>
              <th className="text-left p-3 px-5">Role</th>
              <th className="text-right p-3 px-5">Action</th>
            </tr>
            {listUser.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-orange-100 bg-gray-100"
              >
                <td className="p-3 px-5">{user.name}</td>
                <td className="p-3 px-5">{user.email}</td>
                <td className="p-3 px-5">{user.roleType}</td>

                <td className="p-3 px-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(user)}
                    className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default Akun;
