import React from "react";
import NoteCard from "./NoteCard";

function NoteList({
  notes = [],
  onEdit,
  onDelete,
  onView,
  onTogglePin,
  onArchive,
}) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-100 text-4xl">
          📝
        </div>

        <h3 className="text-xl font-bold text-purple-900">
          No Notes Found
        </h3>

        <p className="mt-2 text-gray-500">
          Create your first note to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* List Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-purple-900">
            My Notes
          </h2>

          <p className="text-sm text-gray-500">
            {notes.length}{" "}
            {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onPin={onTogglePin}
            onArchive={onArchive}
          />
        ))}
      </div>
    </div>
  );
}

export default NoteList;