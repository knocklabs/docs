# Knockumentation (docs)

Documentation, guides, and the API reference for Knock. Built with Next.JS and Typescript.

## System requirements

To run docs you will need:

- `node` & `yarn` (see `.tool-versions`)

## Getting up-and-running

### Running both the API and Dashboard

1. Install the necessary dependencies:

```bash
$ ./bin/bootstrap.sh
```

2. Start docs in development mode

```bash
$ yarn run dev
```

3. Open your browser to `http://localhost:3002`

## Deploying

This site is automatically deployed to `docs.knock.app` from the `main` branch. Previews are available
for all PRs submitted into this repo, powered by Vercel.

## Hosting

You can access the hosting for this site here: https://vercel.com/knocklabs/docs
