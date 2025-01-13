import React, { useState } from 'react';

const CustomDropdown = ({ options, value, onChange, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div className="relative inline-block w-full">
      <div
        className="border border-gray-500 rounded py-3 px-4 bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || 'Select a category'}
      </div>
      {isOpen && (
        <div className="absolute w-full mt-1 border border-gray-500 rounded bg-white z-10">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between py-2 px-4 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleOptionClick(option.name)}
            >
              <span>{option.name}</span>
              <button
                className="text-red-500 ml-2"
                onClick={(e) => handleDeleteClick(e, option.id)}
              >
                Delete
              </button>
            </div>
          ))}
          <div
            className="flex items-center justify-between py-2 px-4 hover:bg-gray-200 cursor-pointer"
            onClick={() => handleOptionClick('addCategory')}
          >
            <span>tambah kategori</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
