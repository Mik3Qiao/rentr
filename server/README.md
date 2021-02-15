### Back-End Server App

| HTTP | URI Path                  | Description                                                       |
| ---- | ------------------------- | ----------------------------------------------------------------- |
| GET  | /api/v1/                  | Homepage of the API with a welcoming message.                     |
| GET  | /api/v1/ping              | Do a ping-pong examination to ensure database service is running. |
| POST | /api/v1/user/registration | Register user with email & password.                              |
| POST | /api/v1/user/login        | Sign user in with their email & password.                         |