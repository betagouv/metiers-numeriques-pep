# Contributing

- [Get Started](#get-started)
  - [Requirements](#requirements)
  - [First Setup](#first-setup)
  - [Local development](#local-development)
  - [Main directories](#main-directories)
  - [Architecture](#architecture)
  - [Stack](#stack)
- [Deployment](#deployment)
- [Common Tasks](#common-tasks)
  - [Generate a new database migration](#generate-a-new-database-migration)
- [IDEs](#ides)
  - [Recommended Visual Studio Code settings](#recommended-visual-studio-code-settings)

## Get Started

### Requirements

- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Docker](https://www.docker.com/get-started)

### First Setup

> ⚠️ **Important**  
> If you're under **Windows**, please run all the CLI commands within a Linux shell-like terminal (i.e.: Git Bash).

Then run:

```sh
git clone https://github.com/betagouv/metiers-numeriques-pep.git
cd metiers-numeriques-pep
cp ./env.example ./.env
yarn
yarn dev:docker
yarn db:migrate
```

### Local development

```sh
yarn dev:docker
yarn dev
```

This will run PostgreSQL & Redis within a Docker container via Docker Compose
and run the webapp which should then be available at [http://localhost:3001](http://localhost:3001).

It will also watch for file changes to rebuild + restart the server after each change.

### Main directories

```sh
config/             # Various configuration and setup files
prisma/             # Prisma ORM schema, migrations and seeds
src/                # Main code base
scripts/            # Scripts code base
```

### Architecture

There are 3 parts:

- The cron (`src/cron.ts`) automatically adding new jobs to run into the queue.
- The server (`src/server.ts`) providing the RESTfull API.
- The worker (`src/worker.cjs`) provifing the workers running scrapping and processing jobs via a queue.
  _This name would deserve to be changed to something more description-fitting._

### Stack

It's a mixed Typescript / CommonJS application (check [main readme Todo](README.md#todo) to understand why):

- The cron are run via the popular [cron](https://www.npmjs.com/package/cron) package.
- The worker handles the job queue via [bull](https://optimalbits.github.io/bull/)
  and the parallel forked process via [jest-worker](https://www.npmjs.com/package/jest-worker).
- The server runs via [koa](https://koajs.com) framework (quite similar to [express](https://expressjs.com),
  but [way lighter](https://github.com/koajs/koa/blob/master/docs/koa-vs-express.md#koa-vs-express)).
- The database is a PostgreSQL one managed via [Prisma](https://www.prisma.io) ORM (including migrations & seeds).

## Deployment

This website should be ready to be deployed on Scalingo as is. Request an access in Mattermost if you need one.

## Common Tasks

### Generate a new database migration

Each time you add a final change in `./prisma/schema.prisma`, you need to generate a migration as well as updating
Prisma typings in order to record it:

```sh
yarn dev:migrate
```

You then need to name your new migration. Please check previous generated migrations to keep some naming consistency.

And don't forget to restart your local instance in order for Prisma to load the new schema.

## IDEs

### Recommended Visual Studio Code settings

`.vscode/settings.json`

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.formatOnSave": true,
  "eslint.codeActionsOnSave.mode": "all",
  "eslint.format.enable": true,
  "eslint.packageManager": "yarn",
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```
