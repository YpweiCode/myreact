import { request, config } from 'utils'

export async function searchCargoById (params) {
  return request({
    url: '/canal/cargo/searchCargoById',
    method: 'post',
    data: params,
  })
}

export async function getCarList (params) {
  return request({
    url: '/canal/cargo/searchMatchingByCargoId',
    method: 'post',
    data: params,
  })
}

export async function chooseTheCar (params) {
  return request({
    url: '/canal/cargo/chooseMatching',
    method: 'post',
    data: params,
  })
}

