# Intel AI Image Journaling

A Progressive Web App to capture, organize, and share your photos with AI-powered captions.

Built with Vite, React, Tailwind CSS, Dexie (IndexedDB), and the OpenAI API.

---

## Features

- 📸 **Camera Capture**: Snap photos directly in-app (front/back camera support).
- 🖼️ **Gallery View**: Browse, label, and delete photos.
- 📅 **Calendar View**: See photos laid out by date.
- 💾 **Download**: Export selected photos as a ZIP archive.
- 🎨 **Theming**: Light/dark mode and custom color pickers.
- 🤖 **AI Assistant**: (Optional) Auto-generate one-sentence captions for unlabeled photos.
- ⚙️ **Settings**: Tweak theme, clear cache, or switch AI model settings.

---

## Getting Started

### Prerequisites

- **Node.js** v16 or later
- **npm** v8 or later (or Yarn)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YourUser/intel-ai-image-journaling.git
   cd intel-ai-image-journaling
   ```
2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Create a `.env` file** (optional, for AI captions):
   ```bash
   cp .env.example .env
   # then edit .env to add your OpenAI key:
   VITE_OPENAI_API_KEY=sk-<YOUR_OPENAI_API_KEY>
   ```

### Available Scripts

- **`npm run dev`**: Start the development server with hot reload.
- **`npm run build`**: Create a production build in `dist/`.
- **`npm run preview`**: Preview the production build locally.

---

## Project Structure

```
📦 src
 ┣ 📂 components
 ┃ ┣ CaptureCamera.jsx
 ┃ ┣ GalleryView.jsx
 ┃ ┣ CalendarView.jsx
 ┃ ┗ SettingsPanel.jsx
 ┣ 📂 hooks
 ┃ ┗ usePhotoStore.js
 ┣ App.jsx
 ┣ main.jsx
 ┗ index.css
📦 public
 ┗ index.html
package.json
vite.config.js
.env.example
README.md
```

---

## Contributing

1. Fork the repo and create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```
2. Make your changes and commit:
   ```bash
   git commit -am "Add my awesome feature"
   ```
3. Push to your fork and open a Pull Request.

Please follow the established code style and run `npm run lint` before pushing.

---

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute!
