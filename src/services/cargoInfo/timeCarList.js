import { request, config } from 'utils'

export async function query (params) {
  return request({
    url: '/canal/vehicleTime/findPage',
    method: 'post',
    data: params,
  })
}
