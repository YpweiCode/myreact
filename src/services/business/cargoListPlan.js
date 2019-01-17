/**
 * Created by G2_User on 2017/11/6.
 */
import { request, config } from 'utils'
export async function getCargos (params) {
  return request({
    url: '/canal/cargo/queryCargoWithPage',
    method: 'post',
    data: params,
  })
}

export async function getPlan (params) {
  return request({
    url: '/canal/cargo/matching',
    method: 'get',
    data: params,
  })
}

export async function selectPlan (params) {
  return request({
    url: '/canal/cargo/selectPlan',
    method: 'post',
    data: params,
  })
}
