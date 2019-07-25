import React, { Component } from 'react';
import { Divider } from 'antd';
import EditableTable from '@/components/EditableTable';
import {addVenue,updateVenue,listVenue,deleteVenue} from "../../utils/fetcher/venue";
import {pageHeaderStyle} from "@/utils/style-utils/style-utils";
import AddVenueDialog from "../../components/venues/AddVenueDialog";

class Venues extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
      venues: [],
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    listVenue(({ results }) => {
      const venues = results.map(row => ({
        key: row.venueid,
        ...row,
      }));
      this.setState({ venues });
      console.log('fetchData: venues gotten: ',venues);// .
    })
  };

  addFn = (item, callback) => {
    console.log('addFn: item =>',item);// .
    addVenue(item, callback);
  };

  editFn = (id, item, callback) => {
    console.log('editFn: id =>',id);// .
    console.log('editFn: item =>',item);// .
    updateVenue(id, item, callback);
  };

  deleteFn = (id, callback) => {
    console.log('deleteFn: id =>',id);// .
    deleteVenue(id, callback);
  };

  showFn = () => { this.setState({ addVisible: true }) };

  hideFn = () => { this.setState({ addVisible: false }) };

  render() {
    const { venues, addVisible } = this.state;

    const dataColumns = [
      {
        title: 'Venue',
        dataIndex: 'name',
        width: '30%',
        editable: true,
      },
      {
        title: 'Address',
        dataIndex: 'address',
        width: '15%',
        editable: true,
      },
      {
        title: 'Rental Price',
        dataIndex: 'price',
        width: '20%',
        editable: true
      },
    ];

    const dummyCol = {
      name: '',
      address: '',
      price: 0,
    };

    return (
      <div>
        <Divider
          orientation="left"
          style={pageHeaderStyle}
        >
          Venue
        </Divider>
        <EditableTable
          title="Venue"
          editable={true}
          searchable={true}
          dataColumns={dataColumns}
          dataSource={venues}
          editFn={this.editFn}
          addFn={this.addFn}
          deleteFn={this.deleteFn}
          fetchData={this.fetchData}
          showAddDialog={this.showFn}
        />
        <AddVenueDialog
          title="Venue"
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

export default Venues;
