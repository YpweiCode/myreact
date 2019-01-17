/**
 * Created by G2_User on 2017/11/6.
 */
import { request, config } from 'utils'
export async function getadd (params) {
  return request({
    url: '/canal/address/searchByDeliverId',
    method: 'post',
    data: params,
  })
}
export async function query (params) {
  return request({
    url: '/canal/vehicle/findPageVehicle',
    method: 'post',
    data: params,
  })
}export async function getdriver (params) {
  return request({
    url: '/canal/vehicle/searchByVehicleNo',
    method: 'post',
    data: params,
  })
}
export async function getEditDate1 (params) {
  return request({
    url: '/canal/vehicleTime/searchVehicleTimeById',
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
export async function VehicleTime (params) {
  return request({
    url: '/canal/vehicleTime/insertVehicleTime',
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
export async function findAllValueByTyp (params) {
  return request({
    url: '/canal/dictionary/findAllValueByType',
    method: 'get',
    data: params,
  })
}
