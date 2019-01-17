/**
 * Created by G2_User on 2017/11/6.
 */
import { request, config } from 'utils'
export async function searchVehicleTimeById (params) {
  return request({
    url: '/canal/vehicleTime/searchVehicleTimeById',
    method: 'get',
    data: params,
  })
}

export async function vehicleTime (params) {
  return request({
    url: '/canal/cargo/findpage',
    method: 'get',
    data: params,
  })
}
export async function lockVehicleTime (params) {
  return request({
    url: '/canal/vehicleTime/lockVehicleTime',
    method: 'post',
    data: params,
  })
}
