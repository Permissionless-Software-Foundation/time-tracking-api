
const LoggedWork = require('../../models/logged-work')

async function createLoggedWork (ctx) {
  const loggedWork =   new LoggedWork(ctx.request.body.loggedWork) ;


  try {
    await loggedWork.save()
  } catch (err) {
    ctx.throw(422, err.message)
  }

  ctx.body = {
    loggedWork: true,
    
  }
}

async function getLoggedWorks (ctx) {
  const loggedWork = await LoggedWork.find({})
  ctx.body = { loggedWork }
}

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

  if (next) { return next() }
}

async function updateLoggedWork (ctx) {
   const loggedWork = ctx.body.loggedWork
   Object.assign(loggedWork, ctx.request.body.loggedWork);

  await loggedWork.save()

  ctx.body = {
    loggedWork
  }
}

async function deleteLoggedWork (ctx) {
 
  const loggedWork = ctx.body.loggedWork;

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