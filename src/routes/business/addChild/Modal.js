import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col } from 'antd'
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

const modal = ({
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
        <FormItem lable="父ID"style = {{display: 'none'}}>
          {getFieldDecorator('pid', {initialValue: item.pid,})(<Input />)}
        </FormItem>
        <FormItem label="用户名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('concatName', {
            initialValue: item.concatName,
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
            ],
          })(<Input />)}
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
          })(<Input />)}
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
