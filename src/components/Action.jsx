const Action = ({
  row,
  onEdit,
  onDelete,
  labelEdit,
  labelDelete,
  classEdit,
  classDelete,
  hideEdit,
  hideDelete,
}) => {
  return (
    // <div className="flex">
    <div className="flex space-x-2 justify-end">
      {!hideEdit && (
        <button
          onClick={() => onEdit(row)}
          className="text-sm bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
          {...classEdit}
        >
          {labelEdit || "Edit"}
        </button>
      )}
      {!hideDelete && (
        <button
          onClick={() => onDelete(row)}
          // className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
          {...classDelete}
        >
          {labelDelete || "Delete"}
        </button>
      )}
    </div>
  );
};

export default Action;
