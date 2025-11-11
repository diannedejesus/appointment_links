import express from 'express'
const router = express.Router()
import * as homeController from '../controllers/home.js'
import {ensureAuth, ensureGuest} from '../middleware/auth.js';

router.get('/', homeController.getIndex)
router.post('/sendEmail', ensureAuth, homeController.sendEmail)

export default router