

// components/ReusableTable.js
const ReusableTable = ({ columns, data }) => {
  return (
    <div className=" bg-white shadow overflow-hidden sm:rounded-lg  mb-4">
      <div className=" flex justify-center">
        <table className="w-full text-md bg-white shadow-md rounded">
          <thead className="bg-gray-50">
            <tr className="border-b bg-gray-200">
              {/* <th className="text-left p-3 px-5">No</th> */}
              {columns.map((column) => (
                <th key={column.key} className="text-left p-3 px-5">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                // className={rowIndex % 2 === 0 ? "bg-gray-50" : ""}
                className="border-b hover:bg-gray-50 bg-gray-60"
                
              >
                {/* <td className="border border-gray-300 px-4 py-2 text-center">
                  {rowIndex + 1}
                </td> */}
                {columns.map((column) => (
                  <td key={column.key} className="p-3 px-5">
                    {typeof column.render === "function"
                      ? column.render({ value: row[column.key], row })
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReusableTable;
