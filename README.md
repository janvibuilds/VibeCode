# 🧠 Vibecode Editor – AI-Powered Web IDE

![Vibecode Editor Thumbnail](public/vibe-code-editor-thumbnail.svg)

**Vibecode Editor** is a blazing-fast, AI-integrated web IDE built entirely in the browser using **Next.js App Router**, **WebContainers**, **Monaco Editor**, and **local LLMs via Ollama**. It offers real-time code execution, an AI-powered chat assistant, and support for multiple tech stacks — all wrapped in a stunning developer-first UI.

---

## 🚀 Features

- 🔐 **OAuth Login with NextAuth** – Supports Google & GitHub login.
- 🎨 **Modern UI** – Built with TailwindCSS & ShadCN UI.
- 🌗 **Dark/Light Mode** – Seamlessly toggle between themes.
- 🧱 **Project Templates** – Choose from React, Next.js, Express, Hono, Vue, or Angular.
- 🗂️ **Custom File Explorer** – Create, rename, delete, and manage files/folders easily.
- 🖊️ **Enhanced Monaco Editor** – Syntax highlighting, formatting, keybindings, and AI autocomplete.
- 💡 **AI Suggestions with Ollama** – Local models give you code completion on `Ctrl + Space` or double `Enter`. Accept with `Tab`.
- ⚙️ **WebContainers Integration** – Instantly run frontend/backend apps right in the browser.
- 💻 **Terminal with xterm.js** – Fully interactive embedded terminal experience.
- 🤖 **AI Chat Assistant** – Share files with the AI and get help, refactors, or explanations.
- 📦 **GitHub Import** – Import any public GitHub repository directly into the editor.

---

## 🧱 Tech Stack

| Layer         | Technology                                   |
|---------------|----------------------------------------------|
| Framework     | Next.js 15 (App Router)                      |
| Styling       | TailwindCSS, ShadCN UI                       |
| Language      | TypeScript                                   |
| Auth          | NextAuth (Google + GitHub OAuth)             |
| Editor        | Monaco Editor                                |
| AI Suggestion | Ollama (LLMs running locally via Docker)     |
| Runtime       | WebContainers                                |
| Terminal      | xterm.js                                     |
| Database      | MongoDB (via DATABASE_URL)                   |

---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/vibecode-editor.git
cd vibecode-editor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file using the template:

```bash
cp .env.example .env.local
```

Then, fill in your credentials:

```env
AUTH_SECRET=your_auth_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_secret
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_secret
DATABASE_URL=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
```

### 4. Start Local Ollama Model

Make sure [Ollama](https://ollama.com/) and Docker are installed, then run:

```bash
ollama run codellama
```

Or use your preferred model that supports code generation.

### 5. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
.
├── app/                     # App Router-based pages & routes
│   ├── (auth)/              # Authentication pages
│   ├── (root)/              # Landing page
│   ├── api/                 # API routes
│   ├── dashboard/           # Dashboard page
│   ├── playground/          # Code playground
│   └── settings/            # Settings page
├── components/              # UI components
│   ├── modal/               # Modal dialogs
│   ├── providers/           # Context providers
│   └── ui/                  # ShadCN UI components
├── features/                # Feature modules
│   ├── auth/                # Authentication logic
│   ├── dashboard/           # Dashboard components
│   ├── playground/          # Playground logic & components
│   └── webcontainers/       # WebContainer integration
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── prisma/                  # Database schema
├── public/                  # Static assets
├── vibecode-starters/       # Starter templates
├── .env.example             # Example env vars
├── .gitignore               # Git ignore rules
├── LICENSE                  # MIT License
├── CONTRIBUTING.md          # Contributing guidelines
├── CODE_OF_CONDUCT.md       # Code of conduct
└── README.md                # Project documentation
```

---

## 🎯 Keyboard Shortcuts

* `Ctrl + Space` or `Double Enter`: Trigger AI suggestions
* `Tab`: Accept AI suggestion
* `Ctrl + S`: Save current file
* `Ctrl + Shift + S`: Save all files

---

## ✅ What's Included

- ✅ Google & GitHub OAuth authentication
- ✅ 6 project templates (React, Next.js, Express, Vue, Hono, Angular)
- ✅ Monaco Editor with AI autocomplete
- ✅ WebContainers for in-browser code execution
- ✅ Interactive terminal with xterm.js
- ✅ AI chat assistant powered by Ollama
- ✅ GitHub repository import
- ✅ Cloud storage for playgrounds
- ✅ Dark/Light theme support
- ✅ Responsive design

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 🙏 Acknowledgements

* [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
* [Ollama](https://ollama.com/) - Local LLMs
* [WebContainers](https://webcontainers.io/) - Browser-based runtime
* [xterm.js](https://xtermjs.org/) - Terminal emulator
* [NextAuth.js](https://next-auth.js.org/) - Authentication
* [ShadCN UI](https://ui.shadcn.com/) - UI components
* [Tailwind CSS](https://tailwindcss.com/) - Styling
* [Prisma](https://www.prisma.io/) - Database ORM
* [MongoDB](https://www.mongodb.com/) - Database


