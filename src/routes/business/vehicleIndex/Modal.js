import  React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import moment from 'moment';
import { Form, Input, InputNumber, DatePicker, Modal, Cascader, Row, Col } from 'antd'
import city from 'utils/city'

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

    };
  }

  static propTypes = {
    form: PropTypes.object.isRequired,
    type: PropTypes.string,
    item: PropTypes.object,
    onOk: PropTypes.func,
  };


  componentDidMount() {

    let self = this;

    AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {

      window.addMapList = new AMap.Map('trunkMap', {
        resizeEnable: true,
        expandZoomRange:true,
        zoom:4,
        center: [113.42, 33.44]
      });

      window.positionPicker = new PositionPicker({
        mode: 'dragMarker',
        map: window.addMapList
      });

      window.positionPicker.on('success', function(positionResult) {
        self.props.form.setFieldsValue({senderPostionDetail:positionResult.position })
      });

    });

  }

  render() {
    const { item = {}, onOk, form: { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue}, ...modalProps} = this.props;
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }

        const popFormValue = getFieldsValue();

        const data = {
          ...popFormValue,
          lastArriveTime: moment(popFormValue.lastArriveTime._d.getTime()).format('YYYY-MM-DD HH:mm:ss'),
          sendAddress: (window.cityAddressName || '') + popFormValue.parkAddress,
          sendDistrictCode:popFormValue.sendAddress[popFormValue.sendAddress.length - 1],
          sendLat: popFormValue.senderPostionDetail.lat || '',
          sendLng: popFormValue.senderPostionDetail.lng || '',
        }
        // data.address = data.address.join(' ')
        onOk(data)

      })
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleOk,
    }

    const handleChange = (value, selectedOptions) => {
      let address = '';
      for(let item of selectedOptions) {
        address += item.name;
      }
      window.cityAddressName = address;
      dotMap(address);
      setFieldsValue({parkAddress: ''});
      window.addMapList.setZoom(3 + selectedOptions.length * 3);
    }

    const handDetailChange = (item1, item2) => {
      if(!window.cityAddressName || window.cityAddressName == ''){
        return;
      }
      dotMap(window.cityAddressName + document.getElementById('parkAddress').value);
      window.addMapList.setZoom(19);

    }



    let dotMap = (address) => {
      AMap.plugin('AMap.Geocoder',function(){
        let geocoder = new AMap.Geocoder({});
        geocoder.getLocation(address,function(status,result){
          if(status=='complete'&&result.geocodes.length){
            window.positionPicker.start(result.geocodes[0].location);
            setFieldsValue({senderPostionDetail:result.geocodes[0].location.lng + ',' + result.geocodes[0].location.lat })
          }else{
            // message.innerHTML = '无法获取位置'
          }
        })

      });
    }

    let addressValue = [];
    addressValue = item.area ? [item.area.substring(0,2)+'0000', item.area.substring(0,4)+'00', item.area]
      : (item.city ? [item.area.substring(0,2)+'0000', item.city]
        : (item.province ? [item.province]: []));

    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal">

          <FormItem label="客户单号" style = {{display: 'none'}} hasFeedback {...formItemLayout}>
            {getFieldDecorator('senderPostionDetail', {
              initialValue: '',
            })(<Input maxLength="20"  />)}
          </FormItem>

          <Row gutter={24} style = {{marginBottom: 16}}>
            <Col sm={{ span: 12 }}>
              <FormItem label="客户单号" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cargoCode', {
                  initialValue: item.cargoCode,
                  rules: [
                    {
                      required: true,
                      message: '请输入客户单号',
                    },
                  ],
                })(<Input maxLength="18" />)}
              </FormItem>
            </Col>
            <Col sm={{ span: 12 }}>
              <FormItem label="收货方姓名" hasFeedback {...formItemLayout}>
                {getFieldDecorator('sender', {
                  initialValue: item.sender,
                  rules: [
                    {
                      required: true,
                      message: '请输入收货方姓名',
                    },
                  ],
                })(<Input maxLength="20"  />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={24} style = {{marginBottom: 16}}>
            <Col sm={{ span: 12 }}>
              <FormItem label="收货方电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('sendPhone', {
                  initialValue: item.sendPhone,
                  rules: [
                    {
                      required: true,
                      pattern: /^1[34578]\d{9}$/,
                      message: '请输入有效手机号',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col sm={{ span: 12 }}>
              <FormItem label="货物名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cargoName', {
                  initialValue: item.cargoName,
                  rules: [
                    {
                      required: true,
                      message: '请输入货物名称',
                    },
                  ],
                })(<Input maxLength="20"  />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={24} style = {{marginBottom: 16}}>
            <Col sm={{ span: 12 }}>
              <FormItem label="件数" hasFeedback {...formItemLayout}>
                {getFieldDecorator('quantity', {
                  initialValue: item.quantity || 1,
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: '请输入件数',
                    },
                  ],
                })(<InputNumber min={1} precision="2" max={1000000000} style = {{ width: '100%'}}/>)}
              </FormItem>
            </Col>
            <Col sm={{ span: 12 }}>
              <FormItem label="体积(m³)" hasFeedback {...formItemLayout}>
                {getFieldDecorator('volume', {
                  initialValue: item.volume || 1,
                  rules: [
                    {
                      required: true,
                      message: '请输入体积',
                    },
                  ],
                })(<InputNumber precision="2" min={1} max={10000000} step={0.1} style = {{ width: '100%'}}/>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={24} style = {{marginBottom: 16}}>
            <Col sm={{ span: 12 }}>
              <FormItem label="重量(kg)" hasFeedback {...formItemLayout}>
                {getFieldDecorator('weight', {
                  initialValue: item.weight || 1,
                  rules: [
                    {
                      required: true,
                      message: '请输入重量',
                    },
                  ],
                })(<InputNumber precision="2" min={1} max={10000000} step={0.1} style = {{ width: '100%'}}/>)}
              </FormItem>
            </Col>
            <Col sm={{ span: 12 }}>
              <FormItem label="最晚送达时间" hasFeedback {...formItemLayout}>
                {getFieldDecorator('lastArriveTime', {
                  initialValue: moment('00:00:00', 'HH:mm:ss'),
                  rules: [
                    {
                      required: true,
                      message: '请选择最晚送达时间',
                    },
                  ],
                })(<DatePicker
                  width = {230}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="选择时间"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />)}
              </FormItem>
            </Col>
          </Row>


          <Row gutter={24} style = {{marginBottom: 16}}>
            <Col sm={{ span: 12 }}>
              <Row gutter={24} style = {{marginBottom: 16}}>
                <Col sm={{ span: 6 }} style = {{'textAlign': 'right', 'paddingRight':0, 'lineHeight': '32px'}}>
                  <span style = {{color: 'red'}}>* &nbsp;</span>收货方城市：
                </Col>
                <Col sm={{ span: 14 }} style = {{paddingLeft: 5}}>
                  <FilterItem label="">
                    {getFieldDecorator('sendAddress', { initialValue: item.addressValue || ["510000","510100"], rules: [{ required: true, message: '请选择收货方城市',}] })(
                      <Cascader
                        size="large"
                        options={city}
                        placeholder="选择区域"
                        changeOnSelect
                        required = "true"
                        onChange={handleChange}
                      />)}
                  </FilterItem>
                </Col>
              </Row>
            </Col>
            <Col sm={{ span: 12 }}>
              <FormItem label="具体地址" hasFeedback {...formItemLayout}>
                {getFieldDecorator('parkAddress', {
                  initialValue: item.parkAddress,
                  rules: [
                    {
                      required: true,
                      message: '请输入具体地址',
                    },
                  ],
                })(<Input  maxLength="20"  onChange={handDetailChange}/>)}
              </FormItem>
            </Col>
          </Row>



          <Row gutter={24} style = {{marginBottom: 16}}>
            <Col span = {3}>
            </Col>
            <Col span = {17}>
              <div id = 'trunkMap' style = {{width: '100%', border: '1px solid #eee', borderRadius: 2,  height: 400, margin:'5px 0px'}}>

              </div>
            </Col>
          </Row>

          <Row gutter={24} style = {{marginBottom: 16}}>
            <Col sm={{ span: 12 }}>
              <FormItem label="备注" hasFeedback {...formItemLayout}>
                {getFieldDecorator('remark', {
                  initialValue: '',
                })(<Input maxLength="20"  />)}
              </FormItem>
            </Col>
          </Row>

        </Form>


      </Modal>
    )
  }
}


export default Form.create()(modal)
