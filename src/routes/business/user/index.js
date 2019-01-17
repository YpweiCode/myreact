import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import Cookies from 'utils/cookie'


const User = ({ location, dispatch, user, loading }) => {
  location.query = queryString.parse(location.search)

  const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = user
  const { pageSize } = pagination
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    userType:Cookies.get("roleType"),
    confirmLoading: loading.effects['user/update'],
    title: `${modalType === 'create' ? '创建用户' : '更新用户'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      if(modalType!="create"){
        data.id=currentItem.id;
        data.nature=data.natureName
      }else{
        data.nature=data.natureName
      }
      dispatch({
        type: `user/${modalType}`,
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
      }else if(currentItem.natureName=="5"){
        currentItem.natureName="运维"
      }
      dispatch({
        type: 'user/hideModal',
      })
    },
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['user/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          current: page.current,
          pageSize: page.pageSize,
        },
      }))
    },

    onDeleteItem (id) {
      let obj={ids:id}
      dispatch({
        type: 'user/multiDelete',
        payload: obj,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'user/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    }
  }

  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
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
        pathname: '/user',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/user',
      }))
    },
    onAdd () {
      dispatch({
        type: 'user/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'user/multiDelete',
      payload: {
        ids: selectedRowKeys.join(','),
      },
    })
  }
  return (
    <div className="searchboxbg"  style={{paddingLeft:15}}>
      <Filter {...filterProps} />

      {/**<Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`Selected ${selectedRowKeys.length} items `}
            <Popconfirm title={'确定删除所选条目吗？'} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>删除</Button>
            </Popconfirm>
          </Col>
        </Row>**/}
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

User.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ user, loading }) => ({ user, loading }))(User)
