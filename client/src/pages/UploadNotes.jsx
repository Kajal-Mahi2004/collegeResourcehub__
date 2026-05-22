import { useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";

import "./UploadNotes.css";

const UploadNotes = () => {

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);


  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("file", file);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/notes/upload",
        formData
      );

      alert(res.data.message);

    } catch (error) {

      alert("Upload failed");
    }
  };


  return (

    <>

      <Navbar />

      <div className="upload-container">

        <form className="upload-form" onSubmit={handleSubmit}>

          <h1>Upload Notes</h1>

          <input
            type="text"
            placeholder="Enter title"
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter subject"
            onChange={(e) => setSubject(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit">
            Upload PDF
          </button>

        </form>

      </div>

    </>
  );
};

export default UploadNotes;