import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm,Icon } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import Cookies from 'utils/cookie'




const Superuser = ({ location, dispatch, superuser, loading }) => {
  location.query = queryString.parse(location.search)

  const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = superuser
  const { pageSize } = pagination
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    userType:Cookies.get("roleType"),
    confirmLoading: loading.effects['superuser/update'],
    title: `${modalType === 'create' ? '创建用户' : '更新用户'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      //data.nature=data.natureName;
      //if(data.natureName=="业务"){
      //  data.nature=1
      //}else if(data.nature=="财务"){
      //  data.nature=2
      //}else if(data.natureName=="承运商"){
      //  data.nature=3
      //}else if(data.natureName=="货主"){
      //  data.nature=4
      //}

      if(modalType!="create"){
        data.id=currentItem.id;
        data.nature=data.natureName
      }else{
        data.nature=data.natureName
      }
      dispatch({
        type: `superuser/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      if(currentItem.natureName=="1"){
        currentItem.natureName="业务"
      }else if(currentItem.nature=="2"){
        currentItem.natureName="财务"
      }else if(currentItem.natureName=="3"){
        currentItem.natureName="承运商"
      }else if(currentItem.natureName=="4"){
        currentItem.natureName="货主"
      }
      dispatch({
        type: 'superuser/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['superuser/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          requestItems:location.requestItems || {},
          current: page.current,
          pageSize: page.pageSize,
        },
      }))
    },

    onDeleteItem (id) {
      dispatch({
        type: 'superuser/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'superuser/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })

    },
  }

  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      location.requestItem = value;
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          pageNum: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/superuser',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/superuser',
      }))
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'superuser/multiDelete',
      payload: {
        ids: selectedRowKeys.join(',')
      },
    })
  }
 const onAdd = () => {
  dispatch({
    type: 'superuser/showModal',
    payload: {
      modalType: 'create',
    },
  })
 }
  return (
    <div>
      <Row className="searchbox searchbox1">
        <Filter {...filterProps} />
      </Row>
      <Row className="addBox">
        <Button className="primary-green" size="large" type="ghost" onClick={onAdd}><Icon type="plus-circle-o" />新增</Button>
      </Row>
      <Row className="searchwrap">
        <List {...listProps} />
      </Row>
      {modalVisible && <Modal {...modalProps} />}
    </div>
    // <Page inner>
    //   <Filter {...filterProps} />
    //   <List {...listProps} />
    //   {modalVisible && <Modal {...modalProps} />}
    // </Page>
  )
}

Superuser.propTypes = {
  superuser: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ superuser, loading }) => ({ superuser, loading }))(Superuser)
