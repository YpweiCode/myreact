import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover } from 'antd'
import classnames from 'classnames'
import styles from './Header.less'
import Menus from './Menu'

const SubMenu = Menu.SubMenu

const Header = ({ user, logout, switchSider, siderFold,  menuPopoverVisible, location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu }) => {
  let handleClickMenu = e => logout()
  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  return (
    <div className={styles.header}>
      <div>
      </div>
      <div className={styles.rightWarpper}>
        <Menu mode="horizontal" className = {styles.rightTopMenu}  >
          <SubMenu
            style={{
              float: 'right',
              borderBottom:"none"
            }}
            title={<span>
              <i className={`${styles.rightTopUser} iconfont icon-user`} style={{fontSize:14}}></i>
              <span className = {styles.username} >{user.username}</span>
              <span className = {styles.verticalLine} >|</span>

              <span onClick={handleClickMenu}>
                <i className={`${styles.rightExitButton} iconfont icon-out`} style={{fontSize:14}}></i>
                <span className = {styles.exitTitle}>退出</span>
              </span>

            </span>}
          >
          </SubMenu>
        </Menu>
      </div>
    </div>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
