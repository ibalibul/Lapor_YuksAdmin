import React, { useEffect, useRef } from "react";
import CustomDropdown from "./CustomDropdown";

const EditUMKMForm = ({
  formData,
  handleChange,
  categories,
  addCategory,
  deleteCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");

  const handleCategoryChange = (e) => {
    if (e.target.value === "addCategory") {
      setIsModalOpen(true);
    } else {
      handleChange(e, "category");
    }
  };

  const handleAddCategory = () => {
    addCategory(newCategory);
    setNewCategory("");
    setIsModalOpen(false);
  };

  return (
    <form className="w-full ">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange(e, "name")}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="category"
          >
            Kategori
          </label>
          <select
            className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="category"
            value={formData.category}
            onChange={handleCategoryChange}
            // onChange={(e) => handleChange(e, "category")}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
            <option value="addCategory">tambah kategori</option>
          </select>
        </div>
      </div>
      {/* <div className="w-full md:w-1/2 px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="category"
          >
            Kategori
          </label>
          <CustomDropdown
            options={categories}
            value={formData.category}
            onChange={handleCategoryChange}
            onDelete={deleteCategory}
          />
        </div> */}
      {/* </div> */}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-1/3">
            <h2 className="text-xl mb-4">Add New Category</h2>
            <input
              className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 mb-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleAddCategory}
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
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="description"
          >
            Deskripsi
          </label>
          <textarea
            className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="description"
            rows="3"
            type="text"
            value={formData.description}
            onChange={(e) => handleChange(e, "description")}
          />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="address"
          >
            Alamat
          </label>
          <textarea
            className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="address"
            rows="3"
            type="text"
            value={formData.address}
            onChange={(e) => handleChange(e, "address")}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="operationalHours"
          >
            Jam Operasional
          </label>
          <input
            className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="operationalHours"
            type="text"
            value={formData.operationalHours}
            onChange={(e) => handleChange(e, "operationalHours")}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="phone"
          >
            Nomor Telp
          </label>
          <input
            className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="phone"
            type="number"
            value={formData.phone}
            onChange={(e) => handleChange(e, "phone")}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
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
            onChange={(e) => handleChange(e, "image")}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="priceRange"
          >
            Harga
          </label>
          <input
            className="appearance-none block w-full text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="priceRange"
            type="text"
            value={formData.priceRange}
            onChange={(e) => handleChange(e, "priceRange")}
          />
        </div>
      </div>
    </form>
  );
};

export default EditUMKMForm;
