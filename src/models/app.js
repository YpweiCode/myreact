
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { query, logout } from 'services/app'
import Cookies from 'utils/cookie';
import queryString from 'query-string'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    menu: [],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    layoutSiderCollapsed: window.localStorage.getItem('layoutSiderCollapsed') === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname+(location.search?location.search:""),
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },
  },
  effects: {

    * query ({
      payload,
    }, { call, put, select }) {
      let user = {};
      user.username = Cookies.get('username');
      user.roleType = Cookies.get('roleType');
      user.pid = Cookies.get('pid');
      const { locationPathname } = yield select(_ => _.app)
      if (user.username) {
        let menu = config['roleType'+ user.roleType + 'Menu'];
        if(user.pid&&user.pid!="null"){
          for(let i=0;i<menu.length;i++){
            if(menu[i].route=="/bussiness/addChild"){
              menu.splice(i,1)
              break;
            }
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions: true,
            menu,
          },
        })
        yield put(routerRedux.push({
          pathname: locationPathname
        }))


      } else {
          yield put(routerRedux.push({
              pathname: '/login',
              search: queryString.stringify({
                from: locationPathname,
              })
            })
          )
      }
    },

    * logout ({
      payload,
    }, { call, put }) {
      // const data = yield call(logout, parse(payload)) //后端暂时没有处理
      Cookies.remove('TOKENID');
      Cookies.remove('username');
      Cookies.remove('roleType');
      yield put({ type: 'query' })

    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
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

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      window.localStorage.setItem('layoutSiderCollapsed', !state.layoutSiderCollapsed)
      return {
        ...state,
        siderFold: !state.siderFold,
        layoutSiderCollapsed: !state.layoutSiderCollapsed
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
