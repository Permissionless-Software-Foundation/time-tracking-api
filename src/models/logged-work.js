const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Logged = new mongoose.Schema({
  user: { type: String, required: true },
  typeOfWork: { type: String },
  project: { type: Schema.Types.ObjectId, ref: 'project', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  details: { type: String },
  hours: { type: Number }
})

// export default mongoose.model('user', User)
module.exports = mongoose.model('loggedWork', Logged)
