/**
 * Created by G2_User on 2017/11/21.
 */
import { request, config } from 'utils'

export async function queryVehicleTimeList (params) {
  return request({
    url: '/canal/vehicleTime/findVehicleTimeByCondition',
    method: 'post',
    data: params,
  })
}

export async function queryBillList (params) {
  return request({
    url: '/canal/bill/findAllBillsWithCurrentDate',
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

export async function getLocHistoryurl (params) {
  return request({
    url: '/canal/cargo/getLocHistory/'+params,
    method: 'get',
    //data: params,
  })
}
