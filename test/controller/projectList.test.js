const assert = require('assert')
const supertest = require('supertest')
const md5 = require('md5')
const elpisCore = require('../../elpis-core/index.js')

const signKey = 'qwertyuiop1234567890'
const st = Date.now()

describe('project controller', function () {
  this.timeout(10000)
  let request

  it('启动服务', async () => {
    const app = await elpisCore.start()
    request = supertest(app.listen())
  })

  it('GET /api/project/getModelList', async () => {
    const tmpRequest = request.get('/api/project/getModelList')
    tmpRequest.set('s_t', st)
    tmpRequest.set('s_sign', md5(`${signKey}${st}`))
    const res = await tmpRequest
    assert(res.body.success === true)
    const data = res.body.data
    assert(data.length > 0)
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      assert(item.model)
      assert(item.model.name)
      for (const projKey in item.project) {
        const projItem = item.project[projKey]
        assert(projItem.key)
        assert(projItem.name)
        assert(projItem.desc)
        // assert(projItem.homePage)
      }
    }
  })
})
