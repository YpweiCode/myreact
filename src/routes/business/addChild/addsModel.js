import  React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Input, Icon , Modal, message} from 'antd'
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
class modal extends Component {
  constructor(props) { // 初始化的工作放入到构造函数
    super(props); // 在 es6 中如果有父类，必须有 super 的调用用以初始化父类信息

    this.state = { // 初始 state 设置方式
      parmsarr:[{},{}],
      inputobj:"<div>rwerewrewrew</div>"
    };
  }
  static propTypes = {
    form: PropTypes.object.isRequired,
    type: PropTypes.string,
    item: PropTypes.object,
    onOk: PropTypes.func,
  };
  render(){
    const {  item = {},userType,onOk, form: { getFieldDecorator,validateFields, getFieldsValue, },...modalProps}=this.props;

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
          key: item.key,
        }
        let obj=[]
        let i=0
        while(data["concatName"+i]&&data["telephone"+i]){
          let ob={}
          ob.concatName=data["concatName"+i]
          ob.telephone=data["telephone"+i]
          obj.push(ob)
          i++
        }
        let objlen=obj.length
        for(let i=0;i<objlen;i++){
          let tel=obj[i].telephone
          for(let j=0;j<objlen;j++){
            if(i==j){
              continue
            }
            if(tel==obj[j].telephone){
              message.info("您输入了相同的手机号,请您查看!")
              return
            }
          }
        }
        onOk(obj)
      })
  }
    const minuser= (index) =>{
      if(this.state.parmsarr.length==1){
        message.warning("当前无法进行此操作!")
        return
      }
      let arr=JSON.parse(JSON.stringify(this.state.parmsarr))
      arr.splice(index,1)
      this.setState({parmsarr:arr})
    }
    const pulsuser= (index) =>{
      let arr=JSON.parse(JSON.stringify(this.state.parmsarr))
      arr.push({})
      this.setState({parmsarr:arr})
    }
    this.state.inputobj=this.state.parmsarr.map((item,index)=>{
      return (
        <div key={index}>
          <FormItem label="用户名" style={{width:"350px",float:"left"}} hasFeedback {...formItemLayout}>
            {getFieldDecorator('concatName'+index, {
              initialValue:null,
              rules: [
                {
                  message: '请输入用户名字！',
                  required: true,
                },
              ],
            })(<Input placeholder="请输入用户名!" />)}
          </FormItem>
          <FormItem label="手机号" style={{width:"340px",float:"left"}} hasFeedback {...formItemLayout}>
            {getFieldDecorator('telephone'+index, {
              initialValue: null,
              rules: [
                {
                  required: true,
                  pattern: /^1[34578]\d{9}$/,
                  message: '请输入有效手机号',
                },
              ],
            })(<Input placeholder="请输入手机号码！" />)}
          </FormItem>
          <Icon type="plus-circle-o" onClick={e =>pulsuser(index)}  style={{visibility:(index==0?"visible":"hidden"),fontSize:"20px",lineHeight:"35px",marginRight:"10px",cursor:"pointer",height:"40px",marginTop:(index==0?"":"18px")}} />
          <Icon  onClick={e => minuser(index)} style={{visibility:(index==0?"visible":"hidden"),cursor:"pointer",fontSize:"20px",lineHeight:"35px"}} type="minus-circle-o" />
        </div>
      )
    })
    const modalOpts = {
      ...modalProps,
      onOk: handleOk,
    }
    const componentDidMount= (index) =>{//shouci
      this.state.parmsarr.push({})
      this.state.parmsarr.push({})
      this.state.inputobj=this.state.parmsarr.map((item,index)=>{
        return (
          <div key={index}>
            <FormItem label="用户名" style={{width:"350px",float:"left"}} hasFeedback {...formItemLayout}>
              {getFieldDecorator('concatName'+index, {
                initialValue:null,
                rules: [
                  {
                    message: '请输入用户名字！',
                    required: true,
                  },
                ],
              })(<Input placeholder="请输入用户名!" />)}
            </FormItem>
            <FormItem label="手机号" style={{width:"340px",float:"left"}} hasFeedback {...formItemLayout}>
              {getFieldDecorator('telephone'+index, {
                initialValue: null,
                rules: [
                  {
                    required: true,
                    pattern: /^1[34578]\d{9}$/,
                    message: '请输入有效手机号',
                  },
                ],
              })(<Input placeholder="请输入手机号码！" />)}
            </FormItem>
            <Icon type="plus-circle-o" onClick={pulsuser} style={{fontSize:"20px",lineHeight:"35px",marginRight:"10px",cursor:"pointer",height:"40px",marginTop:(index==0?"":"18px")}} />
            <Icon  onClick={minuser} style={{cursor:"pointer",fontSize:"20px",lineHeight:"35px"}} type="minus-circle-o" />
          </div>
        )
      })
    }
    return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem lable="父ID"style = {{display: 'none'}}>
          {getFieldDecorator('pid', {initialValue: item.pid,})(<Input />)}
        </FormItem>
        {this.state.inputobj}
      </Form>
    </Modal>)
  }

}

export default Form.create()(modal)

