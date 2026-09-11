# API Routes

## Auth

- `POST /signup` — Create account
- `POST /login` — Login
- `POST /logout` — Logout

## Profile

- `GET /profile/view` — View profile
- `PATCH /profile/edit` — Edit profile
- `PATCH /profile/password` — Change password

## Connections

- `POST /request/send/interested/:userId` — Send interested request
- `POST /request/send/ignore/:userId` — Ignore user
- `POST /request/review/accepted/:requestId` — Accept request
- `POST /request/review/rejected/:requestId` — Reject request

## User

- `GET /connections` — Get connections
- `GET /requests/received` — Get received requests
- `GET /feed` — Get other users' profiles

## Status

`interested` · `ignore` · `accepted` · `rejected`
