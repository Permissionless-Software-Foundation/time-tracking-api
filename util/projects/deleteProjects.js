/*
  This is a utility app that will delete a project.
  Select the project by editing the constant title below.
*/

const title = 'test'

const mongoose = require('mongoose')

const config = require('../config')

// Connect to the Mongo Database.
mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true) // Stop deprecation warning.
mongoose.connect(config.database, { useNewUrlParser: true })

const Project = require('../src/models/projects')

async function deleteProject () {
  const resp = await Project.deleteOne({ title: title }, function (err) {
    // eslint-disable-next-line no-undef
    if (err) return handleError(err)
    // deleted at most one tank document
  })
  console.log(resp)
  mongoose.connection.close()
}
deleteProject()
