//register a user

import express, {Express, Request, Response, response} from 'express';
import User from '../../schema/userSchema/user';
import bcrypt from 'bcrypt';
require('dotenv').config();
import jwt from 'jsonwebtoken';

const app = express();

// Body parser middleware for JSON data
app.use(express.json())
// app.use(bodyParser.json());

export const createPerson = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const { username, password, empID } = req.body;
        if (!username || !password) {
          return res.status(400).json({ message: 'Username and password are required' });
        }
    
        // Check for existing user
        const empid = await User.findOne({ empID });
        if (empid) {
          return res.status(409).json({ message: 'User already exists' });
        }
    
        // Create new user
        const user = new User({ username, password, empID });
        await user.save();
    
        res.status(201).json({ message: 'User created successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user' });
      }
  }

// for verifying the password of a user

export const verifyUser =  async (req: Request, res: Response) => {
  try{
    const {username, password, empID} = req.body;
    if (!username || !password || !empID) {
      return res.status(400).json({ message: 'Username,password and empID are required for authentication' });
    }
    const empid = await User.findOne({ username });
    if (empid){
      const isPasswordValid = await bcrypt.compare(req.body.password, empid.password);
      if (isPasswordValid){
        // Generate JWT on successful verification
        const payload = {
          userId: empid._id,         // Include user ID in the payload
          username: empid.username,  // Include relevant user information
        };
        
        const secretKey: string = process.env.JWT_SECRET as string; // Use a strong secret key from environment variables
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Set token expiry time

        res.status(200).json({ message: 'Login successful!', token });
      }
      else{
        res.send("Incorrect credentials.")
      }
    }
    else{
      res.send('User doesnt exist. Please create the user first')
    }

  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports={
    createPerson,
    verifyUser
}