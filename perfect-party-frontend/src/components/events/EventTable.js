import React, { Component } from 'react';
import { Table, Input, InputNumber, Select, Popconfirm, Tooltip, Form, Divider, Button, Icon, Skeleton, List, Tag, message } from 'antd';
import Highlighter from 'react-highlight-words';
import {dataIndexToInputType, getItemBy, interceptErr, ObjSetAll, parseDateStr, STAT_SUCCESS} from "../../utils/utils";
import router from 'umi/router';
import store from '@/utils/store.json';

const EventContext = React.createContext();

const dataColumns = [
  {
    title: 'Event',
    dataIndex: 'eventname',
    key: 'eventname',
    width: 90,
    // fixed: 'left',
  },
  {
    title: 'Type',
    dataIndex: 'typename',
    key: 'typename',
    // width: '4%',
    render: typename => (<Tag color="volcano">{typename}</Tag>),
  },
  {
    title: 'Venue',
    dataIndex: 'venuename',
    key: 'venuename',
    // width: '8%',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    // width: '15%',
  },
  {
    title: 'Date',
    dataIndex: 'eventdate',
    key: 'eventdate',
    // width: '5%',
    render: eventdate => (<span>{parseDateStr(eventdate)}</span>),
  },
  {
    title: 'Number of Invitees',
    dataIndex: 'numinvitees',
    key: 'numinvitees',
    // width: '5%',
  },
  {
    title: 'Client',
    dataIndex: 'clientname',
    key: 'clientname',
    // width: '6%',
    render: clientname => (<a>{clientname}</a>),
  },
  {
    title: 'Budget',
    dataIndex: 'budget',
    key: 'budget',
    // width: '5%',
  },
/*
  {
    title: 'Base Price',
    dataIndex: 'baseprice',
    // width: '3%',
  },
  {
    title: 'Venue Price',
    dataIndex: 'venueprice',
    // width: '3%',
  },
*/
  {
    title: 'Total Price',
    dataIndex: 'totalprice',
    // width: 100,
    render: (totalprice, record) => (
      <span>
        <span style={{ fontWeight: 600 }}>{totalprice}</span>
        {` (Base: ${'$'+record.baseprice} + Venue: ${'$'+record.venueprice}`}
      </span>
    ),
  },
];

class EventTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      // editingKey: '',
      searchText: '',
    };
    const dataCols = dataColumns.map(col => ({
      ...col,
      // ...this.getColumnSearchProps(col.dataIndex),// ?
    }));// TODO: add search function...
    if (props.historical === false) {
      this.columns = [...dataCols, {
        title: 'Operation',
        dataIndex: 'operation',
        width: 104,
        // fixed: 'right',
        render: (text, record) => {
          return (
            <div>
              <Tooltip title="Edit Event">
                <a onClick={() => this.onEditClick(record.key)}>
                  <Icon type="edit" />
                </a>
              </Tooltip>
              <Divider type="vertical"/>
              <Popconfirm
                placement="left"
                title="Sure to mark this event as 'done'?"
                onConfirm={() => this.markDone(record.key)}
              >
                <a><Icon type="check-square"/></a>
              </Popconfirm>
              <Divider type="vertical"/>
              <Popconfirm
                placement="left"
                title="Sure to cancel this event?"
                onConfirm={() => this.cancelEvent(record.key)}
              >
                <a><Icon type="close"/></a>
              </Popconfirm>
            </div>
          );
        },
      }];
    } else {
      this.columns = [...dataCols];
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource } = this.props;
    if (nextProps.dataSource !== undefined && nextProps.dataSource != dataSource) {
      this.setState({ data: nextProps.dataSource });
    }
  }

  componentDidUpdate(prevProps) {
    const { dataSource } = this.props;
    if (prevProps.dataSource !== dataSource && dataSource !== undefined) {
      this.setState({data: dataSource});
    }
  }

  onEditClick = eventid => {
    console.log('eventid =>',eventid);// .
    store.currentEventId = eventid;
    router.push('/perfectparty/events/editor');
/*
    router.push({
      pathname: '/perfectparty/events/editor',
      state: { eventid },
    })
*/
  };

  cancelEvent = key => {
    const { cancelFn, fetchData } = this.props;
    const data = [...this.state.data];
    cancelFn(key, ({ status }) => {
      interceptErr(status, () => {
        this.setState({ data: data.filter(item => item.key !== key) }, () => {
          fetchData();
          message.info(`Event cancelled!`);
        });
      })
    });
  };

  markDone = key => {
    const { makeHistFn, fetchData } = this.props;
    const data = [...this.state.data];
    makeHistFn(key, ({ status }) => {
      interceptErr(status, () => {
        this.setState({ data: data.filter(item => item.key !== key) }, () => {
          fetchData();
          message.success(`Event marked as 'done'!`);
        })
      })
    });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
/*
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text && text.toString()}
      />
    ),
*/
  });
  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const { dataSource } = this.props;
/*
    const expandedRowRender = (record, index) => {
      const columns = [
        { title: 'Item', dataIndex: 'itemname', key: 'itemname', width: '30%',
          render: (itemname, record) => (
            <span> {itemname} <Tag color="cyan">{record.itemtype}</Tag> </span>
          )},
        { title: 'Price', dataIndex: 'itemprice', key: 'itemprice', width: '10%' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount', width: '10%' },
      ];
      const data = record.itemlist.map(item => ({
        key: item.itemname,
        ...item,
      }));
      return (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ y: 240 }}
        />
      );
    };
*/
    const expandedRowRender = (record, index) => {
      return (
        <List
          size="small"
          itemLayout="horizontal"
          dataSource={record.itemlist}
          renderItem={item => (
            <List.Item>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={(
                    <span>
                      {item.itemname} <Tag color="green">{item.itemtype}</Tag>
                      <span> x {item.amount}</span>
                    </span>
                  )}
                  description={'$'+item.itemprice+' / unit'}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      );
    };

    return (
      <div>
        <EventContext.Provider value={this.props.form}>
          <Table
            size="small"
            scroll={{ x: 800 }}
            // components={components}
            bordered
            dataSource={dataSource}
            columns={this.columns}
            rowClassName="editable-row"
            pagination={{
              onChange: this.cancel,
            }}
            expandedRowRender={expandedRowRender}
          />
        </EventContext.Provider>
      </div>
    );
  }
}

const WrappedEventTable = Form.create()(EventTable);

export default WrappedEventTable;
