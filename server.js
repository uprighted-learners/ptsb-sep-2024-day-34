const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// MongoDB Atlas Connection URI
const uri = process.env.MONGO_URI;

// Initialize Express app
const app = express();
const PORT = 8080;

// Create MongoClient instance with MongoDB Atlas connection string
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Async function to connect to MongoDB
async function connect() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Failed to connect to MongoDB Atlas", error);
    }
}

connect();

// Middleware to parse JSON requests
app.use(express.json());

// GET - /api/health - Check the health of the server
app.get('/api/health', (req, res) => {
    res.send('Server is healthy!');
});

// GET - /api/users - Fetch all users from the "users" collection
app.get("/api/users", async (req, res) => {
    try {
        // fetch all users from the "users" collection
        const users = await client.
            db("quizApp").
            collection("users").
            find({}).
            toArray();

        // return json response of users
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
});

// GET - /api/users/:_id - Fetch a specific user by _id from the "users" collection
app.get("/api/users/:_id", async (req, res) => {
    try {
        const { _id } = req.params;
        const user = await client.db("quizApp").collection("users").findOne({ _id: new ObjectId(_id) });

        if (user) {
            res.json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error fetching user");
    }
});

// POST - /api/users - Create a new user in the "users" collection
app.post("/api/users", async (req, res) => {
    try {
        const newUser = req.body;
        const result = await client.db("quizApp").collection("users").insertOne(newUser);
        res.json(result);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
});

// PUT - /api/users/:_id - Update a specific user by _id in the "users" collection
app.put("/api/users/:_id", async (req, res) => {
    try {
        const { _id } = req.params;
        const updatedUser = req.body;
        const result = await client.db("quizApp").collection("users").updateOne({ _id: new ObjectId(_id) }, { $set: updatedUser });
        res.json(result);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
});

// DELETE - /api/users/:_id - Delete a specific user by _id from the "users" collection
app.delete("/api/users/:_id", async (req, res) => {
    try {
        const { _id } = req.params;
        const result = await client.db("quizApp").collection("users").deleteOne({ _id: new ObjectId(_id) });
        res.json(result);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
