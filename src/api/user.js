import axios from 'axios'
import { Random } from 'mockjs'

export const getUsers = function () {
  return axios.get(`/users?id=${Random.integer(100, 1000)}`).then(res => console.log(res.data))
}
