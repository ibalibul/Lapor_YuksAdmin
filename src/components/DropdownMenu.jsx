import React, { useState } from 'react';

const DropdownMenu = ({ onDelete, onEdit }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
      <button
        onClick={onDelete}
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
      >
        Delete
      </button>
      <button
        onClick={onEdit}
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
      >
        Edit
      </button>
    </div>
  );
};

export default DropdownMenu;