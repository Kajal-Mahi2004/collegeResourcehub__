import { useEffect, useState } from "react";
import api from "../services/api";

import Navbar from "../components/Navbar";

import "./Notes.css";

const Notes = () => {

  const [notes, setNotes] = useState([]);


  const fetchNotes = async () => {

    try {

      const res = await api.get("/notes/all");

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
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in New Tab
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