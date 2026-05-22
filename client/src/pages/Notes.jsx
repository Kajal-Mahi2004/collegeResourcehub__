import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";

import "./Notes.css";

const Notes = () => {

  const [notes, setNotes] = useState([]);


  const fetchNotes = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/notes/all"
      );

      setNotes(res.data);

    } catch (error) {

      console.log(error);
    }
  };


  useEffect(() => {

    fetchNotes();

  }, []);


  return (

    <>

      <Navbar />

      <div className="notes-container">

        <h1>All Notes</h1>

        <div className="notes-grid">

          {
            notes.map((note) => (

              <div className="note-card" key={note._id}>

                <h2>{note.title}</h2>

                <p>{note.subject}</p>

                <a
                  href={`http://localhost:5000/uploads/${note.fileUrl}`}
                  target="_blank"
                >
                  Download PDF
                </a>

              </div>
            ))
          }

        </div>

      </div>

    </>
  );
};

export default Notes;