import express from 'express'
import * as bookingController from '../controllers/reservations.js'
import {ensureAuth, ensureGuest} from '../middleware/auth.js';
const router = express.Router()

router.get('/', ensureAuth, bookingController.show_setDates)
router.get('/selectTimeSlot', bookingController.selectTimeSlots)
router.get('/selectTimeSlot/:id', bookingController.selectTimeSlots)

router.post('/createTimeSlot', ensureAuth, bookingController.createTimeSlot)
router.post('/resendEmail', ensureAuth, bookingController.resendEmail)

router.put('/assignTimeSlot', bookingController.assignTimeSlot)

router.delete('/deleteDates', bookingController.deleteTimeSlot)

export default router