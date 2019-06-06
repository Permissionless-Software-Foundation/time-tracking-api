const testUtils = require('./utils')
const rp = require('request-promise')
const assert = require('chai').assert
const config = require('../config')

const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

const LOCALHOST = `http://localhost:${config.port}`

const context = {}

describe('Projects', () => {
  before(async () => {
    // Create a second test user.
    const userObj = {
      username: 'test2',
      password: 'pass'
    }
    const testUser = await testUtils.createUser(userObj)

    context.testUser = testUser

    // Get the admin JWT token.
    const adminJWT = await testUtils.getAdminJWT()
    // console.log(`adminJWT: ${adminJWT}`)
    context.adminJWT = adminJWT
  })

  describe('POST - Create Project', () => {
    it('should reject project creation if no JWT provided', async () => {
      try {
        const options = {
          method: 'POST',
          uri: `${LOCALHOST}/projects`,
          resolveWithFullResponse: true,
          json: true,
          body: {
            project: {
              title: 'test project'
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

    it('should reject project creation for non-admin user', async () => {
      try {
        const options = {
          method: 'POST',
          uri: `${LOCALHOST}/projects`,
          resolveWithFullResponse: true,
          json: true,
          body: {
            project: {
              title: 'test project'
            }
          },
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${context.testUser.token}`
          }
        }

        let result = await rp(options)
        console.log(`result stringified: ${JSON.stringify(result, null, 2)}`)

        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.statusCode === 401, 'Error code 401 expected.')
      }
    })

    it('should reject empty project', async () => {
      try {
        const options = {
          method: 'POST',
          uri: `${LOCALHOST}/projects`,
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
        assert.include(err.message, 'Path `title` is required')
      }
    })

    it('should create project for admin user with minimum inputs', async () => {
      // console.log(`adminJWT: ${context.adminJWT}`)

      const options = {
        method: 'POST',
        uri: `${LOCALHOST}/projects`,
        resolveWithFullResponse: true,
        json: true,
        body: {
          project: {
            title: 'test project'
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

    it('should create project with all inputs', async () => {
      // console.log(`adminJWT: ${context.adminJWT}`)

      const options = {
        method: 'POST',
        uri: `${LOCALHOST}/projects`,
        resolveWithFullResponse: true,
        json: true,
        body: {
          project: {
            title: 'test project',
            projectLead: 'projectLead',
            briefContent: 'briefContent',
            extendedContent: 'extendedContent',
            projectContact: 'projectContact',
            contributors: ['id1', 'id2'],
            projectWork: ['id3', 'id4'],
            typesOfWork: ['type1', 'type2']
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

  describe('GET /projects', () => {
    it('should not fetch projects if the authorization header is missing', async () => {
      try {
        const options = {
          method: 'GET',
          uri: `${LOCALHOST}/projects`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Accept: 'application/json'
          }
        }

        await rp(options)

        assert.equal(true, false, 'Unexpected behavior')
      } catch (err) {
        assert.equal(err.statusCode, 401)
      }
    })

    it('should not fetch projects if the authorization header is missing the scheme', async () => {
      try {
        const options = {
          method: 'GET',
          uri: `${LOCALHOST}/projects`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Accept: 'application/json',
            Authorization: '1'
          }
        }

        await rp(options)
        assert.equal(true, false, 'Unexpected behavior')
      } catch (err) {
        assert.equal(err.statusCode, 401)
      }
    })

    it('should not fetch projects if the authorization header has invalid scheme', async () => {
      const { token } = context
      try {
        const options = {
          method: 'GET',
          uri: `${LOCALHOST}/projects`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Accept: 'application/json',
            Authorization: `Unknown ${token}`
          }
        }

        await rp(options)
        assert.equal(true, false, 'Unexpected behavior')
      } catch (err) {
        assert.equal(err.statusCode, 401)
      }
    })

    it('should not fetch projects if token is invalid', async () => {
      try {
        const options = {
          method: 'GET',
          uri: `${LOCALHOST}/projects`,
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

    it('should fetch all projects', async () => {
      const token = context.testUser.token

      const options = {
        method: 'GET',
        uri: `${LOCALHOST}/projects`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const result = await rp(options)
      const projects = result.body.projects
      console.log(`projects: ${util.inspect(projects)}`)

      assert.isArray(projects)
      assert.hasAnyKeys(projects[0], [
        '_id',
        'title',
        'projectWork',
        'typesOfWork'
      ])
    })
  })
  /*
  describe('GET /users/:id', () => {
    it('should not fetch user if token is invalid', async () => {
      try {
        const options = {
          method: 'GET',
          uri: `${LOCALHOST}/users/1`,
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

    it("should throw 404 if user doesn't exist", async () => {
      const { token } = context

      try {
        const options = {
          method: 'GET',
          uri: `${LOCALHOST}/users/1`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        }

        await rp(options)
        assert.equal(true, false, 'Unexpected behavior')
      } catch (err) {
        assert.equal(err.statusCode, 404)
      }
    })

    it('should fetch user', async () => {
      const {
        user: { _id },
        token
      } = context

      const options = {
        method: 'GET',
        uri: `${LOCALHOST}/users/${_id}`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const result = await rp(options)
      const user = result.body.user
      // console.log(`user: ${util.inspect(user)}`)

      assert.hasAnyKeys(user, ['type', '_id', 'username'])
      assert.equal(user._id, _id)
      assert.notProperty(
        user,
        'password',
        'Password property should not be returned'
      )
    })
  })

  describe('PUT /users/:id', () => {
    it('should not update user if token is invalid', async () => {
      try {
        const options = {
          method: 'PUT',
          uri: `${LOCALHOST}/users/1`,
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

    it('should throw 401 if non-admin updating other user', async () => {
      const { token } = context

      try {
        const options = {
          method: 'PUT',
          uri: `${LOCALHOST}/users/1`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        }

        await rp(options)
        assert.equal(true, false, 'Unexpected behavior')
      } catch (err) {
        assert.equal(err.statusCode, 401)
      }
    })

    it('should update user', async () => {
      const {
        user: { _id },
        token
      } = context

      const options = {
        method: 'PUT',
        uri: `${LOCALHOST}/users/${_id}`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: {
          user: { username: 'updatedcoolname' }
        }
      }

      const result = await rp(options)
      const user = result.body.user
      // console.log(`user: ${util.inspect(user)}`)

      assert.hasAnyKeys(user, ['type', '_id', 'username'])
      assert.equal(user._id, _id)
      assert.notProperty(
        user,
        'password',
        'Password property should not be returned'
      )
      assert.equal(user.username, 'updatedcoolname')
    })

    it('should not be able to update user type', async () => {
      try {
        const options = {
          method: 'PUT',
          uri: `${LOCALHOST}/users/${context.user._id.toString()}`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Authorization: `Bearer ${context.token}`
          },
          body: {
            user: {
              name: 'new name',
              type: 'test'
            }
          }
        }

        let result = await rp(options)

        // console.log(`Users: ${JSON.stringify(result, null, 2)}`)

        assert(result.statusCode === 200, 'Status Code 200 expected.')
        assert(result.body.user.type === 'user', 'Type should be unchanged.')
      } catch (err) {
        console.error('Error: ', err)
        console.log('Error stringified: ' + JSON.stringify(err, null, 2))
        throw err
      }
    })

    it('should not be able to update other user', async () => {
      try {
        const options = {
          method: 'PUT',
          uri: `${LOCALHOST}/users/${context.user2._id.toString()}`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Authorization: `Bearer ${context.token}`
          },
          body: {
            user: {
              name: 'This should not work'
            }
          }
        }

        let result = await rp(options)

        console.log(`result stringified: ${JSON.stringify(result, null, 2)}`)
        assert(false, 'Unexpected result')
      } catch (err) {
        if (err.statusCode === 401) {
          assert(err.statusCode === 401, 'Error code 401 expected.')
        } else {
          console.error('Error: ', err)
          console.log('Error stringified: ' + JSON.stringify(err, null, 2))
          throw err
        }
      }
    })
  })

  describe('DELETE /users/:id', () => {
    it('should not delete user if token is invalid', async () => {
      try {
        const options = {
          method: 'DELETE',
          uri: `${LOCALHOST}/users/1`,
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

    it('should throw 401 if deleting other user', async () => {
      const { token } = context

      try {
        const options = {
          method: 'DELETE',
          uri: `${LOCALHOST}/users/1`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        }

        await rp(options)
        assert.equal(true, false, 'Unexpected behavior')
      } catch (err) {
        assert.equal(err.statusCode, 401)
      }
    })

    it('should not be able to delete other users unless admin', async () => {
      try {
        const options = {
          method: 'DELETE',
          uri: `${LOCALHOST}/users/${context.user2._id.toString()}`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            Authorization: `Bearer ${context.token}`
          }
        }

        let result = await rp(options)

        console.log(`result stringified: ${JSON.stringify(result, null, 2)}`)
        assert(false, 'Unexpected result')
      } catch (err) {
        if (err.statusCode === 401) {
          assert(err.statusCode === 401, 'Error code 401 expected.')
        } else {
          console.error('Error: ', err)
          console.log('Error stringified: ' + JSON.stringify(err, null, 2))
          throw err
        }
      }
    })

    it('should delete user', async () => {
      const {
        user: { _id },
        token
      } = context

      const options = {
        method: 'DELETE',
        uri: `${LOCALHOST}/users/${_id}`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const result = await rp(options)
      // console.log(`result: ${util.inspect(result.body)}`)

      assert.equal(result.body.success, true)
    })
  })
  */
})
