import pool from '../db';

interface Note {
    id?: number;
    title: string;
    content: string;
  }

// Function to get all notes
export const getAllNotes = async (): Promise<Note[]> => {
    const [rows] = await pool.query('SELECT * FROM notes');
    return rows as Note[];
  };

// Function to get a note by ID
export const getNoteById = async (id: number): Promise<Note | null> => {
    const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
    const notes = rows as Note[];
    return notes.length ? notes[0] : null;
  };

// Function to create a new note
export const createNote = async (title: string, content: string): Promise<number> => {
    const [result] = await pool.query('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content]);
    return (result as { insertId: number }).insertId;
  };

// Function to update an existing note
export const updateNote = async (id: number, updates: Partial<Note>): Promise<number> => {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.title) {
    fields.push('title = ?');
    values.push(updates.title);
  }

  if (updates.content) {
    fields.push('content = ?');
    values.push(updates.content);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  values.push(id);
  const query = `UPDATE notes SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await pool.query(query, values);
  return (result as {changedRows: number}).changedRows
};

export const deleteNote = async (id: number): Promise<boolean> => {
  const [result] = await pool.query('DELETE from notes where id=?', [id]);
  return (result as { affectedRows: number }).affectedRows > 0;
}

