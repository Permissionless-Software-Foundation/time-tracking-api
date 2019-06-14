const LoggedWork = require('../../models/logged-work')

/**
 * @api {post} /loggedwork Create a new LoggedWork
 * @apiPermission user
 * @apiName CreateLoggedWork
 * @apiGroup LoggedWork
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -H "Authorization: Bearer <JWT Token>" -X POST -d '{ "loggedWork": { "user": "testUser","project": "testProject" } }' localhost:5001/loggedwork
 *
 * @apiSuccess {LoggedWork[]} loggedWork            Array of LoggedWorks objects
 * @apiSuccess {ObjectId} loggedWork._id            LoggeWork id
 * @apiSuccess {String}   loggedWork.user           LoggeWork user
 * @apiSuccess {String}   loggedWork.typeOfWork     LoggeWork type
 * @apiSuccess {String}   loggedWork.project        Project
 * @apiSuccess {Date}   loggedWork.startTime      LoggedWork Start Time
 * @apiSuccess {Date}   loggedWork.endTime        LoggedWork End Time
 * @apiSuccess {String}   loggedWork.details        LoggedWork Details
 * @apiSuccess {Number}   loggedWork.hours          LoggedWork Hours
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
 *       "error": "Path `user` is required ,Path `project` is required "
 *     }
 */
async function createLoggedWork (ctx) {
  const loggedWork = new LoggedWork(ctx.request.body.loggedWork)

  try {
    await loggedWork.save()
  } catch (err) {
    ctx.throw(422, err.message)
  }

  ctx.body = {
    success: true
  }
}
/**
 * @api {get} /loggedwork Get all loggedworks
 * @apiPermission public
 * @apiName GetLoggedWorks
 * @apiGroup LoggedWork
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5001/loggedwork
 *
 * @apiSuccess {LoggedWork[]} loggedWork            Array of LoggedWorks objects
 * @apiSuccess {ObjectId} loggedWork._id            LoggeWork id
 * @apiSuccess {String}   loggedWork.user           LoggeWork user
 * @apiSuccess {String}   loggedWork.typeOfWork     LoggeWork type
 * @apiSuccess {String}   loggedWork.project        Project
 * @apiSuccess {Date}   loggedWork.startTime      LoggedWork Start Time
 * @apiSuccess {Date}   loggedWork.endTime        LoggedWork End Time
 * @apiSuccess {String}   loggedWork.details        LoggedWork Details
 * @apiSuccess {Number}   loggedWork.hours          LoggedWork Hours
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "loggedWork": [{
 *        "_id": "5cf822da19965c5c3c48fc2a",
 *        "user": "myUser",
 *        "typeOfWork": "work",
 *        "project": "my project",
 *        "startTime": Date,
 *        "endTime": Date,
 *        "details": "details",
 *        "hours": 5,
 *
 *       }]
 *     }
 *
 *
 */
async function getLoggedWorks (ctx) {
  const loggedWork = await LoggedWork.find({})
  ctx.body = { loggedWork }
}

/**
 * @api {get} /loggedwork/:id Get  loggedwork by ID
 * @apiName GetLoggedWork
 * @apiGroup LoggedWork
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json"  -X GET localhost:5001/loggedwork/5cf822da19965c5c3c48fc2a
 *
 * @apiSuccess {LoggedWork[]} loggedWork            Array of LoggedWorks objects
 * @apiSuccess {ObjectId} loggedWork._id            LoggeWork id
 * @apiSuccess {String}   loggedWork.user           LoggeWork user
 * @apiSuccess {String}   loggedWork.typeOfWork     LoggeWork type
 * @apiSuccess {String}   loggedWork.project        Project
 * @apiSuccess {Date}   loggedWork.startTime      LoggedWork Start Time
 * @apiSuccess {Date}   loggedWork.endTime        LoggedWork End Time
 * @apiSuccess {String}   loggedWork.details        LoggedWork Details
 * @apiSuccess {Number}   loggedWork.hours          LoggedWork Hours
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "loggedWork": [{
 *        "_id": "5cf822da19965c5c3c48fc2a",
 *        "user": "myUser",
 *        "typeOfWork": "work",
 *        "project": "my project",
 *        "startTime": Date,
 *        "endTime": Date,
 *        "details": "details",
 *        "hours": 5,
 *
 *       }]
 *     }
 *
 *
 */

async function getLoggedWork (ctx, next) {
  try {
    const loggedWork = await LoggedWork.findById(ctx.params.id)
    if (!loggedWork) {
      ctx.throw(404)
    }

    ctx.body = {
      loggedWork
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
 * @api {put} /loggedwork/:id Update a LoggedWork
 * @apiPermission user
 * @apiName UpdateLoggedWork
 * @apiGroup LoggedWork
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -H "Authorization: Bearer <JWT Token>" -X PUT -d '{"loggedWork":{"user":"Daniel","project": "testProject"} }' localhost:5001/loggedwork/56bd1da600a526986cf65c80
 *
 * @apiSuccess {LoggedWork[]} loggedWork            Array of LoggedWorks objects
 * @apiSuccess {ObjectId} loggedWork._id            LoggeWork id
 * @apiSuccess {String}   loggedWork.user           LoggeWork user
 * @apiSuccess {String}   loggedWork.typeOfWork     LoggeWork type
 * @apiSuccess {String}   loggedWork.project        Project
 * @apiSuccess {Date}   loggedWork.startTime      LoggedWork Start Time
 * @apiSuccess {Date}   loggedWork.endTime        LoggedWork End Time
 * @apiSuccess {String}   loggedWork.details        LoggedWork Details
 * @apiSuccess {Number}   loggedWork.hours          LoggedWork Hours
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "loggedWork": [{
 *        "_id": "5cf822da19965c5c3c48fc2a",
 *        "user": "myUser",
 *        "typeOfWork": "work",
 *        "project": "my project",
 *        "startTime": Date,
 *        "endTime": Date,
 *        "details": "details",
 *        "hours": 5,
 *
 *       }]
 *     }
 *
 *
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
async function updateLoggedWork (ctx) {
  const loggedWork = ctx.body.loggedWork
  Object.assign(loggedWork, ctx.request.body.loggedWork)

  await loggedWork.save()

  ctx.body = {
    loggedWork
  }
}

/**
 * @api {delete} /loggedwork/:id Delete a LoggedWork
 * @apiPermission user
 * @apiName DeleteLoggedWork
 * @apiGroup LoggedWork
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -H "Authorization: Bearer <JWT Token>" -X DELETE localhost:5001/loggedwork/56bd1da600a526986cf65c80
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

async function deleteLoggedWork (ctx) {
  const loggedWork = ctx.body.loggedWork

  await loggedWork.remove()

  ctx.status = 200
  ctx.body = {
    success: true
  }
}

module.exports = {
  createLoggedWork,
  getLoggedWorks,
  getLoggedWork,
  updateLoggedWork,
  deleteLoggedWork
}
