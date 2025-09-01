import { text } from 'express'
import mongoose from 'mongoose'



const ReservationSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  linkId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  subject: {
    type: String,
    required: false,
  },
  duration: {
    type: Number,
    required: false,
  },
})

export default mongoose.model('Reservation', ReservationSchema)
