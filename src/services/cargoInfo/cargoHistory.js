import { request, config } from 'utils'

export async function query (params) {
  return request({
    url: '/canal/cargo/queryCargoWithPage',
    method: 'post',
    data: params,
  })
}

export async function getCargoStatusurl (params) {
  return request({
    url: '/canal/cargo/getCargoStatus',
    method: 'post',
    data: params,
  })
}
export async function getImg (params) {
  return request({
    url: '/canal/cargo/getSignResult/'+params,
    method: 'get',
  })
}

export async function getLocHistoryurl (params) {
  return request({
    url: '/canal/cargo/getLocHistory/'+params,
    method: 'get',
    //data: params,
  })
}

