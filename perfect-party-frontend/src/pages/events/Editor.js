import React, { Component } from 'react';
import {
  Form,
  Input,
  List,
  Icon,
  InputNumber,
  Select,
  Row,
  Col,
  Button,
  AutoComplete,
  Divider,
  Tag,
  DatePicker,
  Skeleton,
  Avatar,
  Tooltip,
  message,
} from 'antd';
import {eventFormItemLayout, pageHeaderStyle, width250} from "../../utils/style-utils/style-utils";
import {addEvent, getEvent, updateEvent} from "../../utils/fetcher/event";
import {listClient} from "../../utils/fetcher/client";
import {listEventtype} from "../../utils/fetcher/eventtype";
import {listVenue} from "../../utils/fetcher/venue";
import {listPayitemByType} from "../../utils/fetcher/feeitem";
import {getItemBy, interceptErr, parseDateStr, PAYITEM_TYPE_LIST, requiredRule, upper1st} from "../../utils/utils";
import moment from 'moment';
import {addByList, deleteByEvent} from "../../utils/fetcher/record";
import store from '@/utils/store.json';
import router from 'umi/router';

const { Item } = Form;
const { Option } = Select;

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const itemObjToStr = itemObj => `${itemObj.itemname} (by ${itemObj.suppliername})`;

const objectConfig = (title,initDate) => ({
  rules: [{ type: 'object', required: true, message: `Please select ${title}!` }],
  initialValue: initDate,
});

const disabledDate = current => current && current < moment().endOf('day');


class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEventId: undefined,
      loading: false,
      clientList: [],
      eventtypeList: [],
      venueList: [],
      payitemOptList: [],
      userArtifactList: [],
      // selectedType: undefined,
      selectedItem: undefined,
      selectedAmount: 1,

      clientname: '',
      eventname: '',
      typeid: '',
      typename: '',
      eventdate: '',
      venueid: '',
      venuename: '',
      numinvitees: 1,
      budget: 1000,
    };
  }

  componentDidMount() {
    const { currentEventId } = store;
    this.setState({ currentEventId });
    this.fetchEventInfo(currentEventId);
    // this.fetchClientList();
    this.fetchEventtypeList();
    this.fetchVenueList();
  }

  componentWillUnmount() {
    store.currentEventId = null;
  }

  fetchEventInfo = eventid => {
    getEvent(eventid, ({ status, results }) => {
      interceptErr(status, () => {
        console.log('RES RES =>',results);// .
        const { clientname, eventname, typeid, typename, eventdate, venueid, venuename, numinvitees, budget, itemlist } = results;
        this.setState({
          clientname,
          eventname,
          typeid,
          typename,
          eventdate: moment(parseDateStr(eventdate),'YYYY-MM-DD'),
          venueid,
          venuename,
          numinvitees,
          budget,
          userArtifactList: [...itemlist],
        });
      })
    });
  };

  fetchClientList = () => {
    listClient(({ status, results }) => {
      interceptErr(status, () => {
        this.setState({ clientList: results });
      })
    });
  };

  fetchEventtypeList = () => {
    listEventtype(({ status, results }) => {
      interceptErr(status, () => {
        this.setState({ eventtypeList: results });
      })
    });
  };

  fetchVenueList = () => {
    listVenue(({ status, results }) => {
      interceptErr(status, () => {
        this.setState({ venueList: results });
      })
    });
  };

  fetchPayitemOptListByType = type => {
    console.log('fetchPayitemOptListByType',type);// .
    listPayitemByType(type, ({ status, results }) => {
      interceptErr(status, () => {
        console.log('fetchPayitemOptListByType',results);// .
        this.setState({ payitemOptList: results });
      })
    });
  };

  onAddArtifactClick = () => {
    const { userArtifactList, selectedItem, selectedAmount } = this.state;
    if (selectedItem === undefined || selectedAmount === undefined) return;
    if (getItemBy('itemid',selectedItem.itemid,userArtifactList) === null) {// don't allow duplicate items in list
      this.setState({
        userArtifactList: [{...selectedItem, amount: selectedAmount}, ...userArtifactList],
      }, () => {
        this.setState({selectedItem: undefined, selectedAmount: 1})
      })
    }
  };

  onDeleteArtifactRow = itemid => {
    const { userArtifactList } = this.state;
    this.setState({ userArtifactList: userArtifactList.filter(i => i.itemid !== itemid) });
  };

  onFinalSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });

    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue,
          'clientname': this.state.clientname,
          'eventdate': fieldsValue['eventdate'].format('YYYY-MM-DD'),
        };
        if (typeof(values.typeid) === 'string') values.typeid = this.state.typeid;
        if (typeof(values.venueid) === 'string') values.venueid = this.state.venueid;
        console.log('FORM VALUES => ', JSON.stringify(values,null,2));// .
        console.log('ARTIFACTS => ',this.state.userArtifactList);// .
        const itemList = this.state.userArtifactList.map(item => ({
          itemid: item.itemid,
          amount: item.amount,
        }));
        console.log('itemList => ',itemList);// .
        const { currentEventId } = this.state;
        updateEvent(currentEventId, values, ({ status }) => {
          interceptErr(status, () => {
            deleteByEvent(currentEventId, ({ status }) => {
              interceptErr(status, () => {
                addByList(currentEventId, itemList, ({ status }) => {
                  this.setState({ loading: false });
                  store.editSuccess = true;
                  store.currentEventId = null;
                  router.push('/perfectparty/events');
                })
              })
            });
          })
        });
      } else {
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { clientList, eventtypeList, venueList, payitemOptList, userArtifactList, selectedItem, selectedAmount, loading } = this.state;

    const usageEditPane = (
      <div>
        <Divider orientation="center" >Edit item list for this event</Divider>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <div className="gutter-box">
              <Select
                // defaultValue="food"
                placeholder='Select type first'
                onChange={val => {
                  this.fetchPayitemOptListByType(val)
                }}
              >
                {PAYITEM_TYPE_LIST.map(t => (
                  <Option key={t}>{upper1st(t)}</Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col className="gutter-row" span={9}>
            <div className="gutter-box">
              <Select
                showSearch
                // style={{ width: 200 }}
                placeholder="Then select an item"
                optionFilterProp="children"
                onChange={(value,opt) => {
                  console.log('VALVALVAL =>',JSON.stringify(value,null,3));// .
                  this.setState({ selectedItem: value });
                }}
                value={selectedItem && itemObjToStr(selectedItem)}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {payitemOptList.map(itemObj => (
                  <Option key={itemObj.itemid} value={itemObj}>{itemObjToStr(itemObj)}</Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col className="gutter-row" span={4}>
            <div className="gutter-box">
              <InputNumber
                min={1}
                value={selectedAmount}
                onChange={val => { this.setState({ selectedAmount: val }) }}
              />
            </div>
          </Col>
          <Col className="gutter-row" span={3}>
            <div className="gutter-box">
              <Tooltip title="Add to item list">
                <a onClick={this.onAddArtifactClick}>
                  <Icon type="plus-circle" />
                </a>
              </Tooltip>
            </div>
          </Col>
        </Row>
        {userArtifactList.length > 0 &&
        <List
          size="small"
          itemLayout="horizontal"
          dataSource={userArtifactList}
          renderItem={item => (
            <List.Item actions={[
              <a onClick={() => { this.onDeleteArtifactRow(item.itemid) }}>
                <Icon type="minus-square" />
              </a>
            ]}>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={null}
                  title={(
                    <span>
                        {item.itemname} <Tag color="green">{item.itemtype}</Tag>
                        <span> x {item.amount}</span>
                      </span>
                  )}
                  description={'$' + item.itemprice}
                />
              </Skeleton>
            </List.Item>
          )}
        />
        }
      </div>
    );

    const clientOpts = clientList.map(cli => (
      <Option key={cli.clientid}>{`${cli.fname} ${cli.lname}`}</Option>
    ));
    const eventtypeOpts = eventtypeList.map(type => (
      <Option key={type.typeid}>{type.typename}</Option>
    ));
    const venueOpts = venueList.map(vn => (
      <Option key={vn.venueid}>{vn.name} (<span style={{ color: 'grey' }}>{vn.address}</span>)</Option>
    ));
    const {
      clientname,
      eventname,
      typeid,
      typename,
      eventdate,
      venueid,
      venuename,
      numinvitees,
      budget,
    } = this.state;
    const FormUI = (
      <Form {...eventFormItemLayout} onSubmit={this.onFinalSubmit}>
        <Item label="Client">
          {getFieldDecorator('clientid', {
            rules: requiredRule('client'),
            initialValue: clientname,
          })(
            <Select
              style={width250}
              defaultValue={clientname}
              disabled
            >
              <Option value={clientname}>{clientname}</Option>
            </Select>
          )}
        </Item>
        <Item label="Event Title">
          {getFieldDecorator('eventname', {
            rules: requiredRule('event title'),
            initialValue: eventname,
          })(
            <Input
              placeholder='Name your new event..'
              style={width250}
              // value={itemname}
              onChange={e => {
                console.log('event title input ',e.target.value);// .
                // updaters.updateItemname(e.target.value);
              }}
            />
          )}
        </Item>
        <Item label="Event Type">
          {getFieldDecorator('typeid', {
            rules: requiredRule('event type'),
            // initialValue: getItemBy('typeid',typeid,eventtypeList).typename,
            initialValue: typename,
          })(
            <Select
              showSearch
              style={width250}
              placeholder="Select an event type"
              optionFilterProp="children"
              onChange={(value,opt) => {
                console.log('select evt type VAL =>',value);// .
                console.log('select evt type OPT =>',opt);// .
              }}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {eventtypeOpts}
            </Select>
          )}
        </Item>
        <Item label="Event Date">
          {getFieldDecorator('eventdate', objectConfig('date',eventdate))(
            <DatePicker
              style={width250}
              disabledDate={disabledDate}
            />
          )}
        </Item>
        <Item label="Venue">
          {getFieldDecorator('venueid', {
            rules: requiredRule('venue'),
            // initialValue: getItemBy('venueid',venueid,venueList).venuename,
            initialValue: venuename,
          })(
            <Select
              showSearch
              style={width250}
              placeholder="Select a venue to hold the event"
              optionFilterProp="children"
              onChange={(value,opt) => {
                console.log('select venue type VAL =>',value);// .
                console.log('select venue type OPT =>',opt);// .
              }}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {venueOpts}
            </Select>
          )}
        </Item>
        <Item label="Number of Invitees">
          {getFieldDecorator('numinvitees', {
            rules: requiredRule('number of invitees'),
            initialValue: numinvitees,
          })(
            <InputNumber
              style={{ width: 80 }}
              // prefix={(<Icon type="dollar-circle" theme="filled"/>)}
              // formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              // parser={value => value.replace(/\$\s?|(,*)/g, '')}
              // value={itemprice}
              onChange={value => {
                console.log('VVV =>',value);// .
              }}
            />
          )}
        </Item>
        <Item label="Client's Budget">
          {getFieldDecorator('budget', {
            rules: requiredRule('budget'),
            initialValue: budget,
          })(
            <InputNumber
              style={{ width: 140 }}
              // prefix={(<Icon type="dollar-circle" theme="filled"/>)}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              // value={itemprice}
              onChange={value => {
                console.log('BBBudget =>',value);// .
              }}
            />
          )}
        </Item>
        <Item label="Fee Items Usage">
          {usageEditPane}
        </Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );

    return (
      <div>
        <Divider
          orientation="left"
          style={pageHeaderStyle}
        >
          Event Editor
          {/*{this.state.currentEventId}*/}
        </Divider>
        {FormUI}
      </div>
    )
  }
}

const WrappedEditorForm = Form.create({ name: 'register' })(Editor);

export default WrappedEditorForm;
