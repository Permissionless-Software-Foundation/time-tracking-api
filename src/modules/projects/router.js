const validator = require('../../middleware/validators')
const project = require('./controller')

// export const baseUrl = '/users'
module.exports.baseUrl = '/projects'

module.exports.routes = [
  {
    method: 'POST',
    route: '/',
    handlers: [
      validator.ensureAdmin,
      project.createProject
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      validator.ensureUser,
      project.getProjects
    ]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      validator.ensureUser,
      project.getProject
    ]
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      validator.ensureAdmin,
      project.getProject,
      project.updateProject
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      validator.ensureAdmin,
      project.getProject,
      project.deleteProject
    ]
  }
]
