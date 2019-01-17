import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { create, remove, update, query } from 'services/business/user'
import { pageModel } from '../common'
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    requestItems:{},
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/ucenter/user') {
        const payload = location.query || { pageNum: 1, pageSize: 10 }
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

  if (data&&data.success) {
    yield put({
      type: 'querySuccess',
      payload: {
        requestItems: payload,
        list: data.result,
        pagination: {
          current: Number(data.pageNum) || 1,
          pageSize: Number(data.pageSize) || 10,
          total: data.totalPages,
        },
      },
    })
  }
},

* delete ({ payload }, { call, put, select }) {
  const data = yield call(remove, { id: payload })
  const { selectedRowKeys } = yield select(_ => _.user)
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
    yield put({ type: 'hideModal' })
    yield put({ type: 'query' })
  } else {
    throw data
  }
},

* update ({ payload }, { select, call, put }) {
  const id = yield select(({ user }) => user.currentItem.id)
  const newUser = { ...payload, id }
  const data = yield call(update, newUser)
  if (data.success) {
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

},
})
