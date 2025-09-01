import express from 'express'
const router = express.Router()
import * as homeController from '../controllers/home.js'

router.get('/', homeController.getIndex) 

export default router