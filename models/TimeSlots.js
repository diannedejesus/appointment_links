import mongoose from 'mongoose'

const TimeSlotSchema = new mongoose.Schema({
  selectedSlot: {
    type: Date,
    default: ''
  },
  slotChoices: {
    type: Array,
    required: true,
  },
  linkId: {
    type: String,
    required: true, 
  }
})

export default mongoose.model('TimeSlots', TimeSlotSchema)
