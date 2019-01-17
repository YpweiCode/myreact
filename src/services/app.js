import { request, config } from 'utils'

export async function login (params) {
  return request({
    url: 'canal/ucenterUser/login',
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: 'canal/ucenterUser/logout',
    method: 'get',
    data: params,
  })
}
