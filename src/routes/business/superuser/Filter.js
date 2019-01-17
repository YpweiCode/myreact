import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch } from 'antd'
import city from 'utils/city'

const Search = Input.Search

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}



const Filter = ({
  onAdd,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {

  const handleSubmit = () => {
    let fields = getFieldsValue();
    if(fields.city){
      let cityList = Object.assign([],fields.city);
      delete fields.city;
      let names = ['province', 'city', 'area'];
      cityList.forEach((item,index) => {
        fields[names[index]] = item;
      })
    }
    fields.pageSize = 10;
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }


  const { address } = filter

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }} className="searchFont">
        <FilterItem label="所在区域">
        {getFieldDecorator('city', { initialValue: address })(
          <Cascader
            size="large"
            style={{ width: '100%' }}
            options={city}
            placeholder="选择城市"
            changeOnSelect
            className="inputBox"
          />)}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }} sm={{ span: 12 }} className="searchFont">
        <FilterItem label="所在物流园">
          {getFieldDecorator('parkAddress', { initialValue: '',
            rules: [
            {
              required: true,
              max:20,
              pattern:/^\S*[\S]*\S*$/g,
              message:"请输入所在园区(*且不含空格*)"
            },
          ], })(
            <Input className="inputBox" maxLength="15" style={{ width: '100%' }} size="large"  />
          )}
        </FilterItem>
      </Col>
      <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 6 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div >
            <Button type="primary" size="large" className="margin-right primary-blue" onClick={handleSubmit}>查询</Button>
            <Button size="large" className="primary-white" onClick={handleReset}>重置</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
