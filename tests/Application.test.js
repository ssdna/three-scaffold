/* global describe, it */
const Application = require('../src/js/Application')
const AbstractApplication = require('../src/js/AbstractApplication')
const assert = require('assert')

describe('js/Application.js', function () {
  it('应该是AbstractApplication的实例', function () {
    assert.equal(true, Application instanceof AbstractApplication)
  })

  // it('应该能构建 Vector3 类型变量，且其初始属性 x=0', function () {
  //   const vec3 = new THREE.Vector3()
  //   assert.equal(0, vec3.x)
  // })
})
