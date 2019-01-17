import { request, config } from 'utils'

export async function query (params) {
  return request({
    url: '/canal/ucenter/findPage',
    method: 'post',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: '/canal/ucenter/insertOrUpdate',
    method: 'post',
    data: params,
  })
}
export async function remove (params) {
  return request({
    url: '/canal/ucenter/deleteUcenterUser',
    method: 'post',
    data: params,
  })
}

export async function update (params) {

  return request({
    url: '/canal/ucenter/insertOrUpdate',
    method: 'post',
    data: params,
  })
}
