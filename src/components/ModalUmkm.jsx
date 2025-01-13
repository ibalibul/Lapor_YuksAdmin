import { AiOutlineClose } from 'react-icons/ai';

const ModalUmkm = ({ body, footer, onClose, open, title }) => {
  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl relative">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <button onClick={onClose} className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700">
          <AiOutlineClose />
        </button>
        <div className="mb-4">
          {body}
        </div>
        {footer && (
          <div className="mt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalUmkm;