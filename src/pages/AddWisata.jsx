import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/config/config";
import { Editor } from "@tinymce/tinymce-react";

const AddWisata = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [alamat, setAlamat] = useState("");
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);

  const wisataCollection = collection(db, "wisata");

  const handleReset = () => {
    setName("");
    setDescription("");
    setImage(null);
    setAlamat("");
  };

  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/wisata");
  };

  const uploadImage = async () => {
    if (!image) return null;
    const imageRef = ref(storage, `news_photos/${image.name}`);
    await uploadBytes(imageRef, image);
    const url = await getDownloadURL(imageRef);
    return url;
  };

  const createArticle = async () => {
    setLoading(true);
    try {
      const pictureUrl = await uploadImage();
      // const content = editorRef.current.getContent({format: 'text'});
      const content = editorRef.current.getContent();
      await addDoc(wisataCollection, {
        name,
        alamat,
        ...(pictureUrl && { image: pictureUrl }),
        description: content,
        createAt: Timestamp.now(),
      });
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-900 p-4">
      <h1 className="text-3xl mb-4">Add Wisata</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Title"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Alamat
          </label>
          <input
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Author"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <Editor
            apiKey="t4mmxo8tt7788365t4l9rgyevu7rrv2nll2hl11m0skjr5mo"
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={description}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help",
              mode: "textareas",

              force_br_newlines: false,
              force_p_newlines: false,
              forced_root_block: "",
            }}
          />
        </div>
      
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Image
          </label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            onClick={createArticle}
            className="bg-customBlue hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWisata;
