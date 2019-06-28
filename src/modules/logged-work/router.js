const validator = require('../../middleware/validators')
const loggedWork = require('./controller')

module.exports.baseUrl = '/loggedwork'

module.exports.routes = [
  {
    method: 'POST',
    route: '/',
    handlers: [
      validator.ensureUser,
      loggedWork.createLoggedWork
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      loggedWork.getLoggedWorks
    ]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      loggedWork.getLoggedWork
    ]
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      validator.ensureUser,
      loggedWork.getLoggedWork,
      loggedWork.updateLoggedWork
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      validator.ensureUser,
      loggedWork.getLoggedWork,
      loggedWork.deleteLoggedWork
    ]
  }
]
