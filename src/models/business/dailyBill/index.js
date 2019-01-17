import modelExtend from 'dva-model-extend'
import {config} from 'utils'
import {query, getNames, billConfirm, updateMoney, queryCargos} from '../../../services/business/dailyBill.js'
import {pageModel} from '../../common'

const {prefix} = config
import {message} from 'antd';

export default modelExtend(pageModel, {
  namespace: 'dailyBill',
  state: {
    dataSource:[],
    currentItem: {},
    modalVisible: false,
    cargoVisible: false,
    customIds:[],
    cargos:[],
    selectedRows:[],
    limitConfirm: true,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bussiness/dailyBill') {
          const payload = location.query || { current: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          });
          dispatch({
            type: 'getNames',
            payload:{ names: '',roleType:'3'}
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      if(payload.startTime&&payload.startTime.indexOf("NaN")!=-1){
        payload.startTime=""
        payload.endTime=""
      }
      delete payload.style
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
            selectedRows:[],
            selectedRowKeys:[],
            limitConfirm: true,
            dataSource: data.result
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            selectedRows: [],
            selectedRowKeys:[],
          },
        })
      }
    },

    * getNames({ payload = {} }, { call, put }) {
      const data = yield call(getNames, payload);
      if(data && data.success){
        yield put({
          type: 'updateState',
          payload: {
            customIds: data.list
          }
        })
      }
    },

    * billConfirm ({ payload }, { call, put }) {
      const data = yield call(billConfirm, payload)
      if (data.success) {
        yield put({ type: 'query' ,
          payload :{
            current: 1, pageSize: 10,
            selectedRowKeys:[]
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            selectedRows: [],
            selectedRowKeys:[],
          },
        })
        message.success('确认成功')
      } else {
        throw data
      }
    },

    * update ({ payload }, { call, put }) {
      const data = yield call(updateMoney, payload)
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

    * queryCargos ({ payload }, {call, put }) {
      const data = yield call(queryCargos, payload)
      if(data && data.success){
        yield put({
          type: 'updateState',
          payload: {
            cargos: data.list
          }
        })
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

    showCargo (state, { payload }) {
      return { ...state, ...payload, cargoVisible: true }
    },
    hideCargo (state) {
      return { ...state, cargoVisible: false }
    },
  },
})
