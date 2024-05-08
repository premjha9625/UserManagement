import express from 'express';
import { adddbUser, updateUser } from '../../controllers/UserManagement/dbUser';

const router = express.Router();

router.route('/adddbUser').post(adddbUser);
router.route('/updateUser').post(updateUser);

module.exports= router; 