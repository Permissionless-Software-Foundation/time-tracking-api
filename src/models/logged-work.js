const mongoose = require('mongoose')

const Project = new mongoose.Schema({

})

// export default mongoose.model('user', User)
module.exports = mongoose.model('loggedWork', Project)
