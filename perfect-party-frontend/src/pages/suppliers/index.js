import React, { Component } from 'react';
import { Divider } from 'antd';
import EditableTable from '@/components/EditableTable';
import {addSupplier,listSupplier,updateSupplier,deleteSupplier} from "@/utils/fetcher/supplier";
import {pageHeaderStyle} from "@/utils/style-utils/style-utils";
import AddSupplierDialog from "../../components/suppliers/AddSupplierDialog";

class Suppliers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
      suppliers: [],
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    listSupplier(({ results }) => {
      const suppliers = results.map(row => ({
        key: row.supplierid,
        ...row,
      }));
      this.setState({ suppliers });
      console.log('fetchData: suppliers gotten: ',suppliers);// .
    })
  };

  addFn = (item, callback) => {
    console.log('addFn: item =>',item);// .
    addSupplier(item, callback);
  };

  editFn = (id, item, callback) => {
    console.log('editFn: id =>',id);// .
    console.log('editFn: item =>',item);// .
    updateSupplier(id, item, callback);
  };

  deleteFn = (id, callback) => {
    console.log('deleteFn: id =>',id);// .
    deleteSupplier(id, callback);
  };

  showFn = () => { this.setState({ addVisible: true }) };

  hideFn = () => { this.setState({ addVisible: false }) };

  render() {
    const { suppliers, addVisible } = this.state;

    const dataColumns = [
      {
        title: 'Supplier',
        dataIndex: 'name',
        width: '30%',
        editable: true,
      },
      {
        title: 'Offered Type',
        dataIndex: 'offeredtype',
        width: '15%',
        editable: true,
      },
      {
        title: 'Tel.',
        dataIndex: 'tel',
        width: '20%',
        editable: true
      },
    ];

    const dummyCol = {
      name: '',
      offeredtype: '',
      tel: '',
    };

    return (
      <div>
        <Divider
          orientation="left"
          style={pageHeaderStyle}
        >
          Supplier
        </Divider>
        <EditableTable
          title="Supplier"
          editable={true}
          searchable={true}
          dataColumns={dataColumns}
          dataSource={suppliers}
          editFn={this.editFn}
          addFn={this.addFn}
          deleteFn={this.deleteFn}
          fetchData={this.fetchData}
          showAddDialog={this.showFn}
        />
        <AddSupplierDialog
          title="Supplier"
          visible={addVisible}
          dummyCol={dummyCol}
          addFn={this.addFn}
          hideFn={this.hideFn}
          fetchData={this.fetchData}
        />
      </div>
    );
  }
}

export default Suppliers;
