import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { query,  thinkVehicleNo,thinkCarType, create,update,deleteBatch} from '../../../services/business/vehicle.js'
import { pageModel } from '../../common'
const { prefix } = config
import { message } from 'antd';

export default modelExtend(pageModel, {
  namespace: 'vehiclees',

  state: {
    dataSource:[],
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    vehicleNo:[],
    carType:[],
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bussiness/carInfor') {
          const payload = location.query || { current: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload
          })
          dispatch({
            type: 'thinkVehicleNo',
            payload:{ vehicleNo: ""}
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload);
      if(data && data.success){
        yield put({
          type: 'querySuccess',
          payload: {
            list:data.result,
            pagination: {
              current: Number(data.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.totalPages,
            },
            dataSource: data.result
          }
        })
      }
    },

    * thinkVehicleNo({ payload = {} }, { call, put }) {
      const data = yield call(thinkVehicleNo, payload);
      if(data && data.success){
        yield put({
          type: 'updateState',
          payload: {
            vehicleNo: data.list
          }
        })
      }
    },

    * thinkCarType({ payload = {} }, { call, put }) {
      const data = yield call(thinkCarType, payload);
      if(data && data.success){
        yield put({
          type: 'updateState',
          payload: {
            carType: data.list
          }
        })
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' ,
          payload :{
            current: 1, pageSize: 10
          }
        })
        message.success('新增成功')
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ vehiclees }) => vehiclees.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query',
          payload :{
            current: 1, pageSize: 10
          }
        })
        message.success('修改成功')
      } else {
        throw data
      }
    },

    * deleteBatch ({ payload }, { call, put }) {
      const data = yield call(deleteBatch, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' ,
          payload :{
            current: 1, pageSize: 10
          }
        })
        message.success('删除成功')
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

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
})
