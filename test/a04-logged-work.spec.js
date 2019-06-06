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
    const testUser = await testUtils.loginTestUser()

    context.testUser = testUser

    // Get the admin JWT token.
    const adminJWT = await testUtils.getAdminJWT()
    // console.log(`adminJWT: ${adminJWT}`)
    context.adminJWT = adminJWT
  })

  describe('', () => {
    it('should do something', () => {
      assert.equal(true, true)
    })
  })
})
