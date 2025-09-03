import express from 'express'
import * as calendarController from '../controllers/calendarCont.js'
import {ensureAuth, ensureGuest} from '../middleware/auth.js';
const router = express.Router()

router.get('/', calendarController.getIndex)

//router.post('/addDate', ensureAuth, calendarController.addDate)
// router.put('/assignTimeSlot', bookingController.assignTimeSlot)
// router.delete('/deleteDates', bookingController.deleteDates)

export default router