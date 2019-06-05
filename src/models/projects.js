const mongoose = require('mongoose')

const Project = new mongoose.Schema({
  title: { type: String, required: true },
  projectLead: { type: String },
  briefContent: { type: String },
  extendedContent: { type: String },
  projectContact: { type: String },
  contributors: { type: Array }, // An array of IDs of users that have contributed to the project.
  projectWork: { type: Array }, // An array of IDs of LoggedWork models associated with this project.
  typesOfWork: { type: Array }
})

// export default mongoose.model('user', User)
module.exports = mongoose.model('project', Project)
