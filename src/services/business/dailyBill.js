import { request, config } from 'utils'

export async function query (params) {
  return request({
    url: '/canal/bill/findPage',
    method: 'post',
    data: params,
  })
}

export async function getNames (params) {
  return request({
    url: '/canal/bill/getNames',
    method: 'put',
    data: params,
  })
}

export async function billConfirm (params) {
  return request({
    url: '/canal/bill/billConfirm',
    method: 'put',
    data: params,
  })
}

export async function updateMoney (params) {
  return request({
    url: '/canal/bill/updateMoney',
    method: 'post',
    data: params,
  })
}

export async function queryCargos (params) {
  return request({
    url: '/canal/bill/getCargoDetail',
    method: 'put',
    data: params,
  })
}
