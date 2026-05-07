import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express();

// Middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

// Connect DB
connectDB()

// API Routes
app.get('/', (req, res) => { res.send('Server is Live!');});
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

app.use('/api/inngest', serve({ client: inngest, functions }))

// ✅ Export for Vercel instead of app.listen
export default app;