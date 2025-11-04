import express from 'express'
import * as bookingController from '../controllers/reservations.js'
import {ensureAuth, ensureGuest} from '../middleware/auth.js';
const router = express.Router()

router.get('/', ensureAuth, bookingController.show_setDates)
router.get('/reservations', ensureAuth, bookingController.show_reservations)
//router.get('/selectTimeSlot', bookingController.selectTimeSlots)
router.get('/selectTimeSlot/:id', bookingController.selectOrShowTimeSlots)

router.post('/createTimeSlot', ensureAuth, bookingController.createTimeSlot)
//router.post('/sendEmail', ensureAuth, bookingController.sendEmail)

router.post('/assignTimeSlot', bookingController.assignTimeSlot)

router.delete('/deleteDates', ensureAuth, bookingController.deleteTimeSlot)

export default router