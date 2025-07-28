import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check
app.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('children')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return res.status(500).send('❌ Supabase connection failed');
    }

    res.send('✅ SOUL CSR Backend is running and connected to Supabase DB');
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    res.status(500).send('❌ Unexpected backend error');
  }
});

// ✅ GET /api/children
app.get('/api/children', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('verified', true);

    if (error) {
      console.error('❌ Error fetching children:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    res.status(500).json({ error: 'Unexpected backend error' });
  }
});

// ✅ GET /api/success-stories
app.get('/api/success-stories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('success_stories')
      .select('*, children(name, age)')
      .eq('verified', true);

    if (error) {
      console.error('❌ Error fetching success stories:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    res.status(500).json({ error: 'Unexpected backend error' });
  }
});

// ✅ POST /api/children
app.post('/api/children', async (req, res) => {
  try {
    let children = req.body;

    // Normalize input: if single object, convert to array
    if (!Array.isArray(children)) {
      children = [children];
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('children')
      .insert(children)
      .select();

    if (error) {
      console.error('❌ Error inserting children:', error.message);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    res.status(500).json({ error: 'Unexpected backend error' });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 SOUL CSR Backend is live at: http://localhost:${port}`);
});
