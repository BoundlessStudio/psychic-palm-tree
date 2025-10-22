# AI Studio Chat

A Next.js playground built from the [ai-sdk.dev](https://ai-sdk.dev) basic chat template and elevated with a shadcn/ui-inspired
visual system. Tailwind CSS powers the design tokens, while Radix primitives keep interactive components accessible.

## Features

- ⚡️ Streaming chat experience backed by the AI SDK and the OpenAI API route.
- 🎨 Polished shadcn/ui design tokens with responsive cards, prompt chips, and dark mode.
- ♿️ Accessible component primitives composed from Radix UI and headless utilities.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set your OpenAI key**

   Create a `.env.local` file and add:

   ```bash
   OPENAI_API_KEY=sk-your-key
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to chat.

## Available Scripts

- `npm run dev` – Start Next.js in development mode.
- `npm run build` – Create an optimized production build.
- `npm run start` – Run the production build locally.
- `npm run lint` – Run ESLint using Next.js defaults.

## Project Structure

```
app/
  api/chat/route.ts      # Edge runtime handler streaming OpenAI responses
  layout.tsx             # Theme provider + global fonts
  page.tsx               # Chat interface using shadcn-inspired components
components/
  chat/                  # Message list, prompt shortcuts, and composer
  theme-*.tsx            # Theme toggle/provider wiring
  ui/                    # shadcn/ui primitives (button, card, textarea...)
lib/
  utils.ts               # Tailwind class name helper
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
