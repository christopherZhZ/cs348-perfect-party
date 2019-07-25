import React, { Component } from 'react';
import { Divider, Tooltip, Icon } from 'antd';
import EditableTable from '@/components/EditableTable';
import {listPayitemByType, addPayitemByType, deletePayitem, updatePayitem} from "../../utils/fetcher/feeitem";
import {listSupplierByType} from "../../utils/fetcher/supplier";
import {pageHeaderStyle} from "@/utils/style-utils/style-utils";
import AddPricedDialog from "../../components/feeitems/AddPricedDialog";

class PricedHost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
      hosts: [],
      supplierList: [],
    }
  }

  componentDidMount() {
    this.fetchData();
    this.fetchSupplierList();
  }

  fetchData = () => {
    listPayitemByType('host', ({ results }) => {
      const hosts = results.map(row => ({
        key: row.itemid,
        ...row,
      }));
      this.setState({ hosts });
      console.log('fetchData: hosts gotten: ',hosts);// .
    })
  };

  fetchSupplierList = () => {
    listSupplierByType('host', ({ results }) => {
      this.setState({ supplierList: results });
      console.log('fetchSuppList: gotten: ',results);// .
    });
  };

  addFn = (item, callback) => {
    console.log('addFn: item =>',item);// .
    addPayitemByType('host', item, callback);
  };

  editFn = (id, item, callback) => {
    console.log('editFn: id =>',id);// .
    console.log('editFn: item =>',item);// .
    updatePayitem(id, item, callback);
  };

  deleteFn = (id, callback) => {
    console.log('deleteFn: id =>',id);// .
    deletePayitem(id, callback);
  };

  showFn = () => { this.setState({ addVisible: true }) };

  hideFn = () => { this.setState({ addVisible: false }) };

  render() {
    const { hosts, supplierList, addVisible } = this.state;

    const dataColumns = [
      {
        title: 'Item',
        dataIndex: 'itemname',
        width: '25%',
        editable: true,
        render: (text, record) => (
          <span>
            <Tooltip
              title={(
                <img
                  width={120}
                  alt="logo"
                  src={record.picurl}
                />
              )}
            >
              <Icon type="picture" />
            </Tooltip>
            {`  ${text}`}
          </span>
        )
      },
      {
        title: 'Item Price',
        dataIndex: 'itemprice',
        width: '15%',
        editable: true,
      },
      {
        title: 'Supplier',
        dataIndex: 'suppliername',
        width: '25%',
        editable: false
      },
    ];

    const dummyCol = {
      itemname: '',
      itemprice: '',
      supplierid: '',
    };

    return (
      <div>
        <Divider
          orientation="left"
          style={pageHeaderStyle}
        >
          Host (Emcee) List
        </Divider>
        <EditableTable
          title="Host"
          editable={true}
          searchable={false}
          dataColumns={dataColumns}
          dataSource={hosts}
          editFn={this.editFn}
          addFn={this.addFn}
          deleteFn={this.deleteFn}
          fetchData={this.fetchData}
          showAddDialog={this.showFn}
        />
        <AddPricedDialog
          title="Host"
          visible={addVisible}
          dummyCol={dummyCol}
          supplierList={supplierList}
          addFn={this.addFn}
          hideFn={this.hideFn}
          fetchData={this.fetchData}
        />
      </div>
    );
  }
}

export default PricedHost;
