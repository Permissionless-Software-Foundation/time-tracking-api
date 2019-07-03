const config = require('../../../config')
const rp = require('request-promise')
const readJson = require('../../lib/utils/json-files')
const JSON_FILE = `system-user-${config.env}.json`
const JSON_PATH = `${__dirname}/../../../config/${JSON_FILE}`
const LOCALHOST = `http://localhost:${config.port}`

async function updateWorkAndContributor (ctx, logwork) {
  const log = await login()
  const userId = ctx.state.user._id
  const token = log.body.token

  const project = await getProject(ctx.request.body.loggedWork.project, token)
  const resp = await updateProject(project, userId, token, logwork._id)

  return resp
}

async function login () {
  let admin
  // try login
  try {
    admin = await readJson.readJSON(JSON_PATH)
    //  console.log(`admin: ${JSON.stringify(admin, null, 2)}`);

    // Log in as the user.
    let options = {
      method: 'POST',
      uri: `${LOCALHOST}/auth`,
      resolveWithFullResponse: true,
      json: true,
      body: {
        username: 'system',
        password: admin.password
      }
    }
    let result = await rp(options)
    //  console.log(`resultLogin: ${JSON.stringify(result, null, 2)}`)
    return result
  } catch (err) {
    throw err
  }
}
async function getProject (projectId, token) {
  if (!projectId || !token) {
    return false
  }

  try {
    let options = {
      method: 'GET',
      uri: `${LOCALHOST}/projects/${projectId}`,
      resolveWithFullResponse: true,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const result = await rp(options)
    return result.body.project
  } catch (err) {
    return false
  }
}
async function updateProject (pro, idUser, token, idLogWork) {
  if (!pro || !idUser || !token || !idLogWork) {
    return false
  }
  const contributorsList = pro.contributors
  const projectWorkList = pro.projectWork

  projectWorkList.push(idLogWork)
  const existId = await VerifyingExistingID(pro.contributors, idUser)
  if (!existId) { contributorsList.push(idUser) } // If the UUID of the contributor doesn't exist we add it the array

  // try update
  try {
    let options = {
      method: 'PUT',
      uri: `${LOCALHOST}/projects/${pro._id}`,
      resolveWithFullResponse: true,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        project: {
          _id: pro._id,
          ...pro,
          contributors: contributorsList,
          projectWork: projectWorkList
        }
      }
    }
    await rp(options)
    //  console.log(`resultUpdate: ${JSON.stringify(result, null, 2)}`)
    return true
  } catch (err) {
    return false
  }
}
async function VerifyingExistingID (contributorsList, idUser) {
  if (!contributorsList || !contributorsList.length) {
    return false
  }
  return contributorsList.find((val) => {
    return val.toString() === idUser.toString()
  })
}

module.exports = {
  updateWorkAndContributor
}
