import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch } from 'antd'
import classnames from 'classnames'
import { config } from 'utils'
import styles from './Layout.less'
import Menus from './Menu'
import { Layout } from 'antd';
const { Sider } = Layout;


const LeftSider = ({ siderFold, darkTheme, location, isNavbar, switchSider, layoutSiderCollapsed, changeTheme, navOpenKeys, changeOpenKeys, menu }) => {
  const menusProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  return (
    <div>
      <div className={styles.logo} style={{marginBottom:0,height:55}}>
        <div style = {{width: '100%', height:25}}>
          <img src = '/g2logo.svg' className = {styles.logoImage}/>
          <img src = '/g2logo2.svg' className = {styles.logoImage1}/>
        </div>
        {isNavbar
          ? <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...menusProps} />}>
            <div className={styles.button}>
              <Icon type="bars" />
            </div>
          </Popover>
          : <div
          style={{margin:0,padding:0}}
            className={styles.button}
            onClick={switchSider}
          >

            <Icon style={{fontSize:16}}  type={classnames({ 'menu-unfold': siderFold, 'menu-fold': !siderFold })} />
          </div>}

      </div>
      <Sider collapsible trigger={null} collapsed={layoutSiderCollapsed} width = '209'>
          <Menus {...menusProps} />
      </Sider>
    </div>
  )
}

LeftSider.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  switchSider: PropTypes.func,
  isNavbar: PropTypes.bool,
  changeTheme: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default LeftSider
