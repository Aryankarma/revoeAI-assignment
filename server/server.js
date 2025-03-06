import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import authRoutes from './routes/authRoutes.js';

config();
     
const app = express(); 
const PORT = process.env.PORT || 5000;

console.log(process.env.MONGO_URI)

// Middleware 
app.use(cors());
app.use(json());

// MongoDB connection
connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error);
});

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api/auth', authRoutes);