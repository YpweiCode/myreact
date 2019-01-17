import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { connect } from 'dva'
import moment from 'moment';
import { Form, Row, Col, Button, Select, Input, Cascader, DatePicker, TimePicker, Modal, Card ,message} from 'antd'
import { Page } from 'components'
import MapModal from './mapModel';
import styles from './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

const NewCargo = ({ dispatch, newCargo, loading,
                    form: {
                      getFieldDecorator,
                      getFieldsValue,
                      setFieldsValue,
                      validateFields,
                      validateFieldsAndScroll,
                      resetFields
                    },
                  }) => {


  const formItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 12,
    },
  }
  const formItemLayoutadd = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 18,
    },
  }

  const { hourNow, dataSource, pagination,cargo,timeCarId, transportationVolume,transportationWeight} = newCargo;
  const {mapModalVisible, addarr = [], selectaddress, changedAddr} = newCargo
  const {feedBackModalVisible, postLoading,cargotype} = newCargo

  const mapOption = () => {
    return addarr.map(item => <Option title={item.provinceName+item.cityName+item.countyName+item.pickAddress} key={String(item.pickingLng+'?'+item.pickingLat+'?'+item.id)}>{item.provinceName+item.cityName+item.countyName+item.pickAddress}</Option>)
  }
const typeOption= () => {
  return cargotype.map(item => <Option title={item.text} key={String(item.value)}>{item.text}</Option>)
}
  const modalProps = {
    item: {},
    width: 1000,
    visible: mapModalVisible,
    selectaddress,
    maskClosable: false,
    title: '添加地址',
    wrapClassName: 'vertical-center-modal',

    onOk (data) {
      let obj={};
      obj.pickAddress=data.parkAddress;
      obj.districtId=data.area;
      obj.pickingLat=data.lat;
      obj.pickingLng =data.lng;
      let  array=dispatch({
        type: 'newCargo/insertAddress',
        payload: obj,
      })
      dispatch({
        type: 'newCargo/hideModal',
      })
      array.then(function(result){
        let valueObj = {};
        valueObj['' + changedAddr] = data.lng+"?"+data.lat+'?'+result.id;
        setFieldsValue(valueObj);
      })

      dispatch({
        type: 'newCargo/hideMapModal',
      })
    },
    onCancel () {
      dispatch({
        type: 'newCargo/hideMapModal',
      })
    },
  }


  const confirmPublish = (redirect) => {

    dispatch({
      type: 'newCargo/freshState',
      payload: {
        postLoading: true
      }

    });

    validateFields((errors) => {
      if(errors){
        dispatch({
          type: 'newCargo/freshState',
          payload: {
            postLoading: false
          }

        });
        return;
      }
      let fields = getFieldsValue();

      if(transportationVolume!==""){
        if(Number(fields.volume)>Number(transportationVolume)){
          setFieldsValue({volume:""})
          message.info("输入体积大于班车剩余体积，请重新输入！")
          return;
        }
      }
      if(transportationWeight!==""){
        if(Number(fields.weight)>Number(transportationWeight)){
          setFieldsValue({weight:""})
          message.info("输入重量大于班车剩余重量，请重新输入！")
          return;
        }
      }
      fields.pickTime=(fields.pickTimes.year())+
                      '-'+((parseInt((fields.pickTimes.month())+1)<9)?('0'+(parseInt(fields.pickTimes.month())+1)):((parseInt(fields.pickTimes.month())+1)))+
                      '-'+((parseInt(fields.pickTimes.date())<10)?('0'+fields.pickTimes.date()):(fields.pickTimes.date()))+
                      ' '+((parseInt(fields.pickTimee.hour())<10)?('0'+fields.pickTimee.hour()):(fields.pickTimee.hour()))+
                      ':'+((parseInt(fields.pickTimee.minutes())<10)?('0'+fields.pickTimee.minutes()):(fields.pickTimee.minutes()))+':00'
  fields.lastArriveTime=String(fields.lastArriveTimes.year())+
                      '-'+((parseInt((fields.lastArriveTimes.month())+1)<9)?('0'+String(parseInt(fields.lastArriveTimes.month())+1)):(String(parseInt(fields.lastArriveTimes.month())+1)))+
                      '-'+((parseInt(fields.lastArriveTimes.date())<10)?('0'+fields.lastArriveTimes.date()):(fields.lastArriveTimes.date()))+
                      ' '+((parseInt(fields.lastArriveTimee.hour())<10)?('0'+fields.lastArriveTimee.hour()):(fields.lastArriveTimee.hour()))+
                      ':'+((parseInt(fields.lastArriveTimee.minutes())<10)?('0'+fields.lastArriveTimee.minutes()):(fields.lastArriveTimee.minutes()))+':00'

      const formData = {
        picker: '',
        pickPhone: '',
        pickAddressId: '',
        sender: '',
        sendPhone: '',
        sendAddressId: ''
      };

      fields.effectTime = new Date(fields.effectTime).Format("yyyy-MM-dd hh:mm:ss");
      // fields.pickTime = new Date(fields.pickTime).Format("yyyy-MM-dd hh:mm:ss");
      // fields.lastArriveTime = new Date(fields.lastArriveTime).Format("yyyy-MM-dd hh:mm:ss");
      fields.sendAddressId = (fields.sendAddressId+"").split("?")[2];
      fields.pickAddressId = (cargo.pickAddressId == null || cargo.pickAddressId == "" )? (fields.pickAddressId+"").split("?")[2]:cargo.pickAddressId;

      let cancelText = '查看零担方案';
      if(timeCarId!=null&&timeCarId!=""){
        cancelText = '查看零担历史';
      }
      dispatch({
        type: 'newCargo/insertCargo',
        payload: {
          fields,
          redirect: redirect,
          callback: () => {
            Modal.confirm({
              title: '零担发布成功',
              content: '是否继续发布新的零担？',
              okText: '继续发布',
              cancelText: cancelText,
              onOk: handleContinuePost(formData),
              onCancel: handleFeedBackCancel
            });
          }
        }
      })
    })
  }

  const directToPlan = () => {

    dispatch({
      type: 'newCargo/redirectToPlan',
      payload:{
        redirect: '/bussiness/cargoListPlan'
      }
    })


  }

  const handleContinuePost = (formData) => {


    setFieldsValue(formData);


  }

  const handleFeedBackCancel = () => {
    let url = '/bussiness/cargoListPlan';
    if(timeCarId!=null&&timeCarId!=""){
      url = '/cargo/cargoHistory';
    }
    dispatch({
      type: 'newCargo/redirectToPlan',
      payload:{
        redirect: url
      }
    })

  }

  const changePickAddress = (value) => {
    if(cargo.pickAddressId){
      cargo.pickAddressId=null
    }

    if(value=='??'){
      showMapModel('pickAddressId')
    }
  }
  const changeSendAddress = (value) => {
    if(value=='??'){
      showMapModel('sendAddressId')
    }
  }

  const showMapModel = (type) => {
    dispatch({
      type: 'newCargo/showMapModal',
      payload: {
        changedAddr: type
      }
    })
  };

  const handleChange = (value, selectedOptions) => {
    let address = '';
    for(let item of selectedOptions) {
      address += item.name;
    }
    window.pickAddress = address;
    window.pickDistrictCode = (value.length ==0)? '' : value[value.length - 1];
  }


  /* 时间选择器 */
  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  const disabledHours = () => {
    return range(0,hourNow);
  }
  function  disabledMinutes (){
    return [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,51,52,53,54,55,56,57,58,59]
  }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current.valueOf() < Date.now();
  }

  const checkValue = () => {
    const object = getFieldsValue()
    if(transportationVolume!==""){
      if(Number(object.volume)>Number(transportationVolume)){
        setFieldsValue({volume:""})
        message.info("输入体积大于班车剩余体积，请重新输入！")
      }
    }
    if(transportationWeight!==""){
      if(Number(object.weight)>Number(transportationWeight)){
        setFieldsValue({weight:""})
        message.info("输入重量大于班车剩余重量，请重新输入！")
      }
    }
  }

  const disabledDateTime = () => {
    return {

    };
  }
  return(
    <div style={{position:'relative'}}>
      <div style={{padding:0,marginLeft:0,width:'50px',position:'relative',paddingTop:40}}>
        <div style={{width:0,borderLeft:"3px dashed #efefef",height:450,marginLeft:9,position:'absolute',left:10}}></div>
        <div style={{top:40,left:0,position:"absolute",color:"#fff",fontSize:16,textAlign:"center",lineHeight:'42px',width:42,height:42,borderRadius:"50%",background:"#39b0fa"}}>提</div>
        <div style={{top:260,left:0,position:"absolute",color:"#fff",fontSize:16,textAlign:"center",lineHeight:'42px',width:42,height:42,borderRadius:"50%",background:"#11C2B2"}}>收</div>
        <div style={{top:481,left:0,position:"absolute",color:"#fff",fontSize:16,textAlign:"center",lineHeight:'42px',width:42,height:42,borderRadius:"50%",background:"#aa00aa"}}>货</div>
        <span className="threewrap" style={{position:"absolute",left:45,top:50}}></span>
        <span className="threewrap" style={{position:"absolute",left:45,top:270}}></span>
        <span className="threewrap" style={{position:"absolute",left:45,top:490}}></span>
      </div>
          <div className="searchboxbg" style={{marginLeft:60}}>
            <div className="searchbox">
            <Row>
                <Col span={8}>
                  <FormItem label="提货日期" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('pickTimes', {
                      initialValue: cargo.pickTime == null?( moment(moment().add(1, 'days'),"YYYY-MM-DD")):moment(cargo.pickTime,'YYYY-MM-DD'),
                      rules: [
                        {
                          required: true,
                          message: '请选择提货时间',
                        },
                      ],

                    })(
                      <DatePicker
                        format="YYYY-MM-DD"
                        disabledDate={disabledDate}
                        disabledTime={disabledDateTime}
                        placeholder="提货时间"
                        showToday={false}
                      />
                    )}
                  </FormItem>
                </Col>
              <Col span={8} >
                <FormItem label="提货时间" hasFeedback {...formItemLayout} >
                  {getFieldDecorator('pickTimee', {
                    initialValue: cargo.effectTime == null?moment('09:00', 'HH:mm'):moment(cargo.effectTime,'YYYY-MM-DD HH:mm:ss'),
                    rules: [
                      {
                        required: true,
                        message: '请选择有效时间',
                      },
                    ],
                  })(
                    <TimePicker
                      //disabledHours={disabledHours}
                      //disabledHours={disabledHours}
                      disabledMinutes={disabledMinutes}
                      format="HH:mm"
                      hideDisabledOptions
                      placeholder="有效时间"
                      defaultOpenValue={moment('00:00', 'HH:mm')}
                      style={{width: "100%"}}
                    />

                  )}
                </FormItem>
              </Col>
                <Col span={8} style={{display:'none'}}>
                  <FormItem label="提货时间" hasFeedback {...formItemLayout} >
                    {getFieldDecorator('effectTime', {
                      initialValue: cargo.effectTime == null?moment('23:00', 'HH:mm'):moment(cargo.effectTime,'YYYY-MM-DD HH:mm:ss'),
                      rules: [
                        {
                          required: true,
                          message: '请选择有效时间',
                        },
                      ],
                    })(
                      <TimePicker
                        //disabledHours={disabledHours}
                        //disabledHours={disabledHours}
                        disabledMinutes={disabledMinutes}
                        format="HH:mm"
                        hideDisabledOptions
                        placeholder="有效时间"
                        defaultOpenValue={moment('00:00', 'HH:mm')}
                        style={{width: "100%"}}
                      />

                    )}
                  </FormItem>
                </Col>
            </Row>
            <Row>
            </Row>



            <Row >
              {/* 提货方信息 */}
                <Col span={8} style = {{height:56}}>
                  <FormItem label="提货方姓名" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('picker', {
                      initialValue: cargo.picker,
                      rules: [
                        {
                          required: true,
                          message: '请输入提货方姓名',
                        },
                      ]
                    })(
                      <Input  placeholder="提货方姓名" size="large" maxLength="15"/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="提货方电话" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('pickPhone', {
                      initialValue: cargo.pickPhone,
                      rules: [
                        {
                          required: true,
                          pattern: /^1[34578]\d{9}$/,
                          message: '请输入有效手机号',
                        },
                      ],
                    })(<Input placeholder="提货方电话" />)}
                  </FormItem>
                </Col>
                </Row>
            <Row>
              <Col span={16}>
                <FormItem label="提货地址" {...formItemLayoutadd}>
                  {getFieldDecorator('pickAddressId', {
                    initialValue: cargo.pickProvince == null ?undefined:cargo.pickProvince+cargo.pickCity+cargo.pickCounty+cargo.pickAddress,
                    rules: [
                      { required: true, message: '请选择提货地址' },
                    ],
                  })(
                    <Select showSearch style={{width: '100%'}} size="large"
                            onSelect={changePickAddress}
                            placeholder="请选择提货地址">
                      {mapOption()}

                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            </div>
            <div className="searchbox">
            <Row>
              <Col span={8}>
                <FormItem label="最晚收货日期" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('lastArriveTimes', {
                    initialValue: cargo.lastArriveTime == null ? ( moment(moment().add(1, 'days'),"YYYY-MM-DD")): moment(cargo.lastArriveTime,'YYYY-MM-DD'),
                    rules: [
                      {
                        required: true,
                        message: '请选择最晚收货日期',
                      },
                    ],

                  })(
                    <DatePicker
                      format="YYYY-MM-DD"
                      disabledDate={disabledDate}
                      showTime={{ format:"HH:mm",disabledMinutes:disabledMinutes,hideDisabledOptions:true}}
                      placeholder="最晚收货日期"

                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="最晚收货时间" hasFeedback {...formItemLayout} >
                  {getFieldDecorator('lastArriveTimee', {
                    initialValue: cargo.effectTime == null?moment('20:00', 'HH:mm'):moment(cargo.effectTime,'YYYY-MM-DD HH:mm:ss'),
                    rules: [
                      {
                        required: true,
                        message: '最晚收货时间',
                      },
                    ],
                  })(
                    <TimePicker
                      //disabledHours={disabledHours}
                      //disabledHours={disabledHours}
                      disabledMinutes={disabledMinutes}
                      format="HH:mm"
                      hideDisabledOptions
                      placeholder="最晚收货时间"
                      defaultOpenValue={moment('09:00', 'HH:mm')}
                      style={{width: "100%"}}
                    />

                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>

              {/* 收货方信息 */}
                <Col  span={8}>
                  <FormItem label="收货方姓名" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('sender', { initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入收货方姓名',
                        },
                      ]
                    })(
                      <Input  placeholder="收货方姓名" size="large" maxLength="15" />
                    )}
                  </FormItem>
                </Col>
                <Col  span={8}>

                  <FormItem label="收货方电话" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('sendPhone', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          pattern: /^1[34578]\d{9}$/,
                          message: '请输入有效手机号',
                        },
                      ],
                    })(<Input placeholder="收货方电话" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col  span={16}>

                  <FormItem label="收货地址" {...formItemLayoutadd}>
                    {getFieldDecorator('sendAddressId', {
                      rules: [
                        { required: true, message: '请选择你的收货地址' },
                      ],
                    })(
                      <Select  showSearch style={{width: '100%'}} size="large"
                               placeholder="请选择收货地址"
                               onSelect={changeSendAddress}
                      >
                        {mapOption()}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              </div>
              <div className="searchbox">
            <Row>
                <Col span={8}>
                  <FormItem label="货物名称" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('cargoName', {
                      initialValue: cargo.cargoName,
                      rules: [
                        {
                          required: true,
                          message: '请输入货物名称',
                        },
                      ]
                    })(
                      <Input  size="large" placeholder="货物名称" maxLength="15" />
                    )}

                  </FormItem>
                  <FormItem label="件数" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('quantity', { initialValue: cargo.quantity,
                      rules: [
                        {
                          required: true,
                          message: '请输入件数',
                        },
                        {
                          pattern:/^[0-9]+$/,
                          message: '请输入正整数'
                        }
                      ]
                    })(
                      <Input  size="large" placeholder="件数" maxLength="8" />
                    )}
                  </FormItem>

                </Col>



                <Col span={8}>

                  <FormItem label="体积"  {...formItemLayout}>

                    {getFieldDecorator('volume', { initialValue: cargo.volume,
                      rules: [
                        {
                          required: true,
                          message: '请输入体积',
                        },
                        {
                          pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                          message: '请输入正数',
                        }
                      ]
                    })(
                      <Input  addonAfter={'方'} placeholder="体积" size="large" maxLength="8" onBlur={checkValue}/>
                    )}
                  </FormItem>

                  <FormItem label="重量"  {...formItemLayout}>

                    {getFieldDecorator('weight', {
                      initialValue: cargo.weight,
                      rules: [
                        {
                          required: true,
                          message: '请输入重量',
                        },
                        {
                          pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                          message: '请输入正数',
                        }
                      ]
                    })(
                      <Input addonAfter={'公斤'} placeholder="重量" size="large" maxLength="8" onBlur={checkValue}/>
                    )}
                  </FormItem>

                </Col>


            </Row>
                <Row>
                  <Col  span={16}>

                    <FormItem label="货物类型" {...formItemLayoutadd}>
                      {getFieldDecorator('cargoType', {
                        rules: [
                          { required: true, message: '请选择货物类型' },
                        ],
                      })(
                        <Select  showSearch style={{width: '100%'}} size="large"
                                 placeholder="请选择货物类型"
                                 //onChange={changeSendAddress}
                        >
                          {typeOption()}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem >
                      {getFieldDecorator('timeCarId', {initialValue:timeCarId,})}
                    </FormItem>
                  </Col>
                </Row>
                </div>
          </div>

          <div className = {styles.operationArea} style = {{textAlign: 'center'}}>
            <Button type="primary"  className="margin-right primary-blue" onClick={e => confirmPublish()}  loading={postLoading}>发布</Button>
            {/*<Button type="primary"  className="margin-right" onClick={e => confirmPublish('/bussiness/cargoListPlan')}  >发布并关闭</Button>*/}
            <Button type="default"  className="margin-right primary-white" onClick={e => directToPlan()}  >取消</Button>
          </div>

          {mapModalVisible && <MapModal {...modalProps} />}



  </div>);

}

NewCargo.propTypes = {
  dispatch: PropTypes.func,
  newCargo: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}

export default connect(({ newCargo, loading }) => ({ newCargo, loading }))(Form.create()(NewCargo))


Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
