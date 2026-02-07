import { useState, useEffect } from "react"
import axios from "axios"

const App = () => {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")

  function fetchNote() {
    axios.get("https://backend-rqn5.onrender.com/notes")
      .then((res) => {
        setNotes(res.data.note)
      })
  }

  useEffect(() => {
    fetchNote()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()

    axios.post("https://backend-rqn5.onrender.com/notes", {
      title,
      description
    }).then(() => {
      fetchNote()
    })

    setTitle("")
    setDescription("")
  }

  function handleDelete(noteId) {
    axios.delete("https://backend-rqn5.onrender.com/notes/" + noteId)
      .then(() => fetchNote())
  }

  function handleEdit() {
    axios.patch(`https://backend-rqn5.onrender.com/notes/${editingNoteId}`, {
      title: editTitle,
      description: editDescription
    })
      .then(() => {
        fetchNote()
        setEditingNoteId(null)
        setEditTitle("")
        setEditDescription("")
      })
      .catch(() => {
        alert("Failed to update note")
      })
  }

  return (
    <div className="min-h-screen bg-zinc-700 p-5">

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 text-white rounded-md w-full sm:w-40 border-2 border-white bg-transparent"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-3 py-2 text-white rounded-md w-full sm:w-70 border-2 border-white bg-transparent"
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
          Create Note
        </button>
      </form>

      {/* NOTES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {notes.map((elem) => (
          <div
            key={elem._id}
            className="bg-zinc-400 rounded-lg p-3 shadow-lg min-h-[120px] w-full"
          >
            <h2 className="text-lg font-semibold truncate">
              {elem.title}
            </h2>

            <h4 className="text-sm mt-1 line-clamp-2">
              {elem.description}
            </h4>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => handleDelete(elem._id)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => {
                  setEditingNoteId(elem._id)
                  setEditTitle(elem.title)
                  setEditDescription(elem.description)
                }}
                className="text-sm bg-green-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingNoteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-4 shadow-xl">
            <h2 className="text-lg font-semibold mb-3">Edit Note</h2>

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 rounded mb-2 border"
              placeholder="Enter Title"
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3 py-2 rounded border resize-none h-24"
              placeholder="Enter Description"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setEditingNoteId(null)
                  setEditTitle("")
                  setEditDescription("")
                }}
                className="px-3 py-1 rounded bg-gray-400 text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleEdit}
                className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
