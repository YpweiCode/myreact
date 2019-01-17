/**
 * Created by G2_User on 2017/12/6.
 */
import  React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Input, Icon , Modal, message} from 'antd'
const FormItem = Form.Item
class modal extends Component {
  constructor(props) { // 初始化的工作放入到构造函数
    super(props); // 在 es6 中如果有父类，必须有 super 的调用用以初始化父类信息

    this.state = { // 初始 state 设置方式
      parmsarr:[{},{}],
      timeobj:null,
      inintscale:1,
      inintrotate:0,
      imgArr:this.props.imgArr,
      currentImg:this.props.currentImg,
      imgurl:this.props.imgArr[this.props.currentImg].url
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
    let timearr=this.props.imgArr
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

    const rotate=()=>{
      this.setState({inintrotate:(parseInt(this.state.inintrotate)+1)})
    }
    //const scalemax=()=>{
    //  this.setState({inintscale:(Number(this.state.inintscale)+0.2)})
    //}
    //const scalemin=()=>{
    //  this.setState({inintrotate:(Number(this.state.inintscale)-0.2)})
    //}
    const leftnext=()=>{
      let num=Number(this.state.currentImg)-1
      if(num<0){
        num=this.state.imgArr.length-1
      }
      this.setState({currentImg:num})
      this.setState({inintrotate:0})
      this.setState({imgurl:this.state.imgArr[num].url})
    }
    const rightnext=()=>{
      let num=Number(this.state.currentImg)+1
      if(num>this.state.imgArr.length-1){
        num=0
      }
      this.setState({currentImg:num})
      this.setState({inintrotate:0})
      this.setState({imgurl:this.state.imgArr[num].url})
    }
    const modalOpts = {
      ...modalProps,
      onOk: handleOk,
    }
    return (
      <Modal {...modalOpts}>
        {/**{this.state.timeobj}**/}
        <div style={{width:730,height:490,position:"relative"}}>
          <div onClick={leftnext} style={{cursor:'pointer',top:'50%',left:20,width:25,height:25,position:"absolute",background:'#CCC',borderRadius:"50%",paddingTop:3}}><Icon style={{fontSize:20,color:"#fff"}}  type="left" /></div>
                  <img className="returnimg" style={{transform:("scale("+this.state.inintscale+")"),'-o-transform':("rotate("+this.state.inintrotate*90+"deg)"),'-webkit-transform':("rotate("+this.state.inintrotate*90+"deg)"),'-moz-transform':("rotate("+this.state.inintrotate*90+"deg)"),'-ms-transform':("rotate("+this.state.inintrotate*90+"deg)"),transform:("rotate("+this.state.inintrotate*90+"deg)"),width:400,height:450,display:'block',margin:"0 auto"}} src={this.state.imgurl} />
          <div onClick={rightnext}  style={{cursor:'pointer',top:'50%',left:690,width:25,height:25,position:"absolute",background:'#CCC',borderRadius:"50%",paddingTop:3}}><Icon style={{fontSize:20,color:"#fff",marginLeft:3}} type="right" /></div>
          <div  style={{width:250,height:50,margin:'0 auto ',marginTop:4,background:"rgba(111,111,111,0.5)",borderRadius:50,display:'flex',flexFlow:'row no erap',justifyContent:"space-around"}}>
                  <div onClick={rotate} style={{paddingTop:10,height:50,cursor:'pointer'}}><Icon style={{fontSize:20,color:"#fff",display:'block'}} type="reload" /><span className="anticon-class" style={{color:"#fff"}}>旋转</span></div>
            {/**<div onClick={scalemax} style={{height:50,cursor:'pointer'}}><Icon style={{fontSize:20,color:"#fff",display:'block'}} type="plus-circle-o" /><span class="anticon-class">放大</span></div>
                  <div onClick={scalemin} style={{height:50,cursor:'pointer'}}><Icon style={{fontSize:20,color:"#fff",display:'block'}} type="minus-circle-o" /><span class="anticon-class">缩小</span></div>
          **/}
             </div>
        </div>

      </Modal>)
  }

}

export default Form.create()(modal)

