import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Input, InputNumber, Radio,Select, Modal, Cascader, Row, Col } from 'antd'
const { TextArea } = Input;
const FormItem = Form.Item
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
const formItemLayoutremaok = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
}

const modal = ({
  item = {},carType = [],
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  const ColPropsrow = {
    xs:12,
    sm: 12,
    style: {
      marginBottom: 16,
    },
  }
  const ColPropsrowremark = {
    xs:24,
    sm: 24,
    style: {
      marginBottom: 16,
    },
  }

  const options = carType.map(d => <Option key={d.carTypeCode}>{d.carTypeName}</Option>);

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <Row gutter={24}>
          <Col {...ColPropsrow}>
            <FormItem label="车牌号" hasFeedback {...formItemLayout}>
              {getFieldDecorator('vehicleNo', {
                initialValue: item.vehicleNo,
                rules: [
                  {
                    required: true,
                    pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
                    message: '请输入有效车牌号',
                  },
                ],
              })(<Input className="modelwidth" size="large" />)}
            </FormItem>
            </Col>
          <Col {...ColPropsrow}>
            <FormItem label="车型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('carTypeCode', {
                initialValue: item.carTypeCode,
                rules: [
                  {
                    required: true,
                    message: '请输入有效车型',
                  },
                ],
              })(    <Select  showSearch style={{width: '180px'}} size="large" >{options}</Select>)}
            </FormItem>
            </Col>
        </Row>
        <Row gutter={24}>
          <Col {...ColPropsrow}>
          <FormItem label="司机" hasFeedback {...formItemLayout}>
            {getFieldDecorator('driver', {
              initialValue: item.driver,
              rules: [
                {
                  required: true,
                  pattern:/^\S*[\S]*\S*$/g,
                  message: '请输入有效司机姓名',
                },
              ],
            })(<Input className="modelwidth" maxLength="20"/>)}
          </FormItem>
          </Col>
          <Col {...ColPropsrow}>
          <FormItem label="司机电话" hasFeedback {...formItemLayout}>
            {getFieldDecorator('driverPhone', {
              initialValue: item.driverPhone,
              rules: [
                {
                  required: true,
                  pattern: /^1[34578]\d{9}$/,
                  message: '请输入有效手机号',
                },
              ],
            })(<Input className="modelwidth" />)}
          </FormItem>
            </Col>
          </Row>
        <Row gutter={24}>
          <Col {...ColPropsrow}>
          <FormItem label="通行证" hasFeedback {...formItemLayout}>
            {getFieldDecorator('passCard', {
              initialValue: item.passCard,
              rules: [
                {
                  required: true,
                  pattern:/^\S*[\S]*\S*$/g,
                  message: '请输入有效通行证',
                },
              ],
            })(<Input className="modelwidth" maxLength="20"/>)}
          </FormItem>
            </Col>
        </Row>
        <Row gutter={24}>
          <Col {...ColPropsrowremark}>
            <FormItem label="补充说明" hasFeedback {...formItemLayoutremaok}>
              {getFieldDecorator('remark', {
                initialValue: item.remark,
                rules: [
                  {
                    required: false,
                    pattern:/^\S*[\S]*\S*$/g,
                  },
                ],
              })(<TextArea style={{width:'465px'}} rows={4} maxLength="50"/>)}
            </FormItem>
            </Col>
        </Row>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  carType: PropTypes.array,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
