import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface NoteItem {
  id: string;
  text: string;
  createdAt: string;
}

const Notes = () => {
  // Notes state (wire to /api/notes endpoints when ready)
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [noteInput, setNoteInput] = useState("");

  function handleAddNote(e: FormEvent) {
    e.preventDefault();
    const trimmed = noteInput.trim();
    if (!trimmed) return;

    setNotes((prev) => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        createdAt: new Date().toLocaleDateString(),
      },
      ...prev,
    ]);
    setNoteInput("");
    toast.success("Note added");
  }

  function handleDeleteNote(id: string) {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAddNote} className="flex gap-2">
        <input
          type="text"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Write a quick note..."
          className="flex-1 border border-slate-300 rounded-md h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
        />
        <button
          type="submit"
          className="bg-[#009577] hover:bg-[#007d63] text-white px-4 rounded-md text-sm font-semibold flex items-center gap-1.5 transition"
        >
          <FiPlus size={16} />
          Add
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">
          No notes yet. Add one above to get started.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex items-center justify-between gap-3 p-3 rounded-md border border-slate-200 bg-slate-50"
            >
              <div>
                <p className="text-sm text-slate-800">{note.text}</p>
                <span className="text-xs text-slate-400">{note.createdAt}</span>
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-slate-400 hover:text-red-500 p-1 transition"
                aria-label="Delete note"
              >
                <FiTrash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notes;
