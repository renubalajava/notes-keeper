import React, { useEffect, useState } from "react";

function NoteForm({ note, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Personal");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setCategory(note.category || "Personal");
      setTags(note.tags ? note.tags.join(", ") : "");
    } else {
      setTitle("");
      setContent("");
      setCategory("Personal");
      setTags("");
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter title and content.");
      return;
    }

    const noteData = {
      ...note,
      id: note?.id || Date.now(),
      title: title.trim(),
      content: content.trim(),
      category,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      updatedAt: new Date().toISOString(),
    };

    onSave(noteData);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-purple-900">
              {note ? "Edit Note" : "Create New Note"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {note
                ? "Update your existing note"
                : "Capture your thoughts and ideas"}
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
            📝
          </div>
        </div>

        {/* Title */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Note Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
          />
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Study">Study</option>
            <option value="Ideas">Ideas</option>
            <option value="Important">Important</option>
          </select>
        </div>

        {/* Content */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Content
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            rows="10"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags
          </label>

          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="react, javascript, project"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
          />

          <p className="text-xs text-gray-400 mt-1">
            Separate multiple tags with commas
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition"
          >
            {note ? "Update Note" : "Save Note"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoteForm;