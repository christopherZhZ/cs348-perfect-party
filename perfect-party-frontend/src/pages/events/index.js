import React, { Component } from 'react';
import { PageHeader, Divider, Tag, Tabs, Icon, message } from 'antd';
import EventTable from '@/components/events/EventTable';
import {pageHeaderStyle} from "../../utils/style-utils/style-utils";
import {listHistorical,listFuture,makeHistorical,cancelEvent,updateEvent} from "../../utils/fetcher/event";
import {interceptErr, parseDateStr} from "../../utils/utils";
import store from '@/utils/store.json';

const { TabPane } = Tabs;

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      histEvents: [],
      futureEvents: [],
    };
  }

  componentDidMount() {
    const { editSuccess } = store;
    if (editSuccess === true) {
      message.success(`Successfully edited event!`);
      store.editSuccess = false;
    }
    this.fetchData();
    message.config({
      top: 100,
      duration: 4,
      maxCount: 3,
    });
  }

  fetchData = () => {
    listHistorical(({ status, results }) => {
      interceptErr(status, () => {
        const histEvents = results.map(evt => ({
          key: evt.eventid,
          ...evt,
        }));
        this.setState({ histEvents });
        console.log('fetchData: hist-events gotten: ', histEvents);// .
      })
    });
    listFuture(({ status, results }) => {
      interceptErr(status, () => {
        const futureEvents = results.map(evt => ({
          key: evt.eventid,
          ...evt,
        }));
        this.setState({ futureEvents });
        console.log('fetchData: hist-events gotten: ', futureEvents);// .
      })
    });
  };

  makeHistFn = (id, callback) => {
    console.log('makeHistFn: id =>',id);// .
    makeHistorical(id, callback);
  };

  cancelFn = (id, callback) => {
    console.log('deleteFn: id =>',id);// .
    cancelEvent(id, callback);
  };

  render() {
    const { histEvents, futureEvents } = this.state;

    return (
      <div>
        <Divider
          orientation="left"
          style={pageHeaderStyle}
        >
          All Events
        </Divider>

        <Tabs defaultActiveKey="1">
          <TabPane
            tab={<span> <Icon type="loading-3-quarters" /> Future Event </span>}
            key="1"
          >
            <EventTable
              // dataColumns={dataColumns}
              dataSource={futureEvents}
              historical={false}
              // editFn={this.editFn}
              // addFn={this.addFn}
              makeHistFn={this.makeHistFn}
              cancelFn={this.cancelFn}
              fetchData={this.fetchData}
              // showAddDialog={this.showFn}
            />
          </TabPane>
          <TabPane
            tab={<span> <Icon type="history" /> Past Event </span>}
            key="2"
          >
            <EventTable
              // dataColumns={dataColumns}
              dataSource={histEvents}
              historical={true}
              makeHistFn={this.makeHistFn}
              cancelFn={this.cancelFn}
              fetchData={this.fetchData}
            />
          </TabPane>
        </Tabs>

      </div>
    );
  }
}

export default Events;
