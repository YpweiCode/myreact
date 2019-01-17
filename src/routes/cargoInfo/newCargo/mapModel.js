import  React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col,message } from 'antd'
import city from 'utils/city'
import  mappoint from '../../../public/icon_location.png'

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


    let addressValue = [];
    addressValue = item.area ? [item.area.substring(0,2)+'0000', item.area.substring(0,4)+'00', item.area]
      : (item.city ? [item.area.substring(0,2)+'0000', item.city]
      : (item.province ? [item.province]: []));
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
          key: item.key,
        }
        if(data.region.length==0){
          message.info("请选择所属省份");
          return
        }
        else if(data.region.length==1){
          message.info("请选择所属市区");
          return
        }else if(data.region.length==2){
          message.info("请选择所属区域");
          return
        }
        data.area = data.region[2];
        data.lat=mapdata.lat
        data.lng=mapdata.lng
        //return
        //data.id=this.props.item.id
        onOk(data)
      })
    }

    const modalOpts11= {
      ...modalProps,
      onOk:handleOk,
    }

    return     <Modal {...modalOpts11}>
      <Form layout="horizontal">
        <Row gutter={24} style = {{marginBottom: 16}}>
          <Col sm={{ span: 6 }} style = {{'textAlign': 'right', 'paddingRight':0, 'lineHeight': '32px'}}>
            <span style = {{color: 'red'}}>* &nbsp;</span>所在区域：
          </Col>
          <Col sm={{ span: 14 }} style = {{paddingLeft: 5}}>
            <FilterItem label="">
              {getFieldDecorator('region', { initialValue: ['510000','510100'], rules: [{ required: true}] })(
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
        <div id="container3" style={{width:"80%",height:"260px",margin:"0 auto"}}></div>
      </Form>
    </Modal>
  }

  compoentDidUpdate() {//第二次
    //alert(22222)
  }
  componentDidMount() {//shouci
    maoinit()
  }
  componentWillUnmount(){
    parkadd=""
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
  var map = new AMap.Map('container3', {
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
        map.clearMap()
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

