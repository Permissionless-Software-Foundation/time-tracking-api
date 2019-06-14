const testUtils = require('./utils')
const rp = require('request-promise')
const assert = require('chai').assert
const config = require('../config')

const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

const LOCALHOST = `http://localhost:${config.port}`

const context = {}

describe('LoggedWork', () => {
  before(async () => {
    const userObj = {
      username: 'test3',
      password: 'pass'
    }
    const testUser = await testUtils.loginTestUser(userObj)

    context.testUser = testUser

    // Get the admin JWT token.
    const adminJWT = await testUtils.getAdminJWT()
    console.log(`adminJWT: ${adminJWT}`)
    context.adminJWT = adminJWT
  })

  describe('POST - Create LoggedWork', () => {
    it('should reject loggedwork creation if no JWT provided', async () => {
      try {
        const options = {
          method: 'POST',
          uri: `${LOCALHOST}/loggedwork`,
          resolveWithFullResponse: true,
          json: true,
          body: {
            loggedWork: {
              user: 'myUser',
              project: 'myProject'
            }
          }
        }

        let result = await rp(options)
        console.log(`result stringified: ${JSON.stringify(result, null, 2)}`)

        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.statusCode === 401, 'Error code 401 expected.')
      }
    })

    it('should reject empty loggedwork', async () => {
      try {
        const options = {
          method: 'POST',
          uri: `${LOCALHOST}/loggedwork`,
          resolveWithFullResponse: true,
          json: true,
          body: {},
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${context.adminJWT}`
          }
        }

        await rp(options)
        // console.log(`result stringified: ${JSON.stringify(result, null, 2)}`)

        assert(false, 'Unexpected result')
      } catch (err) {
        // console.log(`err: ${JSON.stringify(err, null, 2)}`)

        assert.equal(err.statusCode, 422)
        assert.include(
          err.message,
          'Path `project` is required., user: Path `user` is required.'
        )
      }
    })
    it('should reject without project value', async () => {
      try {
        const options = {
          method: 'POST',
          uri: `${LOCALHOST}/loggedwork`,
          resolveWithFullResponse: true,
          json: true,
          body: {
            loggedWork: {
              user: 'myUser'
            }
          },
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${context.adminJWT}`
          }
        }

        await rp(options)
        // console.log(`result stringified: ${JSON.stringify(result, null, 2)}`)

        assert(false, 'Unexpected result')
      } catch (err) {
        // console.log(`err: ${JSON.stringify(err, null, 2)}`)

        assert.equal(err.statusCode, 422)
        assert.include(err.message, 'Path `project` is required.')
      }
    })
    it('should reject without user value', async () => {
      try {
        const options = {
          method: 'POST',
          uri: `${LOCALHOST}/loggedwork`,
          resolveWithFullResponse: true,
          json: true,
          body: {
            loggedWork: {
              project: 'myUser'
            }
          },
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${context.adminJWT}`
          }
        }

        await rp(options)
        // console.log(`result stringified: ${JSON.stringify(result, null, 2)}`)

        assert(false, 'Unexpected result')
      } catch (err) {
        // console.log(`err: ${JSON.stringify(err, null, 2)}`)

        assert.equal(err.statusCode, 422)
        assert.include(err.message, 'Path `user` is required.')
      }
    })
    it('should create loggedwork for  user with minimum inputs', async () => {
      // console.log(`adminJWT: ${context.adminJWT}`)

      const options = {
        method: 'POST',
        uri: `${LOCALHOST}/loggedwork`,
        resolveWithFullResponse: true,
        json: true,
        body: {
          loggedWork: {
            user: 'user',
            project: 'project'
          }
        },
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${context.adminJWT}`
        }
      }

      let result = await rp(options)
      // console.log(`result stringified: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.body.success, true, 'success expected')
    })
    it('should create loggedwork with all inputs', async () => {
      // console.log(`adminJWT: ${context.adminJWT}`)

      const options = {
        method: 'POST',
        uri: `${LOCALHOST}/loggedwork`,
        resolveWithFullResponse: true,
        json: true,
        body: {
          loggedWork: {
            user: 'Daniel',
            typeOfWork: 'REST API',
            project: 'myProject',
            details: 'details',
            hours: 9
          }
        },
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${context.adminJWT}`
        }
      }

      let result = await rp(options)
      // console.log(`result stringified: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.body.success, true, 'success expected')
    })
  })
  describe('GET /loggedwork', () => {
    it('should fetch all loggedworks', async () => {
      const options = {
        method: 'GET',
        uri: `${LOCALHOST}/loggedwork`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          Accept: 'application/json'
        }
      }

      const result = await rp(options)
      const loggedWork = result.body.loggedWork
      // console.log(`projects: ${util.inspect(projects)}`)

      context.loggedWorkId = loggedWork[1]._id

      assert.isArray(loggedWork)
      assert.hasAnyKeys(loggedWork[0], [
        '_id',
        'user',
        'project',
        'typesOfWork',
        'details',
        'hour'
      ])
    })
  })

  describe('GET /loggedwork/:id', () => {
    it("should throw 404 if loggedwork doesn't exist", async () => {
      try {
        const options = {
          method: 'GET',
          uri: `${LOCALHOST}/loggedwork/1`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Accept: 'application/json'
          }
        }
        await rp(options)
        assert.equal(true, false, 'Unexpected behavior')
      } catch (err) {
        assert.equal(err.statusCode, 404)
      }
    })

    it('should fetch loggedwork', async () => {
      const id = context.loggedWorkId

      const options = {
        method: 'GET',
        uri: `${LOCALHOST}/loggedwork/${id}`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          Accept: 'application/json'
        }
      }

      const result = await rp(options)
      const loggedWork = result.body.loggedWork
      // console.log(`project: ${util.inspect(project)}`)

      assert.hasAnyKeys(loggedWork, ['_id', 'user', 'project'])
      assert.equal(loggedWork._id, id)
    })

    it("should throw 404 if LoggedWork doesn't exist", async () => {
      try {
        const options = {
          method: 'GET',
          uri: `${LOCALHOST}/loggedwork/1`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Accept: 'application/json'
          }
        }

        await rp(options)
        assert.equal(true, false, 'Unexpected behavior')
      } catch (err) {
        assert.equal(err.statusCode, 404)
      }
    })
    it('should fetch loggedWork', async () => {
      const id = context.loggedWorkId

      const options = {
        method: 'GET',
        uri: `${LOCALHOST}/loggedwork/${id}`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          Accept: 'application/json'
        }
      }

      const result = await rp(options)
      const loggedwork = result.body.loggedWork
      // console.log(`project: ${util.inspect(project)}`)

      assert.hasAnyKeys(loggedwork, ['_id', 'user', 'project'])
      assert.equal(loggedwork._id, id)
    })
  })
  describe('PUT /loggedwork/:id', () => {
    it('should not update loggedwork if token is invalid', async () => {
      try {
        const options = {
          method: 'PUT',
          uri: `${LOCALHOST}/loggedwork/1`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer 1`
          }
        }

        await rp(options)
        assert.equal(true, false, 'Unexpected behavior')
      } catch (err) {
        assert.equal(err.statusCode, 401)
      }
    })

    it('should update loggedwork', async () => {
      const token = context.adminJWT
      const id = context.loggedWorkId

      const options = {
        method: 'PUT',
        uri: `${LOCALHOST}/loggedwork/${id}`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: {
          loggedWork: { user: 'Best user', project: 'Awesome Project' }
        }
      }

      const result = await rp(options)
      const loggedWork = result.body.loggedWork
      // console.log(`project: ${util.inspect(project)}`)

      assert.hasAnyKeys(loggedWork, ['_id', 'user', 'project'])
      assert.equal(loggedWork._id, id)
      assert.equal(loggedWork.user, 'Best user')
      assert.equal(loggedWork.project, 'Awesome Project')
    })
  })

  describe('DELETE /loggedwork/:id', () => {
    it('should not delete loggedwork if token is invalid', async () => {
      try {
        const options = {
          method: 'DELETE',
          uri: `${LOCALHOST}/loggedwork/1`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer 1`
          }
        }

        await rp(options)
        assert.equal(true, false, 'Unexpected behavior')
      } catch (err) {
        assert.equal(err.statusCode, 401)
      }
    })

    it('should delete loggedworks with authorization', async () => {
      const token = context.adminJWT
      const id = context.loggedWorkId

      const options = {
        method: 'DELETE',
        uri: `${LOCALHOST}/loggedwork/${id}`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const result = await rp(options)
      console.log(`result: ${util.inspect(result.body)}`)

      assert.equal(result.body.success, true)
    })
  })
})
