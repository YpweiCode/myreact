import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'

var params = {pickDistrictCode:5101,sendDistrictCode:5101};

const timeCarList = ({ location, dispatch, timeCarList, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination,count,routerDetail } = timeCarList
  const { pageSize } = pagination
  const listProps = {
    dataSource: list,
    loading: loading.effects['timeCarList/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch({
        type: 'timeCarList/query',
        payload: {
          ...query,
          current: page.current,
          pageSize: page.pageSize,
          status: 1,
          pickDistrictCode:params.pickDistrictCode || null,
          sendDistrictCode:params.sendDistrictCode || null
        }
      });
    },
    addCargo (id,transportationVolume,transportationWeight) {
      dispatch(routerRedux.push({
        pathname: `/cargo/newCargoList/${id}/${transportationVolume}/${transportationWeight}`,
      }))
    },
  }

  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      params = value
        dispatch({ type: 'timeCarList/query', payload: {... params}});
      //dispatch(routerRedux.push({
      //  pathname: location.pathname,
      //  query: {
      //    ...value,
      //    current: 1,
      //    pageSize,
      //  },
      //}))
    },
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      <List {...listProps} />
    </Page>
  )
}

timeCarList.propTypes = {
  timeCarList: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ timeCarList, loading }) => ({ timeCarList, loading }))(timeCarList)
