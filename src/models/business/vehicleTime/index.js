import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { query,count ,deleteVehicleTime,updateStatusToIssue,updateStatusToLock, refuse,getmethod} from '../../../services/business/vehicleTime.js'
import { pageModel } from '../../common'
import { routerRedux } from 'dva/router'
const { prefix } = config
import { message } from 'antd';
export default modelExtend(pageModel, {
  namespace: 'vehicleTime',

  state: {
    dataSource:[],
    countData:0,
    noCountData:0,
    lockCountData:0,
    refusemodalVisible:false,
    AddModelVisible:false,
    readyCountData:0,
    routerDetail:"",
    modalVisible:"",
    selectedRowKeys:"",
    selectedRows:""
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bussiness/vehicleTime') {
          const payload = location.query || { pageNum: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
          dispatch({
            type: 'countTimes',
            payload:{

            }
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
            selectedRowKeys:"",
            selectedRows:"",
            dataSource: data.result
          }
        })
      }
    },

    * edit ({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname:'/bussiness/VehicleDetail'+"?"+payload.id
      }))
      window.localStorage.setItem("currentId",payload.id)
    },

    * addVehicleTime ({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname:'/bussiness/addVehicle'+"?"+payload.id
      }))
    },


    * add ({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname:'/bussiness/addVehicle'
      }))
    },
    * countTimes ({ payload = {} }, { call, put }) {
      const data = yield call(count, payload);
      if(data){
        yield put({
          type: 'updateState',
          payload: {
            countData:data.dataTimes
          }
        })
      }
    },

    * refuse ({ payload = {} }, { call, put }) {
      const data = yield call(refuse, payload);
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

      //if(data){
      //  yield put({
      //     type: 'updateState',
      //     payload: {
      //       //noCountData:data.dataTimes
      //     }
      //   })
      //}
    },
    * updateStatusToIssue ({ payload = {} }, { call, put }) {
      const data = yield call(updateStatusToIssue, payload);
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' ,
          payload :{
            current: 1, pageSize: 10
          }
        })
        message.success('发布成功')
      } else {
        throw data
      }

      //if(data){
      //  yield put({
      //     type: 'updateState',
      //     payload: {
      //       //noCountData:data.dataTimes
      //     }
      //   })
      //}
    },
    * updateStatusToLock ({ payload = {} }, { call, put }) {
      const data = yield call(updateStatusToLock, payload);
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' ,
          payload :{
            current: 1, pageSize: 10
          }
        })
        message.success('锁定成功')
      } else {
        throw data
      }

      //if(data){
      //  yield put({
      //     type: 'updateState',
      //     payload: {
      //       //noCountData:data.dataTimes
      //     }
      //   })
      //}
    },
    * toDetail ({ payload = {} }, { call, put }) {
      yield put(routerRedux.push({
        pathname: '/bussiness/carInfor'
      }))
    },
    * getmethod ({ payload = {} }, { call, put }) {
      const data = yield call(getmethod, payload);
      if(data&&data.success){
        return data
      }
    },
    * deleteVehicleTime ({ payload = {} }, { call, put }) {
      const data = yield call(deleteVehicleTime, payload);
      if(data&&data.success){
        return data
      }
    },


  },
  reducers: {
    showPlanModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    hidePlanModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: false }
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, refusemodalVisible: true }
    },
    showAddModal (state, { payload }) {
      return { ...state, ...payload, AddModelVisible: true }
    },

    hideAddModal (state) {
      return { ...state, AddModelVisible: false }
    },

  },
})
