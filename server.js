const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const PORT = 8080;

const uri = process.env.MONGO_URI;

// Connect to MongoDB with mongoose
mongoose.connect(uri,
    {
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// Middleware to parse JSON requests
app.use(express.json());

// GET - /api/health - Check the health of the server
app.get('/api/health', (req, res) => {
    res.send('Server is healthy!');
});

// define a user schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    score: Number,
    interests: [String]
})

// create a user model
const User = mongoose.model('User', userSchema);

// GET - /api/users - Fetch all users from the "users" collection
app.get("/api/users", async (req, res) => {
    try {
        // fetch all users from the "users" collection
        const users = await User.find();

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

        // fetch the user from the "users" collection
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        // return json response of user
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error fetching user");
    }
});

// POST - /api/users - Create a new user in the "users" collection
app.post("/api/users", async (req, res) => {
    try {
        // create a new user using the User model 
        const { username, email, score, interests } = req.body;

        // check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // check if the fields are all filled
        // if (!username || !email || !score || !interests) {
        //     return res.status(400).json({ error: "All fields are required" });
        // }

        // create a new user
        const newUser = new User({ username, email, score, interests });

        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
});

// PUT - /api/users/:_id - Update a specific user by _id in the "users" collection
app.put("/api/users/:_id", async (req, res) => {
    try {
        const { _id } = req.params;
        const { username, email, score, interests } = req.body;
        const updatedUser = await User.findByIdAndUpdate(_id, { username, email, score, interests }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
});

// DELETE - /api/users/:_id - Delete a specific user by _id from the "users" collection
app.delete("/api/users/:_id", async (req, res) => {
    try {
        const { _id } = req.params;
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        await user.deleteOne();

        res.sendStatus(204).json(user).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
