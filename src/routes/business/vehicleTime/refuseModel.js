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
      //key: item.key,
    }
    onOk(data)
  })
  }

  const modalOpts = {
      ...modalProps,
    onOk: handleOk,
}

  const options = carType.map(d => <Option key={d.carTypeCode}>{d.carTypeName}</Option>);

  return (
    <Modal {...modalOpts}>
<Form layout="horizontal">
  <FormItem label="拒绝原因" hasFeedback {...formItemLayout}>
  {getFieldDecorator('remark', {
    initialValue: item.remark,
    rules: [
      {
        required: true,
        pattern:/^\S*[\S]*\S*$/g,
        message:"请输入拒绝原因(*且不含空格*)"
      },
    ],
  })(<TextArea  maxLength="20" rows={4}/>)}
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
