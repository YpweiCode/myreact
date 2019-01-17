import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { connect } from 'dva'
import moment from 'moment';
import { Form, Row, Col, Button, Table, Input,Select, Cascader, DatePicker } from 'antd'
import { Page } from 'components'

const { RangePicker } = DatePicker;
const Option = Select.Option;
import Modal from './Modal'
import Cargos from './Cargos'
import Cookies from 'utils/cookie';

const DailyBill = ({ dispatch, dailyBill, loading, form: {
                  getFieldDecorator,
                  getFieldsValue,
                  setFieldsValue,
                  validateFieldsAndScroll
                },
              }) => {
  const ColProps = {
    xs:12,
    sm: 6,
    style: {
      marginBottom: 16,
    },
  }

  const { list, pagination,customIds,selectedRows,selectedRowKeys,modalVisible,cargoVisible,cargos,currentItem, limitConfirm} = dailyBill;

  const modalProps = {
    item:currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['dailyBill/updateMoney'],
    title: `修改金额`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `dailyBill/update`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'dailyBill/hideModal',
      })
    },
  }


  let roleType = Cookies.get('roleType');
  const ownerColumns = [
    {
      title: '序号',
      render: (text, record,index) => {
        return <p>{index+1}</p>
      }
    }, {
      title: '日期',
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: '账单状态',
      dataIndex: 'statusName',
      key: 'statusName',
    }, {
      title: `${roleType === '3' ? '客户名称' : '承运商名称'}`,
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '联系人',
      dataIndex: 'concatName',
      key: 'concatName'
    }, {
      title: '电话',
      dataIndex: 'telephone',
      key: 'telephone',
    }, {
      title: '车牌号',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
    }, {
      title: '货物名称',
      dataIndex: 'cargoName',
      key: 'cargoName',
    }, {
      title: '货物详情(数量/体积/重量)',
      key: 'cargoDetail',
      render: (text, record) => {
        let str=""
        if(record.cargoQuantity){
          str=record.cargoQuantity+"(件)/"+record.cargoVolume+"(方)/"+ record.cargoWeight+"(公斤)"
        }
        return str
      },
    }, {
      title: '平台计算费用',
      dataIndex: 'money',
      key: 'money',
      render: (text, record) => {
        let str=""
        if(record.money){
          str="¥"+record.money
        }
        return str
      },
    }, {
      title: '实际运输费用',
      dataIndex: 'moneyAdjust',
      key: 'moneyAdjust',
    },{
      title: '操作',
      key: 'option',
      render: (text, record) => {
        return <a href = 'javascript:void(0);' disabled={!(roleType==='4'&& record.status === 100)}
                  onClick = {e => exitMoney(record, e)}>修改金额</a>
      },
    }
  ];

  const deliverColumns = [
    {
      title: '序号',
      render: (text, record,index) => {
        return <p>{index+1}</p>
      }
    }, {
      title: '日期',
      dataIndex: 'createTime',
      key: 'createTime',
    } , {
      title: '账单状态',
      dataIndex: 'statusName',
      key: 'statusName',
    },  {
      title: `${roleType === '3' ? '客户名称' : '承运商名称'}`,
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '联系人',
      dataIndex: 'concatName',
      key: 'concatName'
    }, {
      title: '电话',
      dataIndex: 'telephone',
      key: 'telephone',
    }, {
      title: '车牌号',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
    }, {
      title: '货物名称',
      dataIndex: 'cargoName',
      key: 'cargoName',
    }, {
      title: '货物详情(数量/体积/重量)',
      key: 'cargoDetail',
      render: (text, record) => {
        let str=""
        if(record.cargoQuantity){
          str=record.cargoQuantity+"(件)/"+record.cargoVolume+"(方)/"+ record.cargoWeight+"(公斤)"
        }
        return str
      },
    },{
      title: '平台计算费用',
      dataIndex: 'money',
      key: 'money',
    }, {
      title: '实际运输费用',
      dataIndex: 'moneyAdjust',
      key: 'moneyAdjust',
    },
  ];

  const rowSelection = {
    selectedRows,selectedRowKeys,
    onChange: (selectedRowKeys,selectedRows) => {
      let limitConfirm = true;
      let roleStatus;
      if ('4' === roleType) {
        roleStatus = 100;
      }else if('3' === roleType){
        roleStatus = 200;
      }
      if(roleType == 3){
        for (var row of selectedRows) {
          if(row.status === 300 || row.status === 100){
            limitConfirm = true
            break
          }else{
            limitConfirm = false
          }
       }
      }else if(roleType == 4){
        for (var row of selectedRows) {
          if(row.status === 300 || row.status === 200){
            limitConfirm = true
            break
          }else{
            limitConfirm = false
          }
       }
      }


      dispatch({
        type: 'dailyBill/updateState',
        payload: {
          selectedRows: selectedRows,
          selectedRowKeys:selectedRowKeys,
          limitConfirm: limitConfirm
        },
      })
    },
  };

  const queryCargos = (item) => {
    dispatch({
      type: 'dailyBill/showCargo',
      payload: {
        currentItem: item,
      },
    })
    dispatch({
      type: 'dailyBill/queryCargos',
      payload: {
        ownerId: item.ownerId,
        timeCarId: item.timeCarId,
      },
    })
  }

  const exitMoney = (item) => {
    dispatch({
      type: 'dailyBill/showModal',
      payload: {
        modalType: 'update',
        currentItem: item,
      },
    })
  }

  const handleSubmit = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      const time = values.time;
      if (time){
        values.startTime = new Date(time[0]).Format("yyyy-MM-dd 00:00:00");
        values.endTime = new Date(time[1]).Format("yyyy-MM-dd 23:59:59");
        values.time = "";
      }
      dispatch({ type: 'dailyBill/query', payload: {... values}});
    })
  }


  const onChangeTable = (pagination, filters, sorter) => {

    validateFieldsAndScroll((errors, values) => {

      if (errors) {
        return
      }
      dispatch({ type: 'dailyBill/query', payload: {... values, ... pagination}});
    })
  }

  const billConfirm = (pagination, filters) => {
    {/**账单确认**/}
    const obj=dispatch({
      type: 'dailyBill/billConfirm',
      payload: {
        data: JSON.stringify(selectedRows),
      },
    })
    obj.then(function(){
      dispatch({
        type: 'dailyBill/updateState',
        payload: {
          limitConfirm:true
        },
      })

    })
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

  const options = customIds.map(d => <Option key={String(d.id)}>{d.name}</Option>);

  return (
    <div>
       {/** 搜索区域**/}
       <Row gutter={24} className="searchbox" style={{ paddingLeft: 15}}>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }} sm={{ span: 12 }}>
          <FilterItem label="日期" className="searchFont">
            {getFieldDecorator('time', { initialValue: '' })(
              <RangePicker className="inputBox" size="large"/>
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }} sm={{ span: 12 }}>
          <FilterItem label="客户名称" className="searchFont">
            {getFieldDecorator('custormId', {initialValue: ''})(
              <Select  className="inputBox" showSearch style={{width: '100%'}} size="large"
                       placeholder="请输入客户姓名" optionFilterProp="children"
                       filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {options}
              </Select>
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }} sm={{ span: 12 }}>
          <FilterItem label="账单状态" className="searchFont">
            {getFieldDecorator('status', {initialValue: ''})(
              <Select className="inputBox" showSearch style={{width: '100%'}} size="large" optionFilterProp="children"
                       filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value={"100"}>账单待确认</Option>
                <Option value={"200"}>待承运商确认</Option>
                <Option value={"300"}>账单完成</Option>
              </Select>
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6}} sm={{ span: 12 }}>
          <Button type="primary" size="large" className="margin-right primary-blue" onClick={handleSubmit}>查询</Button>
          <Button size="large" className="primary-white" onClick={handleReset}>重置</Button>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col {...ColProps} >
          <Button size="large" onClick={billConfirm} disabled={limitConfirm}>账单确认</Button>
        </Col>
      </Row>
      <Table
        loading = { loading.effects['dailyBill/query'] }
        dataSource = {list}
        rowSelection={rowSelection}
        scroll={{ x: '100%' }}
        columns={roleType === '3' ? deliverColumns : ownerColumns}
        pagination = {pagination}
        onChange={onChangeTable}
        rowKey='id'
        className="searchwrap"
      />
      {modalVisible && <Modal {...modalProps} />}
      {cargoVisible && <Cargos {...cargoProps} />}
    </div>
    // <Page inner>

    //   {/** 搜索区域**/}
    //   <Row gutter={24}>
    //     <Col {...ColProps}>
    //       <FilterItem label="日期">
    //         {getFieldDecorator('time', { initialValue: '' })(
    //           <RangePicker />
    //         )}
    //       </FilterItem>
    //     </Col>
    //     <Col {...ColProps}>
    //       <FilterItem label="客户名称">
    //         {getFieldDecorator('custormId', {initialValue: ''})(
    //           <Select  showSearch style={{width: '100%'}} size="large"
    //                    placeholder="请输入客户姓名" optionFilterProp="children"
    //                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    //           >
    //             {options}
    //           </Select>
    //         )}
    //       </FilterItem>
    //     </Col>
    //     <Col {...ColProps}>
    //       <FilterItem label="账单状态">
    //         {getFieldDecorator('status', {initialValue: ''})(
    //           <Select  showSearch style={{width: '100%'}} size="large" optionFilterProp="children"
    //                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    //           >
    //             <Option value={"100"}>账单待确认</Option>
    //             <Option value={"200"}>待承运商确认</Option>
    //             <Option value={"300"}>账单完成</Option>
    //           </Select>
    //         )}
    //       </FilterItem>
    //     </Col>
    //     <Col {...ColProps} >
    //       <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>查询</Button>
    //       <Button size="large" onClick={handleReset}>重置</Button>
    //     </Col>
    //   </Row>
    //   <Row gutter={24}>
    //     <Col {...ColProps} >
    //       <Button size="large" onClick={billConfirm} disabled={limitConfirm}>账单确认</Button>
    //     </Col>
    //   </Row>


    //   {/** 列表区域**/}
    //   <Table
    //     loading = { loading.effects['dailyBill/query'] }
    //     dataSource = {list}
    //     rowSelection={rowSelection}
    //     scroll={{ x: '100%' }}
    //     columns={roleType === '3' ? deliverColumns : ownerColumns}
    //     pagination = {pagination}
    //     onChange={onChangeTable}
    //     rowKey='id'
    //   />
    //   {modalVisible && <Modal {...modalProps} />}
    //   {cargoVisible && <Cargos {...cargoProps} />}
    // </Page>
  )

}

DailyBill.propTypes = {
  dispatch: PropTypes.func,
  dailyBill: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}

export default connect(({ dailyBill, loading }) => ({ dailyBill, loading }))(Form.create()(DailyBill))

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
