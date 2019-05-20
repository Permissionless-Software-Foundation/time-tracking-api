const mongoose = require('mongoose')

const config = require('../../config')

// Connect to the Mongo Database.
mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true) // Stop deprecation warning.
mongoose.connect(config.database, { useNewUrlParser: true })

const User = require('../../src/models/users')

async function getUsers () {
  const users = await User.find({}, '-password')
  console.log(`users: ${JSON.stringify(users, null, 2)}`)

  mongoose.connection.close()
}
getUsers()
