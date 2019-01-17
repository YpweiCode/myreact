import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { connect } from 'dva'
import moment from 'moment';
import { Form, Row, Col, Button, Table, Input, Cascader, DatePicker } from 'antd'
import { Page } from 'components'
import city from 'utils/city'
import Modal from './Modal'
import styles from './index.less'
const FormItem = Form.Item

const NewCargo = ({ dispatch, newCargo, loading,
                    form: {
                      getFieldDecorator,
                      getFieldsValue,
                      setFieldsValue,
                      validateFields,
                      validateFieldsAndScroll
                    },
                  }) => {
  const ColProps = {
    xs:12,
    sm: 8,
    style: {
      marginBottom: 12,
    },
  }

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  }

  const { dataSource, pagination, modalVisible} = newCargo;

  const columns = [
    {
      title: '客户单号',
      dataIndex: 'cargoCode',
      key: 'cargoCode'
    }, {
      title: '收货方姓名',
      dataIndex: 'sender',
      key: 'sender',
    }, {
      title: '收货方电话',
      dataIndex: 'sendPhone',
      key: 'sendPhone',
    }, {
      title: '收货方地址',
      dataIndex: 'sendAddress',
      key: 'sendAddress'
    }, {
      title: '货物名称',
      dataIndex: 'cargoName',
      key: 'cargoName',
    },  {
      title: '件数',
      dataIndex: 'quantity',
      key: 'quantity',
    }, {
      title: '体积(m³)',
      dataIndex: 'volume',
      key: 'volume'
    }, {
      title: '重量(kg)',
      dataIndex: 'weight',
      key: 'weight',
    }, {
      title: '最晚送达时间',
      dataIndex: 'lastArriveTime',
      key: 'lastArriveTime',
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record, index) => {
        return <a href = 'javascript:void(0)' onClick={(e) => {deleteItem(record)}}>删除</a>
      }
    },
  ];

  const modalProps = {
    item: {},
    width: 1000,
    visible: modalVisible,
    maskClosable: false,
    title: '添加货物',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      data._id = parseInt(Math.random() * 1000000);
      dispatch({
        type: 'newCargo/updateState',
        payload: {
          dataSource: [...dataSource, data]
        },
      })
      dispatch({
        type: 'newCargo/hideModal',
      })
    },
    onCancel () {
      dispatch({
        type: 'newCargo/hideModal',
      })
    },
  }

  const addList = () => {
    dispatch({
      type: 'newCargo/showModal',
      payload: {}
    })
    var map = new AMap.Map('trunkMap', {
      resizeEnable: true,
      zoom:11,
      center: [116.40, 39.91]
    });
  }

  const deleteItem = (record) => {
      dispatch({
        type: 'newCargo/updateState',
        payload: {
          dataSource: dataSource.filter(item => item._id !== record._id)
        },
      })
  }

  const confirmPublish = () => {
    validateFields((errors) => {
      if(errors){
        return;
      }
    })
    let fields = getFieldsValue();
    fields.pickAddress = window.pickAddress +  fields.pickDetailAddress;
    fields.pickDistrictCode = window.pickDistrictCode;
    let list = [];
    AMap.plugin('AMap.Geocoder',function() {
      let geocoder = new AMap.Geocoder({});
      geocoder.getLocation(fields.pickAddress, function (status, result) {
        if (status == 'complete' && result.geocodes.length) {
          fields.pickLat = result.geocodes[0].location.lat;
          fields.pickLng = result.geocodes[0].location.lng;
          fields.effectTime = moment(fields.effectTime._d.getTime()).format('YYYY-MM-DD HH:mm:ss');
          fields.pickTime = moment(fields.pickTime._d.getTime()).format('YYYY-MM-DD HH:mm:ss');


          for(let item of dataSource){
            list.push({...item, ...{senderPostionDetail: {}}})
          }
          if(list.length > 0) {
            dispatch({
              type: 'newCargo/addNew',
              payload: {
                data: {...fields, cargos:list},
              },
            })
          }
        }
      })
    });
  }

  const handleChange = (value, selectedOptions) => {
    let address = '';
    for(let item of selectedOptions) {
      address += item.name;
    }
    window.pickAddress = address;
    window.pickDistrictCode = (value.length ==0)? '' : value[value.length - 1];
  }

  return(<Page inner>

    <div className = {styles.searchArea}>

      <Row gutter={24}>
        <Col {...ColProps}>
          <FormItem label="提货时间" hasFeedback {...formItemLayout}>
            {getFieldDecorator('pickTime', {
              initialValue: null,
              rules: [
                {
                  required: true,
                  message: '请选择提货时间',
                },
              ],

            })(
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{  height: 35 }}
                placeholder="提货时间"
              />
            )}
          </FormItem>
        </Col>

        <Col {...ColProps}>
          <FormItem label="提货方姓名" hasFeedback {...formItemLayout}>
            {getFieldDecorator('picker', { initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请输入提货方姓名',
                },
              ]
            })(
              <Input  size="large" maxLength="15" />
            )}
          </FormItem>
        </Col>

        <Col {...ColProps}>
          <FormItem label="提货方电话" hasFeedback {...formItemLayout}>
            {getFieldDecorator('pickPhone', {
              initialValue: '',
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


      </Row>
      <Row gutter={24}>

        <Col {...ColProps}>
          <FormItem label="有效时间" hasFeedback {...formItemLayout}>
            {getFieldDecorator('effectTime', { initialValue: null,
              rules: [
                {
                  required: true,
                  message: '请选择有效时间',
                },
              ],
            })(
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ height: 35 }}
                placeholder="有效时间"
              />
            )}
          </FormItem>
        </Col>

        <Col {...ColProps}>
          <FormItem label="提货城市" hasFeedback {...formItemLayout}>
            {getFieldDecorator('pickDistrictCode', { initialValue: null,
              rules: [
                {
                  required: true,
                  message: '请选择提货城市',
                },
              ],
            })(
              <Cascader
                size="large"
                options={city}
                placeholder="选择城市"
                onChange={handleChange}
              />)}
          </FormItem>
        </Col>

        <Col {...ColProps}>
          <FormItem label="提货地址" hasFeedback {...formItemLayout}>
            {getFieldDecorator('pickDetailAddress', { initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请输入提货地址',
                },
              ],
            })(
              <Input  size="large" maxLength="20"  />
            )}
          </FormItem>
        </Col>

      </Row>
    </div>

    <div className = {styles.operationArea}>
      <Button type="primary"  className="margin-right" onClick={addList}>添加货物</Button>
    </div>

    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={record => record._id}
      pagination={false}
    />

    <div className = {styles.operationArea} style = {{textAlign: 'center'}}>
      <Button type="primary"  className="margin-right" onClick={confirmPublish}>零担发布</Button>
    </div>

    {modalVisible && <Modal {...modalProps} />}

  </Page>);

}

NewCargo.propTypes = {
  dispatch: PropTypes.func,
  newCargo: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}

export default connect(({ newCargo, loading }) => ({ newCargo, loading }))(Form.create()(NewCargo))
