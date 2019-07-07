import React, { Component } from 'react';
import { PageHeader } from 'antd';
import EditableTable from '@/components/EditableTable';

class Clients extends Component {

  render() {
    const columns = [];

    return (
      <div>
        <PageHeader backIcon={null} title="Our Clients" />
        <EditableTable />
        /* <EditableTable addable title dataSource columns dummyCol editFn addFn deleteFn /> */
      </div>
    );
  }
}

export default Clients;
