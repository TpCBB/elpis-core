const assert = require('assert')
const supertest = require('supertest')
const md5 = require('md5')
const elpisCore = require('../../elpis-core/index.js')

const signKey = 'qwertyuiop1234567890'
const st = Date.now()

describe('project controller', function () {
  this.timeout(10000)
  let request
  let modelList
  let projectList = []
  it('启动服务', async () => {
    const app = await elpisCore.start()
    // 拿到完整的模型列表, 才可以在接口中返回的数据做对比
    modelList = require('../../model/index.js')(app)
    modelList.forEach((item) => {
      const { project } = item
      for (const pKey in project) {
        projectList.push(project[pKey])
      }
    })

    request = supertest(app.listen())
  })

  // /api/project/getList 没有传 projKey 参数
  it('GET /api/project/getList  without projKey', async () => {
    const tmpRequest = request.get('/api/project/getList')
    tmpRequest.set('s_t', st)
    tmpRequest.set('s_sign', md5(`${signKey}${st}`))
    const res = await tmpRequest
    assert(res.body.success === true)
    const data = res.body.data
    assert(data.length === projectList.length) // 没有传 projKey 参数, 返回所有的项目列表

    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      assert(item.modelKey)
      assert(item.key)
      assert(item.name)
      assert(item.desc !== undefined)
      assert(item.homePage !== undefined)
    }
  })

  // /api/project/getList 传 projKey 参数
  it('GET /api/project/getList  with projKey', async () => {
    const { key: projKey } = projectList[Math.floor(Math.random() * projectList.length)]
    const { modelKey } = projectList.find((item) => item.key === projKey)
    let tmpRequest = request.get('/api/project/getList')
    tmpRequest.set('s_t', st)
    tmpRequest.set('s_sign', md5(`${signKey}${st}`))
    tmpRequest.query({ proj_key: projKey })
    const res = await tmpRequest
    assert(res.body.success === true)
    const data = res.body.data
    assert(data.length > 0)

    assert(projectList.filter((item) => item.modelKey === modelKey).length === data.length) // 判断传了参数是否 和 相同模型下 返回的数据一样的长度
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      assert(item.modelKey)
      assert(item.key)
      assert(item.name)
      assert(item.desc !== undefined)
      assert(item.homePage !== undefined)
    }
  })

  // /api/project/getModelList
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

  // /api/project with projectKey
  it('GET /api/project with projectKey', async () => {
    const { key: projKey } = projectList[Math.floor(Math.random() * projectList.length)]
    const tmpRequest = request.get('/api/project')
    tmpRequest.set('s_t', st)
    tmpRequest.set('s_sign', md5(`${signKey}${st}`))
    tmpRequest.query({ proj_key: projKey })
    console.log(`GET /api/project with projectKey projKey`,projKey)

    const res = await tmpRequest

    assert(res.body.success === true)
    const resData = res.body.data
    assert(resData.key === projKey)
    assert(resData.modelKey)
    assert(resData.desc !== undefined)
    assert(resData.homePage !== undefined)

    const { menu } = resData

    menu.forEach((menuItem) => {
      checkMenuItem(menuItem)
    })
    // 校验 menu 菜单
    function checkMenuItem(menuItem) {
      console.log(`/api/project with projectKey checkMenuItem -> menuItem`,menuItem.key)
      assert(menuItem.key)
      assert(menuItem.name)
      assert(menuItem.menuType)

      if (menuItem.menuType === 'group') {
        assert(menuItem.subMenu !== undefined)
        menuItem.subMenu.forEach((subMenuItem) => {
          console.log(`output->subMenuItem`, subMenuItem.name)
          checkMenuItem(subMenuItem)
        })
      }

      if (menuItem.menuType === 'module') {
        checkModuleItem(menuItem)
      }
    }
    // 校验 module 模块
    function checkModuleItem(menuItem) {
      const { moduleType } = menuItem
      assert(moduleType)
      if (moduleType === 'sider') {
        const { siderConfig } = menuItem
        assert(siderConfig)
        assert(siderConfig.menu)
        siderConfig.menu.forEach((siderMenuItem) => {})
      }
      if (moduleType === 'iframe') {
        const { iframeConfig } = menuItem
        assert(iframeConfig)
        assert(iframeConfig.path !== undefined)
      }
      if (moduleType === 'custom') {
        const { customConfig } = menuItem
        assert(customConfig)
        assert(customConfig.path !== undefined)
      }
      if (moduleType === 'schema') {
        const { schemaConfig } = menuItem
        assert(schemaConfig)
        assert(schemaConfig.api !== undefined)
        assert(schemaConfig.schema)
      }
    }
  })

  // /api/project without projectKey
  it('GET /api/project without projectKey', async () => {
    const tmpRequest = request.get('/api/project')
    tmpRequest.set('s_t', st)
    tmpRequest.set('s_sign', md5(`${signKey}${st}`))
    const res = await tmpRequest
    assert(res.body.success === false)
    const resBody = res.body
    assert(resBody.code === 442)
    assert(resBody.message.indexOf('validate error') > -1)
  })

  // /api/project fail
  it('GET /api/project fail', async () => {
    const tmpRequest = request.get('/api/project')
    tmpRequest.set('s_t', st)
    tmpRequest.set('s_sign', md5(`${signKey}${st}`))
    tmpRequest.query({ proj_key: '1234567890' })
    const res = await tmpRequest
    assert(res.body.success === false)
    const resBody = res.body
    assert(resBody.code === 50000)
    assert(resBody.message.indexOf('获取项目异常') > -1)
  })
})
