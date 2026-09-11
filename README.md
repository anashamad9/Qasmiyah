# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
cp .env.example .env.local
# Add your server-side OPENAI_API_KEY to .env.local
npm run dev
```

Open `/app/settings` to upload `.csv` or `.json` data. The app sends up to 1,000 records (2 MB)
to the server-side OpenAI Responses API, validates the structured analysis, and activates it across
the dashboard. Column names are not fixed: the model infers the structure and meaning of arbitrary
structured records. Three large, structurally different starter files are available in
`public/data-examples`. Regenerate them with `node scripts/generate-sample-data.mjs`.

Never use a `NEXT_PUBLIC_` prefix for the OpenAI API key. Remove personal information from files
and upload only data you are authorized to process.

## Built with

- Next.js
- TypeScript
- React
- Tailwind CSS
- OpenAI Responses API
