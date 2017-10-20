import Application from './js/Application'

const a = new Application(true)
a.sss = function () {
  console.log(322)
}

a.sss()

window.a = a

export default a
