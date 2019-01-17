import  React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col } from 'antd'
import city from 'utils/city'
import  mappoint from '../../../public/icon_location.png'

import styles from './List.less'
const FormItem = Form.Item
let mapdata={}
let area={}
let parkadd=""
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
    if(item.nature==1){
      item.natureName="1"
    }else if(item.nature==2){
      item.natureName="2"
    }else if(item.nature==3){
      item.natureName="3"
    }else if(item.nature==4){
      item.natureName="4"
    }else if(item.nature==5){
      item.natureName="5"
    }
    let optionList =""
    if(userType==0){
      optionList=  <Radio.Group>
        <Radio value = '1'>业务</Radio>
        <Radio value= '2'>财务</Radio>
      </Radio.Group>;
    }else if(userType==1){
      optionList=  <Radio.Group>
        <Radio value = '3'>承运商</Radio>
        <Radio value= '4'>货主</Radio>
        <Radio value= '5'>运维</Radio>
      </Radio.Group>;
    }
    let addressValue = [];
    addressValue = item.area ? [item.area.substring(0,2)+'0000', item.area.substring(0,4)+'00', item.area]
      : (item.city ? [item.area.substring(0,2)+'0000', item.city]
      : (item.province ? [item.province]: []));
    if(!item.area){
      addressValue=["510000","510100"]
    }

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
          key: item.key,
        }
        data.area = data.region[2];
        data.lat=mapdata.lat
        data.lng=mapdata.lng
        //return
        data.id=this.props.item.id
        delete data.region
        onOk(data)
      })
    }

    const modalOpts = {
      ...modalProps,
      onOk:handleOk,
    }
    return     <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="客户性质" hasFeedback {...formItemLayout}>
          {getFieldDecorator('natureName', {
            initialValue: item.natureName,
            rules: [
              {
                required: true,
                message:"请选择客户性质",
              },
            ],
          })(
            optionList
          )}
        </FormItem>
        <FormItem label="客户名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                pattern:/^\S*[\S]*\S*$/g,
                message:"请输入客户名称(*且不含空格*)"
              },
            ],
          })(<Input maxLength="15"  />)}
        </FormItem>
        <FormItem label="手机号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('telephone', {
            initialValue: item.telephone,
            rules: [
              {
                required: true,
                pattern: /^1[34578]\d{9}$/,
                message: '请输入有效手机号',
              },
            ],
          })(<Input maxLength="11" />)}
        </FormItem>
        <FormItem label="联系人名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('concatName', {
            initialValue: item.concatName,
            rules: [
              {
                required: true,
                pattern:/^\S*[\S]*\S*$/g,
                message:"请输入联系人名称(*且不含空格*)",
                max:10
              },
            ],
          })(<Input maxLength="15" />)}
        </FormItem>

        <Row gutter={24} style = {{marginBottom: 16}}>
          <Col sm={{ span: 6 }} style = {{'textAlign': 'right', 'paddingRight':0, 'lineHeight': '32px'}}>
            <span style = {{color: 'red'}}>* &nbsp;</span>所在区域：
          </Col>
          <Col sm={{ span: 14 }} style = {{paddingLeft: 5}}>
            <FilterItem label="">
              {getFieldDecorator('region', { initialValue: addressValue, rules: [{ required: true}] })(
                <Cascader
                  size="large"
                  options={city}
                  placeholder="选择区域"
                  changeOnSelect
                  required = "true"
                  onChange={getarea}
                />)}
            </FilterItem>
          </Col>
        </Row>
        <FormItem label="所在园区" hasFeedback {...formItemLayout}>
          {getFieldDecorator('parkAddress', {
            initialValue: item.parkAddress,
            rules: [
              {
                required: true,
                pattern:/^\S*[\S]*\S*$/g,
                message:"请输入所在园区(*且不含空格*)"
              },
            ],
          })(<Input maxLength="15" onChange={getpark} />)}
        </FormItem>
        <FormItem label="保证金" hasFeedback {...formItemLayout}>
          {getFieldDecorator('safeMoney', {
            initialValue: item.safeMoney || "",
            rules: [
              {
                required: true,
                type: 'number',
                pattern:/^-?[1-9]\d*$/,
                message:"请输入保证金"
              },
            ],
          })(<InputNumber min={0} maxLength="6" max={1000000000} style = {{ width: '100%'}}/>)}
        </FormItem>
        <div id="container" style={{width:"80%",height:"260px",background:"red",margin:"0 auto"}}></div>
      </Form>
    </Modal>
  }

  componentDidMount() {
    if(this.props.item.areaName){
      let add=this.props.item.areaName.replace(/,/g,"")+this.props.item.parkAddress
      setmap(add)
    }else{
      setmap()
    }
  }

}

function changelogin(){
  if(teldisplay=="block"){
    teldisplay="none"
    msgdisplay="block"
  }
  else{
    teldisplay="block"
    msgdisplay="none"
  }
  dispatch({ type: 'login/updateState', payload: {teldisplay: teldisplay,msgdisplay:msgdisplay}})
}
function handletime(){
  getTelCaptchaPwd()
  inter=setInterval(function(){
    time--;
    if(time<=0){
      clearInterval(inter)
      time=60
    }
    dispatch({ type: 'login/updateState', payload: {time:time}})
  },1000)

}
function changeCode () {
  dispatch({ type: 'login/updateState', payload: {verifyCodeUrl: 'canal/ucenterUser/captchaLoginCode?' + new Date().getTime()} });
}
function maoinit(parms){
  var map = new AMap.Map('container', {
    resizeEnable: true,
    zoom:11,
    center: [116.397428, 39.90923]
  });
  mapdata.lng=116.397428;
  mapdata.lat=39.90923;
  window.map=map
}
function getarea(...parms){
  area=parms[1];
  if(parkadd&&area.length==3){
    setmap()
  }
}
function getpark(event){
  parkadd=event.target.value;
  if(parkadd&&area.length==3){
    setmap()
  }
}
function setmap(add){
  maoinit()
  let address=""
  if(add){
    address=add
  }else{
    if(area.length>0){
      address=area[0].name+area[1].name+area[2].name+parkadd;
    }else{
      return
    }

  }
  AMap.plugin('AMap.Geocoder',function(){//异步
    var geocoder = new AMap.Geocoder({
      city: "全国", //城市，默认：“全国”
      radius: 1000 //范围，默认：500
    });
    geocoder.getLocation(address, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
        let lng=result.geocodes[0].location.lng;
        let lat=result.geocodes[0].location.lat;
        mapdata.lng=lng
        mapdata.lat=lat
        map.setCenter([lng,lat]);
        map.setZoom(18);
        var marker = new AMap.Marker({
          position: map.getCenter(),
          draggable: true,
          cursor: 'move',
          raiseOnDrag: true,
          icon:mappoint
        });
        marker.setMap(map);
        marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
          content: '您在这里',
          offset:new AMap.Pixel(-30, -30)
        });
        window.map.setFitView();
        marker.on('dragend', function(e) {
          mapdata.lng=e.lnglat.lng;
          mapdata.lat=e.lnglat.lat;
        });
      }
    });
  });
}
export default Form.create()(modal)
