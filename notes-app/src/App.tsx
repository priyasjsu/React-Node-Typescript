import React, { useState, useEffect }  from 'react';
import './App.css';

type Note = {
  id: number,
  title: string,
  content: string
}
const App = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try{
        const response = await fetch("http://localhost:8080/api/notes");
        const notes:Note[] = await response.json();
        setNotes(notes);
      }
      catch(e){
        console.log(e);
      }
    }
    fetchNotes();
  }, [])

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/notes", {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          content
        })});
        const newNote = await response.json();
        setNotes([newNote, ...notes]);
        setTitle("");
        setContent("");
    }catch(e){
      console.log(e)
    }
  }

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if(!selectedNote){
      return;
    }

    const updatedNote = {
      id: selectedNote.id,
      title: title,
      content: content
    }
    try{
      const response = await fetch(`http://localhost:8080/api/notes/${selectedNote.id}`,
      {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
          title,
          content
        })
      });
      const res =  await response.json();
      console.log(res)
      const updatedNotesList = notes.map((note) => (note.id === selectedNote.id? updatedNote: note));
      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    }
    catch(e){
      console.log(e)
    }

  }

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const deletevent = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();
    try {
      await fetch(`http://localhost:8080/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      const updatedNotes = notes.filter((note) => note.id!==noteId);
      setNotes(updatedNotes);
    } catch(e){
      console.log(e)
    }
  }
  
  return(
    <div className='app-container'>
      <form className='note-form' 
        onSubmit = {(event) => ( selectedNote? handleUpdateNote(event) : handleAddNote(event) )} >
        <input 
        value = {title}
        onChange = {(event) => setTitle(event.target.value)}
        placeholder='Title' 
        required />
        <textarea 
        value = {content}
        placeholder="content"
        onChange = {(event) => setContent(event.target.value)}
        required />
        rows={10}
        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
        <div className="note-item" key={note.id} onClick={() => handleNoteClick(note)}>
          <div className="notes-header">
            <button onClick={(e) => deletevent(e, note.id)}>x</button>
          </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
        </div>
        ))}
      </div>
    </div>
  );
};

export default App