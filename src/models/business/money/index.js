import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { message } from 'antd'
import { findPage, search, confirm, update } from '../../../services/business/money.js'
import { pageModel } from '../../common'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'money',

  state: {
    dataSource: [],
    modalVisible: false,
    modalType: 'confirm',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bussiness/money/search') {
          const payload = location.query || { current: 1, pageSize: 10 }
          dispatch({
            type: 'findPage',
            payload,
          })
        }
      })
    },
  },

  effects: {
    * findPage ({ payload = {} }, { select, call, put }) {
      if(typeof payload.city =="object"){
          if(payload.city.length==1){
            payload.province=payload.city[0]
            payload.area=""
            payload.city=""
          }else if(payload.city.length==2){
            payload.province=payload.city[0]
            payload.area=""
            payload.city=payload.city[1]
          }else {
            payload.province=payload.city[0]
            payload.area= payload.city[2]
            payload.city=payload.city[1]
          }
      }

      const data = yield call(findPage, payload)
      if (data && data.success) {
        yield put({
          type: 'updateState',
          payload: {
            pagination: {
              current: data.pageNum,
              pageSize: data.pageSize,
              total: data.totalPages,
            },
            dataSource: data.result,
          },
        })
      }
    },

    * update ({ payload }, { select, call, put }) {
      const data = yield call(update, payload.id);
      if (data && data.success) {
        if(data.nature==4){
          data.natureName="货主"
        }else{
          data.natureName="承运商"
        }
        yield put({
          type: 'showModal',
          payload: {
            currentItem: {
              ...payload,
              ...data,
            },
          },
        })
      }
    },

    * confirm ({ payload }, { select, call, put }) {
      const confirmData = {
        ...payload,
        gatheringDate: payload.gatheringDate.format('YYYY-MM-DD HH:mm:ss'),
      }
      const data = yield call(confirm, confirmData)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({
          type: 'findPage',
          payload: {
            current: 1,
            pageSize: 10,
          },
        })
        message.success('修改成功')
      } else {
        throw data
      }
    },
  },

  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    showModal (state, { payload }) {

      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: false }
    },

  },
})
