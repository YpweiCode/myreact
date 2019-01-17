import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import lodash from 'lodash'
import {query} from 'services/cargoInfo/timeCarList'
import { pageModel } from '../common'
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'timeCarList',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    count:{},
    routerDetail: {},

  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/cargo/timeCarList') {
          let payload = location.query || { current: 1, pageSize: 10}
          payload.pickDistrictCode = "5101"
          payload.sendDistrictCode = "5101"
          payload.status="1"
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.result,
            pagination: {
              current: Number(data.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.totalPages,
            },
            dataSource: data.result

          },
        })
      }
    },

  },

  reducers: {

  }
})
