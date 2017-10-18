import AbstractApplication from './AbstractApplication'

class Application extends AbstractApplication {
  constructor () {
    super()

    const geometry = new THREE.BoxGeometry(200, 200, 200)
    const material = new THREE.MeshBasicMaterial({color: 0xff0000})

    this._mesh = new THREE.Mesh(geometry, material)
    this._scene.add(this._mesh)

    this.animate()
  }
}

export default Application
