import { request, config } from 'utils'

export async function query (params) {
  return request({
    url: '/canal/ownerOrder/queryOrderWithPage',
    method: 'post',
    data: params,
  })
}

export async function countNums (params) {
  return request({
    url: '/canal/ownerOrder/countNums',
    method: 'post',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: '/canal/ucenter/insertOrUpdate/:id',
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: '/canal/cargo/deleteCargo',
    method: 'post',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: '/canal/ucenter/insertOrUpdate',
    method: 'patch',
    data: params,
  })
}
export async function getMap (params) {
  return request({
    url: '/canal/cargo/getPatternDesc',
    method: 'post',
    data: {
      cargoId: params.currentItem.id
    },
  })
}
