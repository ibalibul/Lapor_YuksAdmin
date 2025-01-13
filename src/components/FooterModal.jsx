const FooterModal = ({ title, onClick }) => {
  return (
    <div className="w-full">
      <button
        onClick={onClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded"
      >
        {title}
      </button>
    </div>
  );
};

export default FooterModal;
