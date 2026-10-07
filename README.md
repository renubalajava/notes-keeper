# 📝 Notes Keeper – Smart Notes Organizer

A modern, responsive, full-stack notes management application that helps users create, organize, search, edit, archive, and manage personal notes efficiently.

The application provides a rich-text editor, notebooks, colour-coded tags, pinning, smart search, archive/restore functionality, auto-save, AI-assisted writing tools, and voice features.

---

## 🚀 Project Overview

**Notes Keeper** is designed as a personal productivity application where authenticated users can securely manage their notes.

Users can:

- Create and edit notes
- Format notes using a rich-text editor
- Organize notes into notebooks
- Add colour-coded tags
- Pin important notes
- Search notes intelligently
- Switch between Grid and List views
- Archive notes
- Restore archived notes
- Permanently delete notes
- Automatically save changes
- Use AI-assisted note tools
- Use voice input and text-to-speech

---

## ✨ Features

### 🔐 Authentication

- User Registration
- User Login
- Forgot Password
- Reset Password
- Protected Routes
- User-specific notes
- Role-based Admin Route

---

### 📝 Note Management

Users can:

- Create new notes
- View existing notes
- Edit notes
- Delete notes
- Save notes manually
- Automatically save changes
- Track the last edited time

Each note supports:

- Title
- Rich-text content
- Notebook
- Colour tag
- Tag colour
- Note background colour
- Pin status
- Archive status
- Created date
- Updated date

---

### ✍️ Rich Text Editor

The application uses **ReactQuill** for rich-text editing.

Supported formatting includes:

- Heading 1
- Heading 2
- Heading 3
- Bold
- Italic
- Underline
- Strike
- Ordered Lists
- Bullet Lists
- Text Alignment
- Blockquotes
- Links
- Clear Formatting

---

### 📁 Notebooks

Notes can be organized into notebooks such as:

- Personal
- Work
- Study
- Ideas
- Projects

Users can select a notebook while creating or editing a note.

Notebook information is maintained per user.

---

### 🏷️ Colour-Coded Tags

Users can add custom tags to notes.

Examples:

- Java
- Work
- Study
- Project
- Ideas

Users can also select a custom colour for each tag.

---

### 📌 Pin Notes

Important notes can be pinned for quick access.

Pinned notes can be viewed from the dedicated **Pinned Notes** section.

---

### 🔎 Smart Search

Users can search notes using:

- Note title
- Note content
- Notebook
- Tag

Search results highlight matching text in the note list.

---

### 🗃️ Archive & Restore

Instead of immediately deleting a note, users can archive it.

Archived notes can be:

- Viewed
- Searched
- Restored
- Permanently deleted

---

### 🖥️ Grid & List View

Users can switch between:

- Grid View
- List View

This provides a flexible way to browse notes.

---

### 💾 Auto-Save

Notes are automatically saved after the user stops making changes.

The editor uses a short delay before saving changes to avoid unnecessary API calls.

A **Last Edited** timestamp is displayed in the editor.

---

### 🤖 AI Assistant

The Note Editor includes smart writing tools:

#### Summarize Note
Creates a short summary of the note content.

#### Improve Writing
Improves the text formatting and basic readability.

#### Generate Title
Generates a title based on the note content.

#### Generate Tags
Suggests a category/tag based on the note content.

---

### 🎙️ Voice Features

The application supports browser-based speech features.

#### Voice Input

Users can speak and insert the recognized text directly into the note editor.

#### Read Aloud

The note content can be converted to speech using browser Text-to-Speech.

#### Stop Audio

Users can stop the currently playing speech.

---
---

## 👨‍💼 Admin Dashboard

Notes Keeper includes a dedicated Admin Dashboard for managing and monitoring the application.

The Admin Dashboard is accessible only to users with the **Admin role**.

### 🔐 Admin Access

Admin route:

```text
/admin
## 🛠️ Technologies Used

### Frontend

- React.js
- React Router DOM
- ReactQuill
- Tailwind CSS
- Lucide React
- JavaScript
- HTML5
- CSS3

### Backend / API

- REST API
- JSON Server / API backend
- Fetch/Axios based API communication

### Development Tools

- Visual Studio Code
- Node.js
- npm
- Git
- GitHub
- Postman

---

## 📂 Project Structure

```text
Notes-Keeper/
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── NoteCard.jsx
│   │   ├── NoteEditor.jsx
│   │   ├── NoteForm.jsx
│   │   ├── NotebookSidebar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SearchBar.jsx
│   │   ├── TagBadge.jsx
│   │   ├── Toast.jsx
│   │   └── ViewToggle.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AllNotes.jsx
│   │   ├── Archive.jsx
│   │   ├── Pinned.jsx
│   │   ├── NotebookView.jsx
│   │   ├── AIChat.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
│
├── db.json
├── package.json
├── package-lock.json
├── README.md
└── .gitignore