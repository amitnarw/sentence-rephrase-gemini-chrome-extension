# 🔄 Chrome Rephraser Extension

This is a simple Chrome Extension that allows you to **rephrase any selected text** on a webpage. You can access it either from the Chrome extensions toolbar or directly by right-clicking selected text.

---

## 🚀 Features

* Rephrase any sentence or paragraph with a single click
* Right-click context menu support
* Easy-to-use Chrome Extension UI

---

## 📦 Installation Instructions

Follow these steps to set up and install the extension locally:

### 1. Clone or Download the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

Or simply download the ZIP and extract it.

### 2. Install Dependencies

Make sure you have **Node.js** and **npm** installed. Then, run:

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

After running the build command, a new `dist/` folder will be created.

### 4. Prepare the `dist` Folder

Manually copy the following items into the `dist/` folder:

* `icons/` folder
* `manifest.json` file

Make sure the final `dist/` folder structure looks like this:

```
dist/
├── icons/
├── manifest.json
├── [other build files...]
```

---

## 🧩 Load Extension into Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Toggle **Developer mode** on (top right corner)
3. Click on **Load unpacked**
4. Select the `dist/` folder

---

## ✅ How to Use

* Click the extension icon in the top-right toolbar to open the rephraser UI
* Or, select any text on a webpage, right-click, and choose the rephrase option from the context menu

---

## 🛠️ Development

Feel free to fork the repository and contribute! For development, you can run:

```bash
npm run dev
```

