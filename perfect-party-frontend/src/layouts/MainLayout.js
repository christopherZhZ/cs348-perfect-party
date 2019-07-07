import React, { PureComponent, Fragment } from 'react';
import { Layout } from 'antd';
import SiderView from './Sider';
import styles from './MainLayout.less';

const Context = React.createContext();
const { Content } = Layout;

class MainLayout extends PureComponent {

  render() {
    const { children } = this.props;

    const layout = (
      <Layout className={styles.frame}>
        <SiderView />
        <Layout className={styles.main} style={{ minHeight: '100vh' }}>
          <Content style={{ margin: 0 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <Fragment>
        <Context.Provider>
          <div>{layout}</div>
        </Context.Provider>
      </Fragment>
    );
  }
}

export default MainLayout;
