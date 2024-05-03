//register a user

import express, {Express, Request, Response, response} from 'express';
import User from '../../schema/userSchema/user';

const app = express();

// Body parser middleware for JSON data
app.use(express.json())
// app.use(bodyParser.json());

export const createPerson = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ message: 'Username and password are required' });
        }
    
        // Check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(409).json({ message: 'Username already exists' });
        }
    
        // Create new user
        const user = new User({ username, password });
        await user.save();
    
        res.status(201).json({ message: 'User created successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user' });
      }
  }

module.exports={
    createPerson
}