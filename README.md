# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# To restart the project

```
npm run dev
```

# Pour ajouter un composant

```
npx shadcn@latest add "composant"

ex: 
npx shadcn@latest add button
```

# Bibliothèques de composants React populaire

- https://ui.shadcn.com/           #stylisé avec Tailwind CSS
- https://daisyui.com/


## Framework CSS

- TailWind CSS (utilitaires)


# Palette de couleurs 

- sur coolors
- Pastel Lavender

# Fonts

- Utilisation du site FontSource
- npm install @fontsource/courgette

# images

- Canva
- "Remove bg" pour enlever le fond de l'image

# logo lucide-react et react-icons

npm install lucide-react
npm install react-icons


# emailjs
npm install @emailjs/browser
template_a7lhbuq

# routes

npm install react-router-dom

# sounds

- Pixabay
- Utilisation de la Web Audio API

# composant accordion

- npx shadcn@latest add accordion

# composant dialog

- npx shadcn@latest add dialog

# démo web 3D interactive

- npm install three @react-three/fiber @react-three/drei
- npm install -D @types/three