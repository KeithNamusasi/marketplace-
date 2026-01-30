const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'genmax_secret_key_change_in_prod'; // In a real app, use ENV variable

app.use(cors());
app.use(express.json());

// --- Database Setup ---
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error("DB Error:", err.message);
    else console.log("Connected to SQLite database.");
});

// Initialize Tables
db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        price TEXT,
        category TEXT,
        image TEXT,
        description TEXT,
        seller_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(seller_id) REFERENCES users(id)
    )`);

    // Seed Initial Data if empty
    db.get("SELECT count(*) as count FROM products", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding initial products...");
            const stmt = db.prepare("INSERT INTO products (title, price, category, image, description, seller_id) VALUES (?, ?, ?, ?, ?, ?)");
            stmt.run("Neural Link VR", "45,000 KES", "Tech", "https://images.unsplash.com/photo-1626387346567-9d7a26f87b8f?w=400", "Next-gen VR interface for immersive simulated reality.", 1);
            stmt.run("Cyber Arm v4", "250,000 KES", "Tech", "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=400", "High-torque cybernetic replacement limb.", 1);
            stmt.run("Neon Jacket", "12,000 KES", "Fashion", "https://images.unsplash.com/photo-1549557404-5e5814526017?w=400", "Glow-in-the-dark streetwear for night runners.", 1);
            stmt.run("Hover Board", "85,000 KES", "Automotive", "https://images.unsplash.com/photo-1632766355325-1e3c3b0f5b3a?w=400", "Anti-gravity personal transport.", 1);
            stmt.finalize();
        }
    });
});

// --- Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Routes ---

// REGISTER
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword],
            function (err) {
                if (err) {
                    return res.status(400).json({ error: "Email already exists" });
                }
                const token = jwt.sign({ id: this.lastID, email }, SECRET_KEY);
                res.json({ token, user: { id: this.lastID, name, email } });
            }
        );
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

// LOGIN
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err || !user) return res.status(400).json({ error: "User not found" });

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
            res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        } else {
            res.status(400).json({ error: "Invalid password" });
        }
    });
});

// GET PRODUCTS
app.get('/api/products', (req, res) => {
    const category = req.query.category;
    let query = "SELECT * FROM products ORDER BY created_at DESC";
    let params = [];

    if (category && category !== 'All') {
        query = "SELECT * FROM products WHERE category = ? ORDER BY created_at DESC";
        params = [category];
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET SINGLE PRODUCT (Expanded for details)
// GET SINGLE PRODUCT (With Seller Info)
app.get('/api/products/:id', (req, res) => {
    const query = `
        SELECT p.*, u.phone as seller_phone, u.name as seller_name 
        FROM products p 
        LEFT JOIN users u ON p.seller_id = u.id 
        WHERE p.id = ?
    `;
    db.get(query, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Product not found" });
        res.json(row);
    });
});

// CREATE PRODUCT (Protected)
app.post('/api/products', authenticateToken, (req, res) => {
    const { title, price, category, image, description } = req.body;
    // Basic formatting for price if user just sends number
    const formattedPrice = price.includes('KES') ? price : `${price} KES`;
    // Default image if empty
    const finalImage = image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400";

    db.run("INSERT INTO products (title, price, category, image, description, seller_id) VALUES (?, ?, ?, ?, ?, ?)",
        [title, formattedPrice, category, finalImage, description || "No description provided.", req.user.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                id: this.lastID,
                title,
                price: formattedPrice,
                category,
                image: finalImage,
                description,
                seller_id: req.user.id
            });
        }
    );
});

// USER PROFILE Get & Update
app.get('/api/user/profile', authenticateToken, (req, res) => {
    db.get("SELECT id, name, email, phone, created_at FROM users WHERE id = ?", [req.user.id], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(user);
    });
});

app.put('/api/user/profile', authenticateToken, (req, res) => {
    const { name, email, phone } = req.body;
    db.run("UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
        [name, email, phone, req.user.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Profile updated successfully" });
        }
    );
});


app.post('/api/payment/mpesa', (req, res) => {
    const { phone, amount } = req.body;
    console.log(`Processing M-Pesa payment for ${phone} Amount: ${amount}`);

    setTimeout(() => {
        res.json({
            success: true,
            message: "STK Push sent. Payment simulated successfully.",
            transaction_id: "MPS" + Date.now()
        });
    }, 2000);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
