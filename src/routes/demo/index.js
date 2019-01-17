import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Row, Col,Steps,Button,message,Icon,Select,InputNumber,Input,Radio,Alert} from 'antd'
import { Page } from 'components'
import  demoCss from "./demo.css"
const Step = Steps.Step;
const RadioGroup = Radio.Group;
const DemoSteps = ({ dispatch, demoSteps, loading, form: {
  getFieldDecorator,
  getFieldsValue,
  setFieldsValue,
  validateFieldsAndScroll,
  validateFields
},
}) => {
  const FilterItem=Form.Item;
  const ColProps = {
    xs:22,
    sm: 10,
    style: {
      margin: "0px auto 0 auto",
    },
  }
  const ColPropsleft = {
    xs:1,
    sm: 7,
    style: {
      margin: "px auto 0 auto",
    },
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 18,
        offset: 0,
      },
    },
  }
  const Colprop = {
    xs:24,
    sm: 24,
  }
  let {currentStep,steps,isalam,firststepdata,submitLoading} = demoSteps;
  const prefixSelector = getFieldDecorator('paymethod', {
    initialValue: firststepdata.paymethod?firststepdata.paymethod:1,
  })(
    <Select style={{ width: 100,background:"#fff",outline:"none",borderLeft:"1px solid #e5e5e5" }}>
      <Option value={1}>支付宝</Option>
      <Option value={2}>银联账户</Option>
    </Select>
  );
  const paySelector = getFieldDecorator('getmethod', {
    initialValue: firststepdata.getmethod?firststepdata.getmethod:2,
  })(
    <Select style={{ width: 100,background:"#fff",outline:"none",borderLeft:"1px solid #e5e5e5"  }}>
      <Option value={1}>支付宝</Option>
      <Option value={2}>银联账户</Option>
    </Select>
  );
  const nextStep=(flag)=>{
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      let formedata=getFieldsValue()
      if(flag==1){
        //掉后台借口
        if(JSON.stringify(firststepdata)=="{}"){
          dispatch(
            {
              type: 'demoSteps/updateState',
              payload: {
                currentStep: currentStep + 1,
                firststepdata:formedata
              }
            })
        }else{
          dispatch(
            {
              type: 'demoSteps/updateState',
              payload: {
                currentStep: currentStep + 1,
              }
            })
        }


      }else if(flag==-1){
        dispatch(
          {
            type: 'demoSteps/updateState',
            payload: {
              currentStep: currentStep - 1
            }
          })
      }else if(flag==2){
        dispatch(
          {
            type: 'demoSteps/updateState',
            payload: {
              submitLoading:true,
            }
          })
        setTimeout(function(){
          dispatch(
            {
              type: 'demoSteps/updateState',
              payload: {
                currentStep: currentStep + 1,
                submitLoading:false,
              }
            })
        },1000)
      }else if(flag==3){

        dispatch(
          {
            type: 'demoSteps/updateState',
            payload: {
              currentStep:0,
              firststepdata:{}
            }
          })
    }


    })
  }
  const isalamchane=()=>{
    let bool=!isalam
    dispatch(
      {
        type: 'demoSteps/updateState',
        payload: {
          isalam: bool
        }
      })
  }
  return (
    <div style={{maxWidth:'100%',padding:"0px 8px"}}>
      <Row gutter={24} style={{background:"#fff",margin:0,padding:"24px 8px 0 8px "}}>
        <Col {...Colprop}>
            <Steps current={currentStep}>
              {steps.map(item => <Step key={item.title} description={item.description}  icon={<Icon type={item.icon?item.icon:"none"} />} title={item.title} />)}
            </Steps>
        </Col>
      </Row>
      {/*第一步的页面*/}
      {currentStep==0&&<div style={{background:"#fff",}}>
        <Row gutter={24}  style={{paddingTop:16}}>
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <FilterItem label="付款账户：" {...formItemLayout}>
              {getFieldDecorator('tradeMethod', {
                initialValue: firststepdata.tradeMethod,
                rules: [
                  {
                    required: true,
                    pattern:/^([1-9]{1})(\d{14}|\d{18})$/,
                    message:"请您输入付款账号",
                  },
                ],})(
                <Input addonBefore={paySelector} placeholder="请您输入付款账号"  style={{width:"100%"}} size="large" maxLength={19}   />
              )}
            </FilterItem>
          </Col>
        </Row>
        <Row gutter={24} >
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <FilterItem label="收款账户：" {...formItemLayout}>
              {getFieldDecorator('payCount', {
                initialValue: firststepdata.payCount,
                rules: [
                  {
                    required: true,
                    message:"请您输入付款账号",
                  },
                ],})(
                <Input addonBefore={prefixSelector} placeholder="请您输入收款账号"  style={{width:"100%"}} size="large" maxLength={19}   />
              )}
            </FilterItem>
          </Col>
        </Row>
        <Row gutter={24} >
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <FilterItem label="收款人姓名:" {...formItemLayout}>
              {getFieldDecorator('countName', {
                initialValue: firststepdata.countName,
                rules: [
                  {
                    required: true,
                    message:"请您输入收款人姓名",
                  },
                ],})(
                <Input style={{width:"100%"}} placeholder="请您输入收款人姓名"  size="large" maxLength={10}   />
              )}
            </FilterItem>
          </Col>
        </Row>
        <Row gutter={24} >
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <FilterItem label="转账金额：" {...formItemLayout}>
              {getFieldDecorator('paymoney', {
                initialValue: firststepdata.paymoney,
                rules: [
                  {
                    required: true,
                    message:"请您输入收款人姓名",
                  },
                ],})(
                <InputNumber style={{width:"100%"}} placeholder="请您输入转账金额"  size="large" maxLength={8}  precision={2}  />
              )}
            </FilterItem>
          </Col>
        </Row>
        <Row gutter={24} >
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <FilterItem label="是否短提醒：" {...formItemLayout}>
              {getFieldDecorator('isalam', {
                initialValue: firststepdata.isalam?firststepdata.isalam:isalam,
                rules: [
                  {
                    required: true,
                    message:"请您输入收款人姓名",
                  },
                ],})(
                  <RadioGroup  onChange={isalamchane}>
                    <Radio value={true}>到账提醒</Radio>
                    <Radio value={false}>不提醒</Radio>
                  </RadioGroup>
              )}
            </FilterItem>
          </Col>
        </Row>
        {isalam&&<Row gutter={24} >
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <FilterItem label="手机号码：" {...formItemLayout}>
              {getFieldDecorator('phone', {
                initialValue: firststepdata.phone?firststepdata.phone:"",
                rules: [
                  {
                    required: true,
                    pattern: /^1[34578]\d{9}$/,
                    message:"请您输入手机号码",
                  },
                ],})(
                <Input style={{width:"100%"}} placeholder="请您输入手机号码"  size="large" maxLength={11}   />
              )}
            </FilterItem>
          </Col>
        </Row>}
        <Row gutter={24}>
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <Button type="primary" size="large" onClick={nextStep.bind(this,1)} style={{marginLeft:160,marginBottom:16}}>下一步</Button>
          </Col>
        </Row>
      </div>}
          {/*/!*第二步的页面*!/*/}

      {currentStep==1&&<div style={{background:"#fff"}}>
        <Row gutter={24} >
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps} style={{padding:"24px 0"}}>
                <Alert message="确认转账后，资金将直接打入对方账户，无法退回。" type="info" banner closable />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <FilterItem label="付款账户：" {...formItemLayout}>
                <div>{firststepdata.tradeMethod}</div>
            </FilterItem>
          </Col>
        </Row>
        <Row gutter={24} >
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <FilterItem label="收款账户：" {...formItemLayout}>
              <div>{firststepdata.payCount}</div>
            </FilterItem>
          </Col>
        </Row>
        <Row gutter={24} >
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <FilterItem label="收款人姓名:" {...formItemLayout}>
              <div>{firststepdata.countName}</div>
            </FilterItem>
          </Col>
        </Row>
        <Row gutter={24} >
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <FilterItem label="转账金额：" {...formItemLayout}>
              <div>{firststepdata.paymoney}</div>
            </FilterItem>
          </Col>
        </Row>
        <Row gutter={24} >
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}><div style={{margin: "0 0 24px 0px",background:"#e5e5e5",width:"100%",height:1}}></div></Col>
        </Row>
        <Row gutter={24} >
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <FilterItem label="账户密码：" {...formItemLayout}>
              {getFieldDecorator('password', {
                initialValue:"",
                rules: [
                  {
                    required: true,
                    message:"请您输入账户密码",
                  },
                ],})(
                <Input style={{width:"100%"}} type="password"  placeholder="请您输入账户密码"  size="large" maxLength={18}    />
              )}
            </FilterItem>
          </Col>
        </Row>
        <Row gutter={24} >
          <Col {...ColPropsleft}></Col>
          <Col {...ColProps}>
            <Button type="primary" size="large" onClick={nextStep.bind(this,2)} loading={submitLoading} style={{marginLeft:128,marginBottom:24}}>提交</Button>
            <Button size="large" onClick={nextStep.bind(this,-1)} style={{marginLeft:16}}>上一步</Button>
          </Col>
        </Row>

      </div>}

          {/**/}

          {/*/!*第三步的页面*!/*/}
          {currentStep==2&&<div style={{background:'#fff'}}>
            <Row gutter={24} >
              <Col {...ColPropsleft}></Col>
              <Col {...ColProps}>
                <div className={demoCss.operateSuccessicon}><Icon className={demoCss.demoIcon} type="check" /></div>
                <p className={demoCss.opsuccss}>操作成功</p>
                <p className={demoCss.oparrive}>预计两小时到达</p>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col {...ColPropsleft}></Col>
              <Col {...ColProps} className={demoCss.wrapbackgroundfirst}>
                <FilterItem label="付款账户：" {...formItemLayout}>
                  <div>{firststepdata.tradeMethod}</div>
                </FilterItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col {...ColPropsleft}></Col>
              <Col {...ColProps} className={demoCss.wrapbackground}>
                <FilterItem label="收款账户：" {...formItemLayout}>
                  <div>{firststepdata.payCount}</div>
                </FilterItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col {...ColPropsleft}></Col>
              <Col {...ColProps} className={demoCss.wrapbackground}>
                <FilterItem label="收款人姓名:" {...formItemLayout}>
                  <div>{firststepdata.countName}</div>
                </FilterItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col {...ColPropsleft}></Col>
              <Col {...ColProps} className={demoCss.wrapbackground}>
                <FilterItem label="转账金额：" {...formItemLayout}>
                  <div>{firststepdata.paymoney}</div>
                </FilterItem>
              </Col>
            </Row>
            <Row gutter={24} style={{marginTop:24}}>
              <Col {...ColPropsleft}></Col>
              <Col {...ColProps}>
                <Button type="primary" size="large" onClick={nextStep.bind(this,3)}  style={{marginLeft:128,marginBottom:24}}>再转一笔</Button>
              </Col>
            </Row>
          </div>}

          {/*}*/}

    </div>
  )

}

DemoSteps.propTypes = {
  dispatch: PropTypes.func,
  demoSteps: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  Select:PropTypes.object,
}

export default connect(({ demoSteps, loading }) => ({ demoSteps, loading }))(Form.create()(DemoSteps))
