import 'three/examples/js/controls/OrbitControls'
import Stats from 'three/examples/js/libs/stats.min.js'
import dat from 'three/examples/js/libs/dat.gui.min.js'
/**
 *
 * 抽象Application类，主要用来完成THREE场景初始化（如camera、scene等）和应用的设置
 *
 * @class AbstractApplication
 */
class AbstractApplication {
  constructor (debug) {
    this.debug = debug
    // camera
    this._camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000)
    this._camera.position.z = 700
    this._camera.position.x = -300
    this._camera.position.y = 200
    // scene & renderer
    this._scene = new THREE.Scene()
    this._renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    this._renderer.setPixelRatio(window.devicePixelRatio)
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this._renderer.domElement)
    // debug mode
    if (this.debug) {
      // dat.GUI
      this._gui = new dat.GUI()
      // Stats
      this._stats = new Stats()
      document.body.appendChild(this._stats.dom)
      // grid & axis helper
      const gridHelper = new THREE.GridHelper(1000, 20)
      this._scene.add(gridHelper)
      const axisHelper = new THREE.AxisHelper(500)
      this._scene.add(axisHelper)
    }
    // control
    this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement)
    // resize
    this._timeout_window_resize = null
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    // network sse
    this.sse()
  }

  get renderer () {
    return this._renderer
  }

  get camera () {
    return this._camera
  }

  get scene () {
    return this._scene
  }

  onWindowResize () {
    clearTimeout(this._timeout_window_resize)
    setTimeout(() => {
      this._camera.aspect = window.innerWidth / window.innerHeight
      this._camera.updateProjectionMatrix()

      this._renderer.setSize(window.innerWidth, window.innerHeight)
    }, this._timeout_window_resize)
  }

  sse () {
    if (window.EventSource) {
      this._eventSource = new EventSource('http://localhost:3003')
      this._eventSource.onmessage = msg => console.log(msg.data)
      this._eventSource.addEventListener('connected', e => console.log('connected at', e.data))
      this._eventSource.addEventListener('event1', e => console.log('event1 at', e.data))
      this._eventSource.addEventListener('event2', e => console.log('event2 at', e.data))
      this._eventSource.addEventListener('event3', e => console.log('event3 at', e.data))
    }
  }

  animate (timestamp) {
    requestAnimationFrame(this.animate.bind(this))

    if (this.debug) {
      this._stats.begin()
    }
    this._renderer.render(this._scene, this._camera)
    if (this.debug) {
      this._stats.end()
    }
  }
}

export default AbstractApplication
