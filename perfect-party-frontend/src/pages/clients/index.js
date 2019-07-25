import React, { Component } from 'react';
import { PageHeader, Divider, message } from 'antd';
import EditableTable from '@/components/EditableTable';
import {addClient, deleteClient, listClient, updateClient} from "@/utils/fetcher/client";
import {pageHeaderStyle} from "@/utils/style-utils/style-utils";
import AddClientDialog from "../../components/clients/AddClientDialog";

const mockData = [];
for (let i = 0; i < 10; i++) {
  mockData.push({
    key: i.toString(),
    FName: `Edward ${i}`,
    LName: `Jenkins`,
    Email: '123@test.ca',
  });
}// mock

class Clients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
      clients: [],
    }
  }

  componentDidMount() {
    this.fetchData();
    message.config({
      top: 100,
      duration: 4,
      maxCount: 3,
    });
  }

  fetchData = () => {
    listClient(({ results }) => {
      const clients = results.map(row => ({
        key: row.clientid,
        ...row,
      }));
      this.setState({ clients });
      // console.log('fetchData: clients gotten: ',clients);// .
    })
  };

  addFn = (item, callback) => {
    console.log('addFn: item =>',item);// .
    addClient(item, callback);
  };

  editFn = (id, item, callback) => {
    console.log('editFn: id =>',id);// .
    console.log('editFn: item =>',item);// .
    updateClient(id, item, callback);
  };

  deleteFn = (id, callback) => {
    console.log('deleteFn: id =>',id);// .
    deleteClient(id, callback);
  };

  showFn = () => { this.setState({ addVisible: true }) };

  hideFn = () => { this.setState({ addVisible: false }) };

  render() {
    const { clients, addVisible } = this.state;

    const dataColumns = [
      {
        title: 'First Name',
        dataIndex: 'fname',
        width: '20%',
        editable: true,
      },
      {
        title: 'Last Name',
        dataIndex: 'lname',
        width: '20%',
        editable: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: '35%',
        editable: true
      },
    ];

    const dummyCol = {
      fname: '',
      lname: '',
      email: '',
    };

    return (
      <div>
        <Divider
          orientation="left"
          style={pageHeaderStyle}
        >
          Clients
        </Divider>
        <EditableTable
          title="Client"
          editable={true}
          searchable={true}
          dataColumns={dataColumns}
          dataSource={clients}
          editFn={this.editFn}
          addFn={this.addFn}
          deleteFn={this.deleteFn}
          fetchData={this.fetchData}
          showAddDialog={this.showFn}
        />
        <AddClientDialog
          title="Client"
          dummyCol={dummyCol}
          visible={addVisible}
          addFn={this.addFn}
          hideFn={this.hideFn}
          fetchData={this.fetchData}
        />
      </div>
    );
  }
}

export default Clients;
