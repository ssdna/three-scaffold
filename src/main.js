import Application from './js/Application'
import mock from '../utils/mock'
import { getUsers } from './api/user'

const a = new Application(true)
mock.init()

window.a = a
window.getUsers = getUsers

export default a
