import mongoose from 'mongoose'

const UserInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  calendarEmail: {
    type: String,
    unique: false,
  },
  calendarPassword: {
    type: String,
    required: false,
  },
})

export default mongoose.model('UserInfo', UserInfoSchema)
