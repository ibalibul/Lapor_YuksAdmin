import React from "react";

const Pagination = ({
  currentPage,
  totalPage,
  rowsLimit,
  dataLength,
  customPagination,
  previousPage,
  nextPage,
  changePage
}) => {
  return (
    <div className="w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-1.5 px-4 items-center">
      <div className="text-lg">
        Showing {currentPage === 0 ? 1 : currentPage * rowsLimit + 1} to{" "}
        {currentPage === totalPage - 1 ? dataLength : (currentPage + 1) * rowsLimit}{" "}
        of {dataLength} entries
      </div>
      <div className="flex">
        <ul
          className="flex justify-center items-center gap-x-[10px] z-30"
          role="navigation"
          aria-label="Pagination"
        >
          <li
            className={`prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
              currentPage === 0 ? "bg-[#cccccc] pointer-events-none" : "cursor-pointer"
            }`}
            onClick={previousPage}
          >
            <img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
          </li>
          {customPagination?.map((data, index) => (
            <li
              className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-[1px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${
                currentPage === index ? "text-blue-600 border-sky-500" : "border-[#E4E4EB]"
              }`}
              onClick={() => changePage(index)}
              key={index}
            >
              {index + 1}
            </li>
          ))}
          <li
            className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
              currentPage === totalPage - 1 ? "bg-[#cccccc] pointer-events-none" : "cursor-pointer"
            }`}
            onClick={nextPage}
          >
            <img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
