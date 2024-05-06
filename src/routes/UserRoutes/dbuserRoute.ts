import express from 'express';
import { adddbUser } from '../../controllers/UserManagement/dbUser';

const router = express.Router();

router.route('/adddbUser').post(adddbUser);

module.exports= router; 