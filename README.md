This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## GitHub Pages (GitHub Actions)

Empfohlen: GitHub Repo `Settings` -> `Pages` -> `Source` = `GitHub Actions`.

Der Workflow liegt hier: `.github/workflows/deploy.yml` und deployed bei Push auf `main`.

## GitHub Pages (Deploy from branch, optional)

Wichtig: Bei **"Deploy from a branch"** baut GitHub dein Next.js-Projekt nicht. Du musst die **statischen Build-Dateien** (HTML/CSS/JS) selbst committen.

### Variante A (einfach): `main` + `/docs`

1. GitHub Repo: `Settings` -> `Pages`
2. `Source`: `Deploy from a branch`
3. `Branch`: `main`
4. `Folder`: `/docs`

Lokal im Repo:

```powershell
cd schnittke-akademie
npm run pages:build-docs
git add docs
git commit -m "Publish GitHub Pages"
git push
```

### Wenn GitHub nach einer "Lizenz" fragt

Wenn das Repo **privat** ist, ist GitHub Pages je nach Plan **nicht kostenlos**. Das laesst sich durch "Deploy from a branch" nicht umgehen: entweder Repo **public** machen oder Plan upgraden.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
