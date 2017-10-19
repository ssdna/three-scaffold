/* global describe, it */
const THREE = require('three')
const assert = require('assert')

describe('THREE', function () {
  it('应该有常量 BasicShaowMap', function () {
    assert.notEqual('undefined', THREE.BasicShadowMap)
  })

  it('应该能构建 Vector3 类型变量，且其初始属性 x=0', function () {
    const vec3 = new THREE.Vector3()
    assert.equal(0, vec3.x)
  })
})
