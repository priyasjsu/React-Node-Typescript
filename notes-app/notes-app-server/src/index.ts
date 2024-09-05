import express, { Request, Response }from "express";
import cors from "cors";
import { getAllNotes, getNoteById, createNote, updateNote, deleteNote } from './models/noteModel';


const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.json({message: "server running on 6000"})
})
app.get("/api/notes", async (req: Request, res: Response) => {
  try {
    const notes = await getAllNotes();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Route to create a new user
app.post('/api/notes', async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const noteId = await createNote(title, content);
    res.status(201).json({ id: noteId, title, content });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.put("/api/notes/:id", async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!title || !content) {
    res.status(400).send("title and content fields required");
  }
  if (!id || isNaN(id)) {
    res.status(400).send("ID must be a valid number");
  }
  try {
    const updatedNote = await updateNote(id, { title, content });
    res.status(201).json(updatedNote);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

app.delete("/api/notes/:id", async(req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).send("ID field required");
  }
  try {
    const result = await deleteNote(id);
    res.status(201).json({result});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
})

app.listen(8080, () => {
  console.log("server running on localhost:8080");
});
