import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Button, Row, Form, Input, Col, Checkbox} from 'antd'
import {config} from 'utils'
import loginimg from '../../public/logo-bake.png'
import phone from '../../public/phone.svg'
import styles from './index.less'


const FormItem = Form.Item

let display = "block"

const Login = ({
                 loading,
                 login,
                 dispatch,
                 form: {
                   getFieldValue,
                   getFieldsValue,
                   getFieldDecorator,
                   validateFields,
                   validateFieldsAndScroll,
                 },
               }) => {
  function handleOk() {
    validateFieldsAndScroll(['username', 'password', 'code', 'remember'],(errors, values) => {

      if(errors){
        return;
      }

      if (values.username && values.password && values.code) {
        dispatch({type: 'login/login', payload: values })
        //return
      }

    })
  }

  function newhandleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (values.newcode && values.telephone) {
        dispatch({type: 'login/loginin', payload: values})
      }
    })
  }

  function getTelCaptchaPwd() {
    validateFieldsAndScroll((errors, values) => {
      if (values.telephone) {
        dispatch({type: 'login/newlogin', payload: values})
      }

    })
  }

  const {verifyCodeUrl, lInfo={}} = login;
  let hasLogInfo = lInfo.n? true: false;
  let {teldisplay, msgdisplay, pwddisplay, time, inter, validateCodeTime=60, vCodeInterval=null} = login;



  function changelogin() {
    if (teldisplay == "block") {
      teldisplay = "none"
      msgdisplay = "block"
    }
    else {
      teldisplay = "block"
      msgdisplay = "none"
    }
    dispatch({type: 'login/updateState', payload: {teldisplay: teldisplay, msgdisplay: msgdisplay}})
  }

  function handletime() {
    validateFieldsAndScroll((errors, values) => {
      if (values.telephone) {
        const resule =dispatch({ type: 'login/newlogin', payload: values })
        resule.then(function(data){
         if(data.success){
           inter = setInterval(function () {
             time--;
             if (time <= 0) {
               clearInterval(inter)
               time = 60
             }
             dispatch({type: 'login/updateState', payload: {time: time}})
           }, 1000)
         }
        })

      }
    })


  }
  function denglu(e){
    if(e.keyCode==13){
      handleOk()
    }
  }

  function changeCode() {
    dispatch({
      type: 'login/updateState',
      payload: {verifyCodeUrl: 'canal/ucenterUser/captchaLoginCode?' + new Date().getTime()}
    });
  }

  const handleForgetPwd = (e) => {
    e.preventDefault();
    dispatch({
      type: 'login/updateState',
      payload: {
        teldisplay: 'none',
        msgdisplay: 'none',
        pwddisplay: 'block'
      }
    })
  }

  const handleBackToLogin = (e) => {
    e.preventDefault();
    dispatch({
      type: 'login/updateState',
      payload: {
        teldisplay: 'block',
        msgdisplay: 'none',
        pwddisplay: 'none'
      }
    })
  }

  const handleConfirmPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('newPassword')) {
      callback('两次输入不一致！')
    }

    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  }


  // 忘记密码 --- 修改密码
  const handleUpdatePassword = () => {

    validateFields(['telephone', 'validateCode', 'newPassword', 'confirmPassword'],(errors, values) => {
      if(errors){
        return;
      }
    });

    dispatch({
      type: 'login/updatePassword',
      payload: {
        telephone: getFieldValue('telephone'),
        code: getFieldValue('validateCode'),
        password: getFieldValue('newPassword'),
        confrimPwd: getFieldValue('confirmPassword')
      }
    })


  }

  // 忘记密码 --- 发送验证码
  const handleSendCodeToPhone = () => {


    validateFields(['telephone'], (errors, values) => {
      if (errors) {
        return;
      }

      const data=dispatch({
        type: 'login/sendCodeToPhone',
        payload: values
      })
      data.then(function(parms){
        if(parms.success){
          vCodeInterval = setInterval(function () {
            validateCodeTime--;
            if (validateCodeTime <= 0) {
              clearInterval(vCodeInterval)
              validateCodeTime = 60
            }
            dispatch({type: 'login/updateState', payload: {validateCodeTime: validateCodeTime}})
          }, 1000)
        }
      })




    });


  }



  // 平台优势
  const advantagesArr = [
    {
      feature: '运力充足',
      content: '平台入驻了439家运输商，43295台车辆运力',
    }, {
      feature: '专业服务',
      content: '平台提供的运输商和货主，都是经过专业团队审核，平台会承担风险',
    }, {
      feature: '精确匹配',
      content: '精确的匹配算法，提供车辆和货物的匹配方案，最大节约车主和货主的费用',
    }, {
      feature: '流程管控',
      content: '强大的S&OP流程管控和奖惩措施，保证平台的服务质量',
    },
  ];

  const advantagesChild = advantagesArr.map( (adv, index) =>
    <div key={index}>
      <div>
        <img src={config.loginAdvantages[index]} alt=""/>
        <h2>{adv.feature}</h2>
        <p>{adv.content}</p>
      </div>
    </div>
  )




  return (
    <div>
      <div style={{width: "100%", minHeight: '680px', display: "flex", flexFlow: "column", background: "linear-gradient(152deg, #36cffe, #007ee5)"}}>

        {/* 顶部 */}
        <div style={{width: '100%', height: '85px', "lineHeight": '85px', background: '#fff', "minWidth": "1139px"}}>
          <div style={{width: '50%', height: '100%', float: "left"}}>
            <img alt={'logo'} src={config.logo}
                 style={{width: '40px', 'marginTop': "24px", "float": "left", "marginLeft": "35px"}}/>
            <span style={{'fontSize': '30px', color: "#151515", "marginLeft": "10px"}}>际链城市共配平台</span>
          </div>
          <div style={{float: "right", width: '50%', height: '100%'}}>
            <div style={{"textAlign": 'right', marginRight: '30px',marginTop:'12px'}}>
                <div style={{width:270,height:60,background:'#198ee9',float:'right'}}>
                    <img src={phone} height={60} />
                </div>


            </div>
          </div>
        </div>


        <div style={{flex: 1, width: "100%", position: "relative"}} className={styles.midimg}>

          {/* 普通账户登录 */}

          <div className={styles.form} style={{display: `${teldisplay}`}}>
            <div className={styles.logo}>
              {/*<img alt={'logo'} src={config.logo} />*/}
              {/*<span>{config.name}</span>*/}
              <span>账户登录</span>
            </div>
            <form>
              <FormItem hasFeedback>
                {getFieldDecorator('username', {
                  initialValue: lInfo?lInfo.n:'',
                  rules: [
                    {
                      required: true,
                      message: "请输入手机号码",
                      pattern: /^1[34578]\d{9}$/
                    },
                  ],
                })(<Input maxLength="11" size="large" onPressEnter={handleOk} placeholder="用户名"/>)}
              </FormItem>
              <FormItem hasFeedback>
                {getFieldDecorator('password', {
                  initialValue: lInfo?lInfo.p:'',
                  rules: [
                    {
                      required: true,
                      message: "请输入密码"
                    },
                  ],
                })(<Input size="large" maxLength="15" type="password" onPressEnter={handleOk} placeholder="密码"/>)}
              </FormItem>


              <Row type="flex" justify="center" align="top">
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator('code', {
                      rules: [
                        {
                          required: true,
                          message: "请输入验证码"
                        },
                      ],
                    })(<Input size="large" onKeyUp={e=>denglu(e)}  type="input" placeholder="验证码"/>)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <img className={styles.verifyCode} alt="" onClick={changeCode} src={verifyCodeUrl}/>
                </Col>
              </Row>

              <Row style={{marginBottom: 10}}>
              {getFieldDecorator('remember', {
                })(
                  <Checkbox>记住密码</Checkbox>
                )}
                <a onClick={handleForgetPwd} style={{float: "right"}} href="">忘记密码</a>
              </Row>

              <Row>
                <Button type="primary" size="large" onClick={handleOk} loading={loading.effects.login}>
                  登录
                </Button>
              </Row>

              <Row>
                <Button style={{width: "133px", "marginTop": "10px", "marginLeft": "102px"}} onClick={changelogin}>
                  短信验证码登录
                </Button>
                <span style={{width: "110px", "marginTop": "10px", color: "#ffa000"}}>→</span>
              </Row>
            </form>
          </div>


          {/* 验证码登录 */}
          <div className={styles.formnew} style={{display: `${msgdisplay}`}}>

            <div className={styles.logonew}>
              {/*<img alt={'logo'} src={config.logo} />*/}
              {/*<span>{config.name}</span>*/}
              <span>账户登录</span>
            </div>

            <form style={{display: `${msgdisplay}`}}>
              <FormItem hasFeedback>
                {getFieldDecorator('telephone', {
                  rules: [
                    {
                      required: true,
                      message: "请输入手机号码",
                      pattern: /^1[34578]\d{9}$/,
                    },
                  ],
                })(<Input maxLength="11" size="large" onPressEnter={handleOk} placeholder="用户名"/>)}
              </FormItem>
              <Row type="flex" justify="center" align="top">
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator('newcode', {
                      rules: [
                        {
                          required: true,
                          message: "请输入验证码"
                        },
                      ],
                    })(<Input size="large" type="input" placeholder="验证码"/>)}
                  </FormItem>

                </Col>
                <Col span={12}>
                  <Button type="primary" htmlType="button" size="large" disabled={time < 60 && time > 0} onClick={handletime}
                          loading={loading.effects.login}>
                    {(time == 60 || time == 0) ? "获取验证码" : time+'s'}
                  </Button>
                </Col>

              </Row>


              <Row>
                <Button type="primary" size="large" onClick={newhandleOk} loading={loading.effects.login}>
                  登录
                </Button>
              </Row>

              <Row>
                <Button style={{width: "133px", "marginTop": "10px", "marginLeft": "102px"}} onClick={changelogin}>
                  平台密码登录
                </Button>
                <span style={{width: "110px", "marginTop": "10px", color: "#ffa000"}}>→</span>
              </Row>
            </form>



          </div>


          {/* 忘记密码 */}
          <div className={styles.form} style={{display: `${pwddisplay}`}}>
            <div className={styles.logo}>
              {/*<img alt={'logo'} src={config.logo} />*/}
              {/*<span>{config.name}</span>*/}
              <span>忘记密码</span>
            </div>
            <form>
              <FormItem hasFeedback>
                {getFieldDecorator('telephone', {
                  rules: [
                    {
                      required: true,
                      message: "请输入手机号码",
                    }, {
                      pattern: /^1[34578]\d{9}$/,
                      message: '请输入有效的手机号'
                    }
                  ],
                })(<Input maxLength="11" size="large" onPressEnter={handleOk} placeholder="请输入手机号码"/>)}
              </FormItem>



              <Row type="flex" justify="center" align="top">
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator('validateCode', {
                      rules: [
                        {
                          required: true,
                          message: "请输入验证码"
                        },
                      ],
                    })(<Input size="large" type="input" placeholder="验证码"/>)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <Button type="default" size="large" onClick={handleSendCodeToPhone} disabled={validateCodeTime<60}>
                    {(validateCodeTime == 60 || validateCodeTime == 0) ? "获取验证码" : validateCodeTime +'秒后重新获取'}
                  </Button>
                </Col>
              </Row>

              <FormItem hasFeedback>
                {getFieldDecorator('newPassword', {
                  rules: [
                    {
                      required: true,
                      message: "请输入密码"
                    },{
                      max: 20,
                      message: '密码最大长度为20位',
                    },{
                      min: 6,
                      message: '密码长度最少为6位',
                    }
                  ],
                })(<Input size="large" maxLength="15" type="password" placeholder="密码"/>)}
              </FormItem>

              <FormItem hasFeedback>
                {getFieldDecorator('confirmPassword', {
                  rules: [{
                    required: true,
                    message: '请再次输入以确认新密码',
                  },{
                    validator: handleConfirmPassword
                  }],
                })(<Input size="large" maxLength="15" type="password"  placeholder="确认密码"/>)}
              </FormItem>

              <Row>

                <Button type="primary" size="large" onClick={handleUpdatePassword} loading={loading.effects.login}>
                  修改密码
                </Button>
                <a onClick={handleBackToLogin} style={{float: "left", marginTop: 10}} href="">返回登录</a>

              </Row>


            </form>
          </div>

        </div>


      </div>

      {/* 底部-四大优势 */}
      <div className={styles.advantages}>

        {advantagesChild}

      </div>


      <div style={{
        width: "100%",
        height: '69px',
        lineHeight: "69px",
        textAlign: "center",
        fontSize: "16px",
        color: "#7f898f"
      }}>Copyright ©2017 上海G2LINK有限公司 版权所有
      </div>
    </div>
  )
}
Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  login: PropTypes.object
}

export default connect(({login, loading}) => ({login, loading}))(Form.create()(Login))


