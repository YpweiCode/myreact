import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { connect } from 'dva'
import { Form, Button ,Row, Col, Cascader} from 'antd'
import { Link } from 'dva/router'
import city from 'utils/city'


const ColProps = {
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const Filter = ({
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
    fields.pageSize = 10;
    fields.status = 1 ;
    if(fields.pickDistrictCode.length==1){
      fields.pickDistrictCode=fields.pickDistrictCode[0].substring(0,2)
    }
    else if(fields.pickDistrictCode.length==2){
      fields.pickDistrictCode=fields.pickDistrictCode[0].substring(0,2)+fields.pickDistrictCode[1].substring(2,4)
    }
    else if(fields.pickDistrictCode.length==3){
      fields.pickDistrictCode=fields.pickDistrictCode[0].substring(0,2)+fields.pickDistrictCode[1].substring(2,4)+fields.pickDistrictCode[2].substring(4,6)
    }
    else{
      fields.pickDistrictCode=""
    }

    if(fields.sendDistrictCode.length==1){
      fields.sendDistrictCode=fields.sendDistrictCode[0].substring(0,2)
    }
    else if(fields.sendDistrictCode.length==2){
      fields.sendDistrictCode=fields.sendDistrictCode[0].substring(0,2)+fields.sendDistrictCode[1].substring(2,4)
    }
    else if(fields.sendDistrictCode.length==3){
      fields.sendDistrictCode=fields.sendDistrictCode[0].substring(0,2)+fields.sendDistrictCode[1].substring(2,4)+fields.sendDistrictCode[2].substring(4,6)
    }
    else{
      fields.sendDistrictCode=""
    }
    //fields.pickDistrictCode=fields.pickDistrictCode[fields.pickDistrictCode.length-1]
    //fields.sendDistrictCode=fields.sendDistrictCode[fields.sendDistrictCode.length-1]
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


  function getarea(...parms){
    //area=parms[1];
    //if(parkadd&&area.length==3){
    //  setmap()
    //}
  }
  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 5 }} md={{ span: 6 }} sm={{ span: 12 }}>
        <FilterItem label="始发区域">
          {getFieldDecorator('pickDistrictCode', { initialValue:["510000","510100"] })(
            <Cascader
              size="large"
              options={city}
              placeholder="选择开始区域"
              changeOnSelect
              style={{width:200}}
              onChange={getarea}
            />)}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 5 }} md={{ span: 6 }} sm={{ span: 12 }}>
        <FilterItem label="目的区域">
          {getFieldDecorator('sendDistrictCode', { initialValue:["510000","510100"]})(
            <Cascader
              size="large"
              options={city}
              style={{width:200}}
              placeholder="选择结束区域"
              changeOnSelect
              onChange={getarea}
            />)}
        </FilterItem>

      </Col>
      <Col {...ColProps} xl={{ span: 5 }} md={{ span: 6 }} sm={{ span: 12 }}>
        <div >
          <Button type="primary" size="large" className="margin-right primary-blue" onClick={handleSubmit}>查询</Button>
          <Button size="large" className="primary-white"  onClick={handleReset}>重置</Button>
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

// export default Form.create()(Filter)


export default connect(({ timeCarList, loading }) => ({ timeCarList, loading }))(Form.create()(Filter))
