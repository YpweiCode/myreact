import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { create, remove, update, query } from 'services/business/addChild'
import { pageModel } from '../common'
const { prefix } = config
import {message} from 'antd'
export default modelExtend(pageModel, {
  namespace: 'addChild',

  state: {
    currentItem: {},
    modalVisible: false,
    addmodalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    requestItems:{},
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bussiness/addChild') {
          const payload = location.query || { current: 1, pageSize: 10 }
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
      const data = yield call(query, payload);

      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            requestItems: payload,
            list: data.result,
            pagination: {
              current: Number(payload.current) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          selectedRows: [],
          selectedRowKeys:[],
        },
      })
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { ids: payload })
      const { selectedRowKeys } = yield select(_ => _.addChild)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * multiDelete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        message.info("子账户新建成功")
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ addChild }) => addChild.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      if (data.success) {
        message.info("子账户编辑成功")
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    showAddModal (state, { payload }) {
      return { ...state, ...payload, addmodalVisible: true }
    },
    hideAddModal (state) {
      return { ...state, addmodalVisible: false }
    },

  },
})
