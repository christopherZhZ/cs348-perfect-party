import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Alert } from 'antd';
import router from 'umi/router';
import styles from './Sider.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

class SiderView extends PureComponent {

  onMenuClick = ({ key }) => {// .
    router.push(`/perfectparty/${key}`);
    console.log('KEY',key);// .
/*
    const { dispatch } = this.props;
    if (key === 'all-notes') {
      dispatch({
        type: 'note/getNoteListByUser',
      });
    } else if (key.startsWith('nb-')) {
      const notebookid = key.split('nb-')[1];
      dispatch({
        type: 'notebook/getNotebook',
        payload: { notebookid },
      }).then(() => {
        dispatch({
          type: 'note/getNoteListByNotebook',
          payload: { notebookid },
        });
      });
    } else if (key === 'shared') {
      dispatch({
        type: 'share/getMyShareList',
      });
    }
*/
  };

  onNewEventClick = () => {// .
/*
    const newEmptyNote = {
      notebookid: currNotebook.id,
      userid: getUserIdOrEmpty(),
      title: 'untitled',
      content: newEmptyNoteContent(),
    };
    dispatch({
      type: 'note/addNote',
      payload: newEmptyNote,
    });
*/
  };

  render() {
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
                <Icon type="dollar" />Fee Items
              </span>
            )}
          >
            <Menu.Item key="priced-host">Host</Menu.Item>
            <Menu.Item key="priced-food">Food</Menu.Item>
            <Menu.Item key="priced-beverage">Beverage</Menu.Item>
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
