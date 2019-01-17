import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Modal,Timeline } from 'antd'
class planModal extends Component {
  constructor(props) { // 初始化的工作放入到构造函数
    super(props); // 在 es6 中如果有父类，必须有 super 的调用用以初始化父类信息

    this.state = { // 初始 state 设置方式
      index:null
    };
  }

  static propTypes = {
    // form: PropTypes.object.isRequired,
    type: PropTypes.string,
    item: PropTypes.object,
    // onOk: PropTypes.func,
  };

  componentDidMount() {
  };
  render() {
    const { item , onOk,onCancel, ...modalProps,} = this.props;
    const clickimg = (index) => {
      onCancel(index)
    }

    let timearr=this.props.imgArr
    let timeobj=timearr.map((item ,index)=>{
      return (<div style={{width:200,height:340,float:'left'}}><img src={item.url} style={{width:200,height:300,float:"left",border:'1px solid #ccc',marginBottom:10,marginLeft:5}} key={index} /><a style={{display:'block',width:200,textAlign:"center"}} onClick={clickimg.bind(this,index)} href='javascript:void(0);'>查看大图</a></div>)
    })
    const handleOk = () => {
    }
    const modalOpts = {
      ...modalProps,
      onOk: handleOk,
      onCancel:clickimg
    }
    return (
      <Modal {...modalOpts}>
        {timeobj}
      </Modal>
    )
  }
}



export default planModal
