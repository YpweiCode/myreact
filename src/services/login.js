import { request, config } from 'utils'

export async function login (data) {
  return request({
    url: 'canal/ucenterUser/login',
    method: 'post',
    data,
  })
}

export async function getKey (data) {
  return request({
    url: 'canal/ucenterUser/signFactory',
    method: 'post'
  })
}


export async function getcode (data) {
  return request({
    url: '/canal/ucenterUser/getValiCode',
    method: 'post',
    data,
  })
}



// 忘记密码

export async function sendCodeToPhone (data) {
  return request({
    url: '/canal/ucenterUser/getCode',
    method: 'post',
    data,
  })
}
export async function updatePassword (data) {
  return request({
    url: '/canal/ucenterUser/updatePassword',
    method: 'post',
    data,
  })
}
