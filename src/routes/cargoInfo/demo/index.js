import React from 'react';
import PropTypes from 'prop-types';
import { Table, Popconfirm, Button, Switch } from 'antd';


const ProductList = ({ onDelete, products }) => {
  const columns = [{
    title: 'Name',
    dataIndex: 'name',
  },{
    title: 'sex',
    dataIndex: 'sex1',
  },{
    title: 'switch',
    dataIndex: 'switch',
    render: (text, record) => {
      return (
        <Switch></Switch>
      );
    },
  }, {
    title: 'Actions',
    render: (text, record) => {
      return (
        <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
          <Button>Delete</Button>
        </Popconfirm>
      );
    },
  }];

  products = [{"name" :"name111" ,"sex1":"男"}];

  return (
    <Table
      dataSource={products}
      columns={columns}
    />
  );
};

ProductList.propTypes = {
  onDelete: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

export default ProductList;
