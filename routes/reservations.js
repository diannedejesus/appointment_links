const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/reservations')
const {ensureAuth, ensureGuest} = require('../middleware/auth');

router.get('/', ensureAuth, bookingController.setDates)

router.get('/selectTimeSlot', bookingController.selectTimeSlots)
router.get('/selectTimeSlot/:id', bookingController.selectTimeSlots)

router.post('/createTimeSlot', ensureAuth, bookingController.createTimeSlot)

router.put('/assignTimeSlot', bookingController.assignTimeSlot)

router.put('/markComplete', bookingController.markComplete)

router.put('/markIncomplete', bookingController.markIncomplete)

router.delete('/deleteDates', bookingController.deleteDates)

module.exports = router