import express from 'express'
const router = express.Router()
import * as bookingController from '../controllers/reservations.js'
import {ensureAuth, ensureGuest} from '../middleware/auth.js';

router.get('/', ensureAuth, bookingController.setDates)
router.get('/selectTimeSlot', bookingController.selectTimeSlots)
router.get('/selectTimeSlot/:id', bookingController.selectTimeSlots)

router.post('/createTimeSlot', ensureAuth, bookingController.createTimeSlot)
router.post('/resendEmail', ensureAuth, bookingController.resendEmail)

router.put('/assignTimeSlot', bookingController.assignTimeSlot)

router.delete('/deleteDates', bookingController.deleteDates)

export default router