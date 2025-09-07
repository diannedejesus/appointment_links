import mongoose from 'mongoose'

const DatesSchema = new mongoose.Schema({
  dateTime: {
    type: Date,
    default: ''
  },
  references: {
    type: Array,
    required: true,
  },
  reserved: {
    type: Boolean,
    required: true, 
  }
})

export default mongoose.model('Dates', DatesSchema)
