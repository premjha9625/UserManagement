import express from 'express';
import { createPerson, verifyUser } from '../../controllers/UserManagement/users';

const router = express.Router(); // Create an Express router object

// Define the route on the router object
router.route('/createUser').post(createPerson);
router.route('/login').post(verifyUser);

module.exports= router; // Export the router for use in other modules
