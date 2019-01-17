import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import {getCargos,getPlan,selectPlan} from 'services/business/cargoListPlan.js'
import { pageModel } from '../../common'
const { prefix } = config
import { message } from 'antd';
import { routerRedux } from 'dva/router'

export default modelExtend(pageModel, {
  namespace: 'cargoListPlan',

  state: {
    dataSource:[],
    currentItem: {},
    modalVisible: false,
    addressVisible: false,
    selectaddress:"",
    addarr:[],
    carType:[],
    cargos:[],
    plansArr:[],
    AddModelVisible:false,
    mapodate:null
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bussiness/cargoListPlan') {
          const payload = { current: 1, pageSize: 0,createTime:new Date(),status:14,effectTime:new Date()}
          dispatch({
            type: 'query',
            payload
          }),
          dispatch({
            type: 'getPlan'
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(getCargos, payload);
      if(data && data.success){
        yield put({
          type: 'updateState',
          payload: {
            pagination:{
              createTime:new Date(),
              current:data.pageNum,
              pageSize:data.pageSize,
              total:data.totalPages,
            },
            cargos: data.result
          }
        })
      }
    },
    * getPlan ({ payload = {} }, { call, put }) {
       let data = yield call(getPlan);
      if(data&&data.success){
        yield put({
          type: 'updateState',
          payload: {
            plansArr: data.list
          }
        })
      }
    },

    * selectPlan ({ payload = {} }, { call, put }) {
        let result = yield call(selectPlan,payload);
        if(result&&result.success){
          message.info("选择该方案成功")
          //查询已发布和已拒绝状态，当天，所有货物信息，回填页面
          const datas = yield call(getCargos, {current: 1, pageSize: 0,createTime:new Date(),status:14});
          if(datas && datas.success){
            yield put({
              type: 'updateState',
              payload: {
                pagination:{
                  createTime:new Date(),
                  current:datas.pageNum,
                  pageSize:datas.pageSize,
                  total:datas.totalPages,
                },
                cargos: datas.result
              }
            })
          }
          //重新查询方案
          let data = yield call(getPlan);
          if(data&&data.success){
            yield put({
              type: 'updateState',
              payload: {
                plansArr: data
              }
            })
          }
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
      return { ...state, ...payload, AddModelVisible: true }
    },

    hideModal (state) {
      return { ...state, AddModelVisible: false }

  }}
})
