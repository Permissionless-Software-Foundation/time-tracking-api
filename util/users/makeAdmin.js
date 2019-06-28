/*
  This is a utility app that will convert a normal user into an admin user.
  Select the user by editing the constant USERNAME below.
*/

const USERNAME = 'daniel'

const mongoose = require('mongoose')

const config = require('../../config')

// Connect to the Mongo Database.
mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true) // Stop deprecation warning.
mongoose.connect(config.database, { useNewUrlParser: true })

const User = require('../../src/models/users')

async function makeAdmin () {
  const users = await User.find({}, '-password')
  // console.log(`users: ${JSON.stringify(users, null, 2)}`)

  // Loop through all the users returned.
  for (let i = 0; i < users.length; i++) {
    const thisUser = users[i]

    if (thisUser.username === USERNAME) {
      thisUser.type = 'admin'
      await thisUser.save()
      break
    }
  }

  mongoose.connection.close()
}
makeAdmin()
