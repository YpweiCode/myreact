import { request, config } from 'utils'

export async function query (params) {
  return request({
    url: '/canal/vehicle/findPageVehicle',
    method: 'post',
    data: params,
  })
}

export async function thinkVehicleNo (params) {
  return request({
    url: '/canal/vehicle/thinkVehicleNo',
    method: 'post',
    data: params,
  })
}

export async function thinkCarType (params) {
  return request({
    url: '/canal/carType/thinkCarType',
    method: 'post',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: '/canal/vehicle/insertVehicle',
    method: 'post',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: '/canal/vehicle/insertVehicle',
    method: 'post',
    data: params,
  })
}

export async function deleteBatch (params) {
  return request({
    url: '/canal/vehicle/deleteVehicleByIdList',
    method: 'post',
    data: params,
  })
}
