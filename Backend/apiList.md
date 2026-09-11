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

//Get user by email

app.get("/user", async (req, res) => {
const email = req.body.emailId;
try {
const user = await User.findOne({ emailId: email });
res.send(user);
if (!user) {
res.status(404).send("user not found");
}
//this is give all user even same email
// const user = await User.find({ emailId: email });
// if (user.length === 0) {
// res.status(404).send("user not found");
// }
// res.send(user);
} catch (e) {
res.status(400).send("something went wrong");
}
});

//Feed API - GET /feed - get all the users from the database

app.get("/feed", async (req, res) => {
try {
const user = await User.find({});
if (user.length === 0) {
res.status(404).send("user not found");
}
res.send(user);
} catch (e) {
res.status(400).send("something went wrong");
}
});

app.delete("/user", async (req, res) => {
const userId = req.body.userId;
try {
// both are same it shorthand
const user = await User.findByIdAndDelete(userId);
// const user = await User.findByIdAndDelete({\_id:userId})
if (!user) {
return res.status(404).send("User not found");
}
res.send("user deleted successfully");
} catch (error) {
res.status(400).send("something went wrong");
}
});

//update data of the user
app.patch("/user/:userId", async (req, res) => {
const userId = req.params?.userId;
const data = req.body;

try {
const ALLOWED_UPDATES = [
"userId",
"photoUrl",
"about",
"gender",
"age",
"skills",
];
const isUpdateAllowed = Object.keys(data).every((k) =>
ALLOWED_UPDATES.includes(k),
);
if (!isUpdateAllowed) {
throw new Error("update not allowed");
}
await User.findByIdAndUpdate({ \_id: userId }, data, {
runValidators: true,
});
res.send("user updated successfully");
} catch (error) {
res.status(400).send(error.message);
}
});
