import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Input, InputNumber, Radio,Select, Modal, Cascader, Row, Col } from 'antd'
const { TextArea } = Input;
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
        billId: item.id,
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
        <FormItem label="原实际运输费用" hasFeedback {...formItemLayout}>
          {getFieldDecorator('money', {
            initialValue: item.money,
          })(<InputNumber disabled={true}/>)}
        </FormItem>
        <FormItem label="新实际运输费用" hasFeedback {...formItemLayout}>
          {getFieldDecorator('moneyAdjust', {
            rules: [
              {
                required: true,
                message:'请输入有效数字'
              },
            ],
          })(<InputNumber min={0} max={99999999}/>)}
        </FormItem>
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
