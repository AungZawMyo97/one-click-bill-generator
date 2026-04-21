# Social Share Bill Generator 🧾✨

A professional, zero-database utility for generating and sharing beautiful, high-quality receipt and invoice images. Designed for speed, privacy, and ease of use.

## 🚀 Key Features

- **Zero-Database Architecture**: Your data is yours. Information is stored strictly in your browser and shared via compressed URL state.
- **Dynamic Theming**: Choose from multiple aesthetic personas including Minimalist, Bold, Receipt, and Elegant styles.
- **Intelligent Image Handling**: Upload your brand logo and have it automatically resized client-side for optimal performance.
- **High-Quality Exports**: Generate pixel-perfect PNG images of your bills ready for social sharing or instant messaging.
- **Portability**: Share your entire bill configuration with a single compressed URL—no account required.

## 🛠️ Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks & Context API
- **Utilities**: 
  - `lz-string`: Robust URL state compression
  - `html-to-image`: High-fidelity DOM to PNG serialization
  - HTML5 Canvas API: Client-side image minification

## 🏃 Getting Started

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm run start
```

## 🔒 Privacy & Data

This application is built with a **Privacy-First** approach. 
- No cookies are used for tracking.
- No data is sent to a server-side database.
- Line items and pricing are encoded into the URL hash using LZ-string compression.
- Settings like shop name and logo are stored locally in your browser's `localStorage`.

---

Built for professionals who need a fast way to generate beautiful invoices on the fly.
