import React, { Component } from 'react';
import { PageHeader } from 'antd';
import EventTable from '@/components/EventTable';

class Events extends Component {



  render() {
    const columns = [];

    return (
      <div>
        <PageHeader backIcon={null} title="All Events" />
        <EventTable />
      </div>
    );
  }
}

export default Events;
