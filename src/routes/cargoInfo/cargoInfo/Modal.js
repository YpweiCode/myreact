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
        key: item.key,
      }
      data.address = data.address.join(' ')
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }


  let addressValue = [];
  addressValue = item.area ? [item.area.substring(0,2)+'0000', item.area.substring(0,4)+'00', item.area]
                 : (item.city ? [item.area.substring(0,2)+'0000', item.city]
                 : (item.province ? [item.province]: []));

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="客户性质" hasFeedback {...formItemLayout}>
          {getFieldDecorator('natureName', {
            initialValue: item.natureName,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Radio.Group>
              <Radio value = '承运商'>承运商</Radio>
              <Radio value= '货主'>货主</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="客户名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
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
        <FormItem label="联系人名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('concatName', {
            initialValue: item.concatName,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input/>)}
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
                  // onChange={handleChange.bind(null, 'address')}
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
              },
            ],
          })(<Input />)}
        </FormItem>


        <FormItem label="保证金" hasFeedback {...formItemLayout}>
          {getFieldDecorator('safeMoney', {
            initialValue: item.safemoney || 0,
            rules: [
              {
                required: true,
                type: 'number',
              },
            ],
          })(<InputNumber min={0} max={1000000000} style = {{ width: '100%'}}/>)}
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
