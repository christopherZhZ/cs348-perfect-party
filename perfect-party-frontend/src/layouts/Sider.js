import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Alert, Button } from 'antd';
import router from 'umi/router';
import styles from './Sider.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

class SiderView extends PureComponent {

  onMenuClick = ({ key }) => {
    router.push(`/perfectparty/${key}`);
  };

  onNewEventClick = () => {
    router.push(`/perfectparty/events/newform`);
  };

  render() {
    const AddNoteView = (
      <div className={styles.logo}>
        <Button
          type="dashed"
          shape="round"
          icon="plus"
          onClick={this.onNewEventClick}
        >
          New Event
        </Button>
      </div>
    )
/*
    const AddNoteView = (
      <div
        className={styles.logo}
        onClick={this.onNewEventClick}
      >
        <Alert
          className={styles.newNote}
          type="success"
          message={(
            <div>
              <Icon type="plus-circle" theme="filled" className={styles.menuIcon} />
              <span>New Event</span>
            </div>
          )}
        />
      </div>
    );
*/

    return (
      <Sider collapsible>
        {AddNoteView}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={this.onMenuClick}
        >
          <Menu.Item key="events">
            <Icon type="schedule" />
            <span>All Events</span>
          </Menu.Item>
          <Menu.Item key="clients">
            <Icon type="user" />
            <span>Clients</span>
          </Menu.Item>
          <Menu.Item key="suppliers">
            <Icon type="shop" />
            <span>Suppliers</span>
          </Menu.Item>
          <Menu.Item key="venues">
            <Icon type="environment" />
            <span>Venues</span>
          </Menu.Item>
          <SubMenu
            key="priced"
            title={(
              <span>
                <Icon type="dollar" /> Fee Items
              </span>
            )}
          >
            <Menu.Item key="priced-host">Host</Menu.Item>
            <Menu.Item key="priced-food">Food</Menu.Item>
            <Menu.Item key="priced-decor">Decoration</Menu.Item>
            <Menu.Item key="priced-entertainment">Entertainment</Menu.Item>
            <Menu.Item key="priced-other">Other</Menu.Item>
          </SubMenu>
          <Menu.Item key="payments">
            <Icon type="barcode"/>
            <span>Payment History</span>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default SiderView;
