# Northcoders News API

## About

This project is an API which can access application data programmatically.
You can find the hosted API [here](https://project-nc-news-w769.onrender.com/api/)

## Install Packages

```bash
npm install
```

PSQL for your MAC or PC

## Create the following files and add data to each respectively file:

./.env.test

```bash
PGDATABASE = nc_news_test;
```

./.env.dev

```bash
PGDATABASE = nc_news;
```

./.gitignore

```bash
.env.*
```

## Seed Local Database

```bash
npm run setup-dbs
```

To run tests on test database

```bash
npm test
```

To seed the development database

```bash
npm run seed
```

To seed the production database

```bash
npm run seed-prod
```
