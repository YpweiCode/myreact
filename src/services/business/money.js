import { request, config } from 'utils'

export async function findPage (params) {
  return request({
    url: '/canal/ucenter/findPage',
    method: 'post',
    data: params,
  })
}

export async function search (params) {
  return request({
    url: '/canal/ucenter/search',
    method: 'post',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: '/canal/ucenter/search/' + params.id,
    method: 'get',
  })
}

export async function confirm (params) {
  return request({
    url: '/canal/ucenter/insertOrUpdate',
    method: 'post',
    data: params,
  })
}
