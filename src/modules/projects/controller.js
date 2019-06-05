const Project = require('../../models/projects')

/**
 * @api {post} /projects Create a new project
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName CreateProject
 * @apiGroup Projects
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "project": { "projectname": "johndoe", "password": "secretpasas" } }' localhost:50011/projects
 *
 * @apiParam {Object} project Project object (required)
 * @apiParam {String} project.title Project title (required).
 * @apiParam {String} project.projectLead GUID of user assigned as project leader.
 *
 * @apiSuccess {Boolean}  success Project creation status.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 */
async function createProject (ctx) {
  const project = new Project(ctx.request.body.project)

  try {
    await project.save()
  } catch (err) {
    ctx.throw(422, err.message)
  }

  ctx.body = {
    success: true
  }
}

/**
 * @api {get} /projects Get all projects
 * @apiPermission project
 * @apiVersion 1.0.0
 * @apiName GetProjects
 * @apiGroup Projects
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5001/projects
 *
 * @apiSuccess {Object[]} projects           Array of project objects
 * @apiSuccess {ObjectId} projects._id       Project id
 * @apiSuccess {String}   project.type       Project type (admin or project)
 * @apiSuccess {String}   projects.name      Project name
 * @apiSuccess {String}   projects.projectname  Project projectname
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "projects": [{
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "projectname": "johndoe"
 *       }]
 *     }
 *
 * @apiUse TokenError
 */
async function getProjects (ctx) {
  const projects = await Project.find({})
  ctx.body = { projects }
}

/**
 * @api {get} /projects/:id Get project by id
 * @apiPermission project
 * @apiVersion 1.0.0
 * @apiName GetProject
 * @apiGroup Projects
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5001/projects/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   projects           Project object
 * @apiSuccess {ObjectId} projects._id       Project id
 * @apiSuccess {String}   project.type       Project type (admin or project)
 * @apiSuccess {String}   projects.name      Project name
 * @apiSuccess {String}   projects.projectname  Project projectname
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "project": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "projectname": "johndoe"
 *       }
 *     }
 *
 * @apiUse TokenError
 */
async function getProject (ctx, next) {
  try {
    const project = await Project.findById(ctx.params.id)
    if (!project) {
      ctx.throw(404)
    }

    ctx.body = {
      project
    }
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }

  if (next) {
    return next()
  }
}

/**
 * @api {put} /projects/:id Update a project
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName UpdateProject
 * @apiGroup Projects
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "project": { "name": "Cool new Name" } }' localhost:5001/projects/56bd1da600a526986cf65c80
 *
 * @apiParam {Object} project          Project object (required)
 * @apiParam {String} project.name     Name.
 * @apiParam {String} project.projectname Projectname.
 *
 * @apiSuccess {Object}   projects           Project object
 * @apiSuccess {ObjectId} projects._id       Project id
 * @apiSuccess {String}   project.type      Project type (admin or project)
 * @apiSuccess {String}   projects.name      Updated name
 * @apiSuccess {String}   projects.projectname  Updated projectname
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "project": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "Cool new name"
 *          "projectname": "johndoe"
 *       }
 *     }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 *
 * @apiUse TokenError
 */
async function updateProject (ctx) {
  const project = ctx.body.project

  Object.assign(project, ctx.request.body.project)

  console.log(`Current user: ${JSON.stringify(ctx.state.user, null, 2)}`)

  // Unless the calling project is an admin, they can not change the project type.
  // if (projectType !== 'admin') {
  //  project.type = projectType
  // }

  // await project.save()

  ctx.body = {
    project
  }
}

/**
 * @api {delete} /projects/:id Delete a project
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName DeleteProject
 * @apiGroup Projects
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X DELETE localhost:5001/projects/56bd1da600a526986cf65c80
 *
 * @apiSuccess {StatusCode} 200
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 * @apiUse TokenError
 */

async function deleteProject (ctx) {
  const project = ctx.body.project

  await project.remove()

  ctx.status = 200
  ctx.body = {
    success: true
  }
}

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
}
