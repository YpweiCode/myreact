import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, DatePicker, InputNumber,Row, Col } from 'antd'
import moment from 'moment'

// const { TextArea } = Input
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = (
  {
    item = {},
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
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="客户性质" {...formItemLayout}>
          {getFieldDecorator('natureName', {
            initialValue: item.natureName,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="客户名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="手机号" {...formItemLayout}>
          {getFieldDecorator('telephone', {
            initialValue: item.telephone,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="联系人名称" {...formItemLayout}>
          {getFieldDecorator('concatName', {
            initialValue: item.concatName,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="所属区域" {...formItemLayout}>
          <Row gutter={8}>
            <Col span={8}>
              {getFieldDecorator('provinceName', {
                initialValue: item.provinceName,
              })(<Input disabled />)}
            </Col>
            <Col span={8}>
              {getFieldDecorator('cityName', {
                initialValue: item.cityName,
              })(<Input disabled />)}
            </Col>
            <Col span={8}>
              {getFieldDecorator('areaName', {
                initialValue: item.areaName,
              })(<Input disabled />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="物流园区" {...formItemLayout}>
          {getFieldDecorator('parkAddress', {
            initialValue: item.parkAddress||1,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="保证金额" {...formItemLayout}>
          {getFieldDecorator('safeMoney', {
            initialValue: item.safeMoney,
            rules: [
              {
                required: true,
                type:"number",
                // pattern: item.safeMoney > 0,
                // message: '保证金额需大于0',
              },
            ],
          })(<InputNumber maxLength="8" min={1} precision={2} max={1000000000} />)}
        </FormItem>
        <FormItem label="到账金额" {...formItemLayout}>
          {getFieldDecorator('gathering', {
            initialValue: item.gathering||1,
            rules: [
              {
                required: true,
                type:"number",
                // pattern: item.gathering > 0,
                message: '到账金额需大于0',
              },
              /* {
                // 自定义校验
                validator (rule, value, callback) {
                  if (parseInt(value, 10) > 0) {
                    callback()
                  }

                },
              }, */
            ],
          })(<InputNumber maxLength="8" min={1} precision={2} max={10000000} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="到账时间"
        >
          {getFieldDecorator('gatheringDate', {
            initialValue: item.gatheringDate ? moment(item.gatheringDate) : item.gatheringDate, //format
            rules: [
              {
                required: true,
                message: '请填写到账时间',
              },
            ],
          })(
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
