import { request, config } from 'utils'

export async function query (params) {
  return request({
    url: '/canal/vehicleTime/findPage',
    method: 'post',
    data: params,
  })
}


export async function count (params) {
  return request({
    url: '/canal/vehicleTime/findCountWithStatus',
    method: 'post',
    data: params,
  })
}
export async function getmethod (params) {
  return request({
    url: '/canal/cargo/getPatternDesc',
    method: 'post',
    data: params,
  })
}
export async function refuse (params) {
  return request({
    url: '/canal/vehicleTime/updateStatusToRefuse',
    method: 'post',
    data: params,
  })
}
export async function deleteVehicleTime (params) {
  return request({
    url: '/canal/vehicleTime/deleteVehicleTime',
    method: 'post',
    data: params,
  })
}
export async function updateStatusToIssue (params) {
  return request({
    url: '/canal/vehicleTime/updateStatusToIssue',
    method: 'post',
    data: params,
  })
}
export async function updateStatusToLock (params) {
  return request({
    url: '/canal/vehicleTime/updateStatusToLock',
    method: 'post',
    data: params,
  })
}


