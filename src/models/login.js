import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { login, getKey ,getcode, sendCodeToPhone, updatePassword } from 'services/login'
import RSAUtils from 'utils/rsa';
import Cookies from 'utils/cookie';
import config from 'config'
export default {
  namespace: 'login',

  state: {
    verifyCodeUrl: 'canal/ucenterUser/captchaLoginCode?' + new Date().getTime(),
    roleType: '1',
    time:60,
    validateCodeTime: 60,
    inter:null,
    vCodeInterval: null,

    teldisplay: 'block',
    msgdisplay: 'none',
    pwddisplay: 'none',

    lInfo: JSON.parse(localStorage.getItem('l_info'))? JSON.parse(localStorage.getItem('l_info')) : {n:'', p:''}
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname=='/login') {
          dispatch({
            type: 'updateState',
            payload: {
              verifyCodeUrl: 'canal/ucenterUser/captchaLoginCode?' + new Date().getTime(),
            }
          })
        }
      })
    },
  },

  effects: {

    * login ({
      payload,
      }, { put, call, select }) {


      const keyData = yield call(getKey,{}); //获取登陆key 以便加密
      payload.loginType = 1;
      payload.key = keyData.key;
      let info = keyData.key.split('@');


      if (payload.remember) {
        let infos = {
          n: payload.username,
          p: payload.password
        };
        window.localStorage.setItem("l_info",JSON.stringify(infos));
      } else {

        window.localStorage.removeItem('l_info');

      }
      //加密
      RSAUtils.setMaxDigits(200);
      var key = new RSAUtils.getKeyPair(info[0],"", info[1])
      var encrypedPwd = RSAUtils.encryptedString(key,payload.password.split("").reverse().join(""));
      payload.password  = encrypedPwd;
      const data = yield call(login, payload) //调用登陆接口
      const { locationQuery } = yield select(_ => _.app)
      if(data.code == 200 ) {
        const { from } = locationQuery;
        yield put({ type: 'app/query' })

        Cookies.set('TOKENID', data.TOKENID, 1);
        Cookies.set('username',payload.username, 1);
        Cookies.set('roleType',data.roleType, 1);
        Cookies.set('pid',data.pid, 1);



        // if (from && from !== '/login') {
          // yield put(routerRedux.push(from))
          let menu = config['roleType'+ data.roleType + 'Menu'];
          yield put(routerRedux.push({
            pathname: menu[0].route
          }))
        // } else {
        //   yield put(routerRedux.push('/dashboard'))
        // }


      }else {
        message.error(data.message);
      }
    },
    * newlogin ({ payload = {} }, { call, put }) {
      let obj={telephone:payload.telephone}
      const data = yield call(getcode, obj)
      return data
    },

    * loginin ({ payload = {} }, { call, put,select }) {
      const keyData = yield call(getKey,{});
      payload.loginType = 2;
      payload.key = keyData.key;
      let info = keyData.key.split('@');
      //加密
      RSAUtils.setMaxDigits(200);
      var key = new RSAUtils.getKeyPair(info[0],"", info[1])
      var encrypedPwd = RSAUtils.encryptedString(key,payload.newcode.toLowerCase().split("").reverse().join(""));
      payload.password  = encrypedPwd;
      payload.username=payload.telephone
      const data = yield call(login, payload) //调用登陆接口
      const { locationQuery } = yield select(_ => _.app)

      if(data.code == 200 ) {
        const { from } = locationQuery;
        yield put({ type: 'app/query' })
        Cookies.set('TOKENID', data.TOKENID, 1);
        Cookies.set('username',payload.username, 1);
        Cookies.set('roleType',data.roleType, 1);
        Cookies.set('pid',data.pid, 1);
        // if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        // } else {
        //   yield put(routerRedux.push('/dashboard'))
        // }
      }else {
        message.error(data.message);
      }
    },


    * sendCodeToPhone ({ payload = {} }, { call, put }) {

      const data = yield call(sendCodeToPhone, payload);
      return data
    },

    * updatePassword ({ payload = {} }, { call, put }) {

      const data = yield call(updatePassword, payload);

      yield put ({
        type: 'updateState',
        payload: {
          payload,
          teldisplay: 'block',
          msgdisplay: 'none',
          pwddisplay: 'none',

        }
      })


    }


  },




  reducers: {
    updateState (state, {payload}){
      return {
        ...state,
        ...payload,
      }
    }

  },

}
