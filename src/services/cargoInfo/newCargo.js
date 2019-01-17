import { request, config } from 'utils'


export async function addAddr (params) {
  return request({
    url: '/canal/address/insertAddress',
    method: 'post',
    data: {
      districtId: params.pickDistrictCode,
      pickingLat: params.pickLat,
      pickingLng: params.pickLng,
      pickAddress: params.pickDetailAddress
    },
  })
}
export async function create (params) {
  return request({
    url: '/canal/cargo/insertCargo',
    method: 'post',
    data: params,
  })
}




export async function getinsertAddress (params) {
  return request({
    url: '/canal/address/insertAddress',
    method: 'post',
    data: params,
  })
}

export async function getadd (params) {
  return request({
    url: '/canal/address/searchByDeliverId',
    method: 'post',
    data: params,
  })
}
export async function findAllValueByTyp (params) {
  return request({
    url: '/canal/dictionary/findAllValueByType',
    method: 'get',
    data: params,
  })
}
