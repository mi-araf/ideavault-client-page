# 💡 IdeaVault

A modern startup idea sharing platform where users can explore, submit, bookmark, and discuss startup ideas.  
IdeaVault is built with **Next.js**, **Express.js**, **MongoDB**, **Better Auth**, **Google Login**, and **JWT authentication**.

🌐 **Live Website:** https://ideavault-client-page.vercel.app/  
📦 **Client Repository:** https://github.com/mi-araf/ideavault-client-page   
📚 **Server Repository:** https://github.com/mi-araf/ideavault-server-side

---

## ✨ About IdeaVault

IdeaVault is a full-stack web application designed for people who love startup ideas, innovation, and creative problem solving.

Users can browse startup ideas, view details, comment on ideas, bookmark their favorite ideas, and manage their own submitted ideas. The project also includes private routes, authentication, JWT-protected API routes, and a responsive user-friendly interface.

---

## 🚀 Main Features

### 🌍 Public Features

- 🏠 Beautiful homepage with banner and sections
- 🔥 Trending ideas section
- 💡 Browse all startup ideas
- 🔎 Search ideas by title
- 🗂️ Filter ideas by category
- 📅 Filter ideas by date range
- 📱 Fully responsive design
- 🌙 Dark mode support

### 🔐 Authentication Features

- 📧 Email/password registration
- 🔑 Email/password login
- 🌐 Google login
- 🪪 JWT token generation
- 💾 Token stored on client side
- 🛡️ Protected private routes
- 🚪 Logout system

### 👤 Private User Features

- ➕ Add new startup idea
- 📄 View full idea details
- 💬 Add comments
- ✏️ Edit own comments
- 🗑️ Delete own comments
- 🔖 Bookmark/unbookmark ideas
- 📚 View bookmarked ideas
- 🧠 View own submitted ideas
- 🛠️ Update own ideas
- ❌ Delete own ideas
- 🗨️ View commented ideas in My Interactions
- 👤 Profile page with user information and activity summary

---

### 🧠 Challenges Faced:

While building this project, I worked through several real-world development challenges:

- 🔐 Setting up Better Auth
- 🌐 Adding Google login
- 🪪 Generating JWT tokens
- 🛡️ Protecting private Express routes
- 🍃 Connecting MongoDB with both auth and app data
- 💬 Building comment edit/delete authorization
- 🔖 Creating bookmark toggle functionality
- 🔍 Implementing search with MongoDB $regex
- 📱 Making pages responsive
- 🧪 Fixing production build issues
- 🚀 Deploying the project


---
### 🌱 Future Upgrades:
Here are some features I would like to add next:

- ❤️ Like system
- 🔔 Notification system
- 📊 Advanced dashboard analytics
- 🧾 Pagination for ideas
- 🖼️ Image upload instead of image URL
- 🧑‍💼 User role system
- 🛡️ Admin dashboard
- ✉️ Email verification
- 🔁 Password reset
- 📝 Rich text editor for idea descriptions
- 🔍 Advanced sorting by popularity, newest, and most commented
- 🌍 Public user profile pages
- 🧪 More validation and error handling
- ⚡ Performance optimization
- 🎨 More polished UI animations

---

## 📄 Pages

| Page | Description |
| --- | --- |
| `/` | Homepage |
| `/ideas` | All ideas with search and filter |
| `/ideas/[id]` | Private idea details page |
| `/add-idea` | Private page to submit a new idea |
| `/my-ideas` | Private dashboard for user-created ideas |
| `/my-interactions` | Private page for commented ideas |
| `/bookmarks` | Private bookmarked ideas page |
| `/profile` | Private user profile page |
| `/login` | Login page |
| `/register` | Registration page |

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ Next.js
- ⚛️ React
- 🟨 JavaScript
- 🎨 Tailwind CSS
- 🌼 daisyUI
- 🎯 Lucide React Icons
- 🔔 Sonner Toast
- 🔐 Better Auth Client
- 🛡️ JWT handling

### Backend

- 🟢 Node.js
- 🚀 Express.js
- 🍃 MongoDB
- 🧩 MongoDB Native Driver
- 🌐 CORS
- 🔒 dotenv
- 🛡️ JSON Web Token

### Authentication

- 🔐 Better Auth
- 📧 Email/password authentication
- 🌐 Google OAuth
- 🛡️ JWT authorization for private API routes

### Deployment

- ▲ Frontend deployed on Vercel
- 🍃 Database hosted on MongoDB Atlas

---


## 🙋‍♂️ Author

---> MI Araf

Aspiring web developer passionate about building useful, modern, and user-friendly full-stack applications.

GitHub: https://github.com/mi-araf

---

## 💙 Made with love by MI Araf