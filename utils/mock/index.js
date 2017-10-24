import Mock from 'mockjs'

const usersTemplate = {
  'users|3-7': [{
    'id|+1': 1,
    'email': '@EMAIL',
    'name': '@cname',
    'address': '@province @city'
  }]
}

const mock = {
  init () {
    Mock.setup({
      timeout: '200-600'
    })
    // 拦截ajax请求，正则匹配url + type
    Mock.mock(/\/users/, 'get', usersTemplate)
  }
}

export default mock
