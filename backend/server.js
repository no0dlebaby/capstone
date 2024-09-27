const express = require('express')
const app = express()

const pg = require('pg')
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT || 2445;

const client = new pg.Client(process.env.DATABASE_URL||'postgres://postgres:postgres@localhost:5432/new_careersim_db')

app.use(cors());
app.use(express.json())
app.use(require('morgan')('dev'))
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const init = async()=>{
    console.log("initializing db")
    await client.connect()
    let SQL =`
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS categories CASCADE;
    
    CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT now()
    );
    
    CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL);

    CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW());

    CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW())
    `
    await client.query(SQL)
    console.log('tables created')

    const SQL2=`
    INSERT INTO categories (id, name) VALUES (gen_random_uuid(), 'javascript');
    INSERT INTO categories (id, name) VALUES (gen_random_uuid(), 'HTML');
    INSERT INTO categories (id, name) VALUES (gen_random_uuid(), 'CSS');

    INSERT INTO products (id, name, description, price, stock, category_id)
    VALUES (gen_random_uuid(), 'nameone', 'this is a note about JavaScript', 29.99, 100, (SELECT id FROM categories WHERE name='javascript'));
    INSERT INTO products (id, name, description, price, stock, category_id)
    VALUES (gen_random_uuid(), 'nametwo', 'This is a note about HTML', 19.99, 200, (SELECT id FROM categories WHERE name='HTML'));
    INSERT INTO products (id, name, description, price, stock, category_id)
    VALUES (gen_random_uuid(), 'namethree', 'This is a note about CSS', 24.99, 150, (SELECT id FROM categories WHERE name='CSS'));


    INSERT INTO users (id, username, password, email)
    VALUES (gen_random_uuid(), 'user1', 'password1', 'user1@example.com');
    INSERT INTO users (id, username, password, email)
    VALUES (gen_random_uuid(), 'user2', 'password2', 'user2@example.com');
    INSERT INTO users (id, username, password, email)
    VALUES (gen_random_uuid(), 'user3', 'password3', 'user3@example.com');

    INSERT INTO orders (id, user_id, total)
    VALUES (gen_random_uuid(), (SELECT id FROM users WHERE username='user1'), 49.99);

    INSERT INTO orders (id, user_id, total)
    VALUES (gen_random_uuid(), (SELECT id FROM users WHERE username='user2'), 29.99);

    INSERT INTO orders (id, user_id, total)
    VALUES (gen_random_uuid(), (SELECT id FROM users WHERE username='user3'), 19.99);
    `

    client.query(SQL2)
    console.log('data seeded');
    app.listen(PORT, ()=>{
        console.log('connected to the server')
    })
}

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });
    
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).json({ message: 'Invalid Token' });
    }
  };
  app.get('/', (req, res) => {
    res.send('Hello World!');
});
//ROUTES
//get to products (home page)
app.get('/api/products', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM products')
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
})
//get details of a specific product
app.get('/api/products/:id', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM products WHERE id = $1', [id])
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({error:err.message})
    }
})
//get all categories
app.get('/api/categories', async (req, res, next)=>{
    try {
        const SQL = `SELECT * FROM categories`
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})
//get orders from specific users
app.get('/api/users/orders', verifyToken, async (req, res)=>{
    try {
        const SQL = `SELECT * FROM users`
        const response = await client.query(SQL, [userId])
        res.send(response.rows)
    } catch (error) {
    }
})

// get users cart
app.get('/api/users/cart', verifyToken, async (req, res )=>{
    try {
        const userId= req.user.id;
        const SQL = `
                     SELECT c.product_id, p.name, p.price, c.quantity 
                     FROM cart c 
                     JOIN products p ON c.product_id = p.id 
                     WHERE c.user_id = $1`
        const response = await client.query(SQL, [userId])
        res.send(response.rows)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})




// register a new user
app.post('/api/users', async (req, res)=>{
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const SQL = `INSERT INTO users (id, username, password, email) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *`
        const response = await client.query(SQL, [username, hashedPassword, email]);
        res.send(response.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
// post user(login) 
app.post('/api/users/login', async (req, res)=>{
    try {
        const { email, password } = req.body;
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
        if (result.rows.length === 0) return res.status(401).json({ error: 'user not found' });
        
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) return res.status(401).json({ error: 'wrong password!' });
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    })
// check out: create new order
app.post('/api/orders', verifyToken, async (req, res)=>{
    const {total}= req.body
    const userId= req.user.id
    try {
        const SQL = `INSERT INTO orders (id, user_id, total) VALUES (gen_random_uuid(), $1, $2) RETURNING *`
        const response = await client.query(SQL, [userId], total)
        res.send(response.rows[0])
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})
//post cart (logged in users only) (add items to cart)
app.post('/api/cart', verifyToken, async (req, res)=>{
    const { productId, quantity } = req.body;
  const userId = req.user.id;
    try {

        const SQL = `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) 
                 ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + $3 RETURNING *`
        const response = await client.query(SQL, [userId, productId, quantity])
        res.send(response.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
// put users (profile updates)
app.put('/api/users', verifyToken, async (req, res)=>{
    try {
        const { username, email, password } = req.body;
        const userId = req.user.id;
        const hashedPassword = await bcrypt.hash(password, 10);
        const SQL = `UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`
        const response = await client.query()
        res.send(response.rows)
    } catch (error) {
    }
})
// put orders (update order: such as updating delivery details)
app.put('/api/orders', async (req, res, next)=>{
    try {
        const SQL = ``
        const response = await client.query()
        res.send(response.rows)
    } catch (error) {
    }
})
// put cart (update quantity of items in cart)
app.put('/api/cart', async (req, res, next)=>{
    try {
        const SQL = ``
        const response = await client.query()
        res.send(response.rows)
    } catch (error) {
    }
})
//put products (update product details (in stock or not))
app.put('/api/products', async (req, res, next)=>{
    try {
        const SQL = ``
        const response = await client.query()
        res.send(response.rows)
    } catch (error) {
    }
})

// delete users account
app.delete('/api/users', async (req, res, next)=>{
    try {
        const SQL = ``
        const response = await client.query()
        res.send(response.rows)
    } catch (error) {
    }
})
// delete cart (remove an item in cart)
app.delete('/api/cart', async (req, res, next)=>{
    try {
        const SQL = ``
        const response = await client.query()
        res.send(response.rows)
    } catch (error) {
    }
})
// delete orders (delete or cancel an order within an hour)
app.delete('/api/orders', async (req, res, next)=>{
    try {
        const SQL = ``
        const response = await client.query()
        res.send(response.rows)
    } catch (error) {
    }
})
//delete products (admin only)
app.delete('/api/users', async (req, res, next)=>{
    try {
        const SQL = ``
        const response = await client.query()
        res.send(response.rows)
    } catch (error) {
    }
})



 init()