# Clay's Personal Website

[![Build Status](https://travis-ci.org/ClayBenson94/personal-website.svg?branch=master)](https://travis-ci.org/ClayBenson94/personal-website)

This repository holds the front-end code for [claybenson.me](https://claybenson.me), as well as the back-end code to handle WebSocket connections for the [claybenson.me/led](https://claybenson.me/led) page.

## Setup and execution

Install dependencies:
```
npm ci
```

To start up the React development server:
```
(cd client && npm run start)
```

To start up the backend:
```
(cd server && cp default.env .env && npm run start)
```