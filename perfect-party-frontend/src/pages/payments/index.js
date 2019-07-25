import React, { Component } from 'react';
import { PageHeader, Divider } from 'antd';
import EditableTable from '@/components/EditableTable';
import { listPayment } from "@/utils/fetcher/payment";
import {pageHeaderStyle} from "@/utils/style-utils/style-utils";
import {interceptErr} from "../../utils/utils";

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    listPayment(({ status, results }) => {
      interceptErr(status, () => {
        const payments = results.map(row => ({
          key: row.paymentid,
          ...row,
        }));
        this.setState({ payments });
        console.log('fetchData: payments gotten: ', payments);// .
      })
    })
  };

  render() {
    const { payments, addVisible } = this.state;

    const dataColumns = [
      {
        title: 'Event Name',
        dataIndex: 'eventname',
        width: '30%',
        editable: true,
      },
      {
        title: 'Client Name',
        dataIndex: 'clientname',
        width: '30%',
        editable: true,
      },
      {
        title: 'Price',
        dataIndex: 'total',
        width: '30%',
        editable: true
      },
    ];

    return (
      <div>
        <Divider
          orientation="left"
          style={pageHeaderStyle}
        >
          Payment History
        </Divider>
        <EditableTable
          title="Payment history"
          editable={false}
          searchable={true}
          dataColumns={dataColumns}
          dataSource={payments}
          fetchData={this.fetchData}
        />
      </div>
    );
  }
}

export default Payments;
