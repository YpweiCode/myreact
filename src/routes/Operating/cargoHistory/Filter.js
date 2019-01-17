import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import moment from 'moment';
import { connect } from 'dva'
import { Form, Button, Select ,Row, Col, DatePicker, Input, Cascader, Switch ,Tabs, message} from 'antd'
const {RangePicker } = DatePicker
import { Link } from 'dva/router'




const Search = Input.Search
const TabPane = Tabs.TabPane

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
function  disabledMinutes (){
  return [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,51,52,53,54,55,56,57,58,59]
}

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current.valueOf() >=Date.now();
}
const Filter = ({
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue,
  },
}) => {
  const handleSubmit = () => {
    let fields = getFieldsValue();
    fields.startTime=new Date(fields.time[0].valueOf()+24*60*60*1000)
    fields.endTime=new Date(fields.time[1].valueOf()+24*60*60*1000)
    if(fields.time.length==2&&(fields.endTime.valueOf()-fields.startTime.valueOf()>24*60*60*60*1000)){
      message.info("您选择得时间范围超过60天！")
      return
    }
    fields.pageSize = 10;
    onFilterChange(fields)
  }

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span:6 }} className="searchFont">
        <FilterItem label="发布日期">
        {getFieldDecorator('time', { initialValue:[moment(new Date((new Date().getTime()-24*60*60*1000*30)).getFullYear()+"-"+(new Date((new Date().getTime()-24*60*60*1000*30)).getMonth()+1)+"-"+new Date((new Date().getTime()-24*60*60*1000*30)).getDate(), "YYYY-MM-DD"), moment(new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), "YYYY-MM-DD")]})(
          <RangePicker className="inputBox" disabledDate={disabledDate} showTime={false}  format={'YYYY-MM-DD'} style={{ width: '100%' }} size="large"  />
        )}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span:6 }} className="searchFont">
        <FilterItem label="方案状态">
        {getFieldDecorator('reStatus',{initialValue:''})(
          <Select style={{ width: 140 }}>
            <Option value=''>全部</Option>
            <Option value='-1'>无</Option>
            <Option value="0">待货主确认</Option>
            <Option value="1">待承运商确认</Option>
            <Option value="3">方案已生效</Option>
          </Select>
        )}

        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span:6 }} className="searchFont">
        <FilterItem label="账单状态">
        {getFieldDecorator('billStatus',{initialValue:''})(
          <Select style={{ width: 140 }}>
            <Option value=''>全部</Option>
            <Option value="100">账单待货主确认</Option>
            <Option value="200">账单待承运商确认</Option>
            <Option value="300">已完成</Option>
          </Select>
        )}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 6 }} sm={{ span: 12 }}>
        <div >
          <Button type="primary" size="large" className="margin-right primary-blue" onClick={handleSubmit}>搜索</Button>
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


// export default connect(({ cargo, loading }) => ({ cargo, loading }))(Form.create()(Filter))
