import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'http://8.208.14.10:3000/',
    withCredentials: 'include'
  })
}
