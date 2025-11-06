import mongoose from 'mongoose'

const TimeSlotSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  selectedSlot: {
    type: Date,
    default: ''
  },
  slotChoices: {
    type: [Date],
    required: true,
  },
  linkId: {
    type: String,
    required: true, 
  }
})

export default mongoose.model('TimeSlots', TimeSlotSchema)
