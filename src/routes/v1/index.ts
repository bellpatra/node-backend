import express from 'express';
import authRouter from './userRoutes/authRouter';

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use the authRouter for routes starting with "/auth/"
app.use('/auth', authRouter);

// Export the app instance for use in other modules
export default app;
