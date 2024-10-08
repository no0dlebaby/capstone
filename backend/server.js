const express = require('express')
const app = express()

const pg = require('pg')
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT || 2445;

const client = new pg.Client(process.env.DATABASE_URL||'postgres://postgres:postgres@localhost:5432/new_careersim_db')

const { faker } = require('@faker-js/faker');


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json())
app.use(require('morgan')('dev'))

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const init = async()=>{
    console.log("initializing db")
    await client.connect()
    let SQL =`
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS categories CASCADE;
    DROP TABLE IF EXISTS cart CASCADE;
    
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

    ALTER TABLE products ADD COLUMN photo_url TEXT;

    CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW());

    CREATE TABLE cart (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id, product_id))
    `
    await client.query(SQL)
    console.log('tables created')


    const SQL2=`
    INSERT INTO categories (id, name) VALUES (gen_random_uuid(), 'food');
    INSERT INTO categories (id, name) VALUES (gen_random_uuid(), 'toys');
    INSERT INTO categories (id, name) VALUES (gen_random_uuid(), 'beds');



    INSERT INTO users (id, username, password, email)
    VALUES (gen_random_uuid(), 'soph', '${await bcrypt.hash('soph', 10)}', 'soph@email.com');
    INSERT INTO users (id, username, password, email)
    VALUES (gen_random_uuid(), 'noodle', '${await bcrypt.hash('noodle', 10)}', 'noodle@email.com');
    INSERT INTO users (id, username, password, email)
    VALUES (gen_random_uuid(), 'zuri', '${await bcrypt.hash('zuri', 10)}', 'zuri@email.com');

    INSERT INTO orders (id, user_id, total) VALUES (gen_random_uuid(), (SELECT id FROM users WHERE username='soph'), 49.99);
    INSERT INTO orders (id, user_id, total) VALUES (gen_random_uuid(), (SELECT id FROM users WHERE username='noodle'), 29.99);
    INSERT INTO orders (id, user_id, total) VALUES (gen_random_uuid(), (SELECT id FROM users WHERE username='zuri'), 19.99);
    `

    await client.query(SQL2)
    console.log('data seeded');
    app.listen(PORT, ()=>{
        console.log('connected to the server')
    })

//putting in fake products
const seedProducts = async () => {
  const categories = ['Toys', 'Food', 'Beds'];
  const petProductNames = [
    'Chew Toy', 'Squeaky Ball', 'Pet Bed', 'Cat Scratching Post', 'Dog Leash',
    'Lick Mat', 'Slow Feeder', 'Meal Toppers', 'Pet Shampoo', 'Dog Treats',
    'Cat Food', 'Dog Bowl', 'Pet Carrier', 'Pet Blanket', 'Dog Bandana'
  ];
  
  for (let i = 1; i < 100; i++) {
    const name = petProductNames[Math.floor(Math.random() * petProductNames.length)];
    const description = faker.lorem.sentence();
    const price = (Math.random() * (50 - 5) + 5).toFixed(2)
    const stock = faker.number.int({ min: 0, max: 500 });
    const category = categories[Math.floor(Math.random() * categories.length)];
    const photoUrl = `https://placedog.net/500/500?id=${i}`

    const SQL = `
      INSERT INTO products (id, name, description, price, stock, category_id, photo_url)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, (SELECT id FROM categories WHERE name = $5), $6)
    `;
    
    await client.query(SQL, [name, description, price, stock, category, photoUrl]);
  }
};

await seedProducts();

}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
      return res.status(401).json({ message: 'access denied' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
      return res.status(401).json({ message: 'access denied, no token' })
  }

  try {
      const verified = jwt.verify(token, process.env.JWT_SECRET)
      req.user = verified
      next()
  } catch (err) {
      res.status(400).json({ message: 'invalid Token' })
  }
};

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
app.get('/api/products/:id', async (req,res)=>{
    try{
        const{id}= req.params;
        const result=await client.query('SELECT * FROM products WHERE id =$1', [id])
        if (result.rows.length===0) {
            return res.status(404).json({error:'product not found'})
        }
        res.json(result.rows[0])
    } catch(err){
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
        const userId = req.user.id;
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
// Get past orders for a specific user
app.get('/api/users/past-orders', verifyToken, async (req, res) => {
    const userId = req.user.id;
    try {
      const SQL = `
      SELECT o.id AS order_id, o.total, o.created_at,
        json_agg(json_build_object(
          'product_id', p.id,
          'name', p.name,
          'price', p.price,
          'quantity', c.quantity
        )) AS items
      FROM orders o
      JOIN cart c ON o.id = c.order_id  -- assuming cart table also has order_id column
      JOIN products p ON c.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id, o.total, o.created_at
      ORDER BY o.created_at DESC
    `;
      const result = await client.query(SQL, [userId]);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  







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
// login
app.post('/api/users/login', async (req, res)=>{
    try {
        const { email, password } = req.body
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email])
    
        if (result.rows.length === 0){
            console.log('User not found');
            return res.status(401).json({ error: 'user not found' })
        }
        
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'wrong password!' })}
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } catch (error) {console.error(error);
        res.status(500).json({ error: error.message });
      }
    })
// check out: create new order
app.post('/api/orders', verifyToken, async (req, res) => {
    const { total } = req.body;
    const userId = req.user.id;
    try {
      const SQL = `INSERT INTO orders (id, user_id, total) VALUES (gen_random_uuid(), $1, $2) RETURNING *`;
      const response = await client.query(SQL, [userId, total]);
      res.send(response.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
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
// put orders
app.put('/api/orders', async (req, res, next)=>{
    try {
        const SQL = `UPDATE orders SET total = $1 WHERE id = $2 RETURNING *;`
        const response = await client.query(SQL, [username, email, hashedPassword, userId])
        res.send(response.rows)
    } catch (error) {
    }
})
// put cart (update quantity of items in cart)
app.put('/api/cart', verifyToken, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    try {
      const SQL = `UPDATE cart SET quantity = $3 WHERE user_id = $1 AND product_id = $2 RETURNING *`;
      const response = await client.query(SQL, [userId, productId, quantity]);
      res.send(response.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
//put products 
app.put('/api/products', async (req, res, next) => {
    const { id, name, description, price, stock, category_id } = req.body;
    const SQL = `UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category_id = $5 WHERE id = $6 RETURNING *`;
    const response = await client.query(SQL, [name, description, price, stock, category_id, id]);
    res.send(response.rows);
});


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
app.delete('/api/cart/:productId', verifyToken, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;
    try {
      const SQL = `DELETE FROM cart WHERE user_id = $1 AND product_id = $2`;
      await client.query(SQL, [userId, productId]);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
// delete orders
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