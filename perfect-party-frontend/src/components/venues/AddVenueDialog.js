import React, { PureComponent } from 'react';
import { Modal, Button, message } from 'antd';
import WrappedForm from './AddVenueForm';
import {interceptErr, isEmptyOrSpaces, STAT_SUCCESS} from "@/utils/utils";

class AddVenueDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      ...props.dummyCol,
    };
  }

  handleOk = () => {
    this.setState({ loading: true });
    const { hideFn, addFn, fetchData, title, dummyCol } = this.props;
    const { name, address, price } = this.state;
    const newItem = { name, address, price };
    addFn(newItem, ({ status }) => {
      interceptErr(status, () => {
        this.setState({
          loading: false,
          ...dummyCol,
        }, () => {
          fetchData();
          hideFn();
          message.success(`${title} added!`);
        });
      })
    });
  };

  updateName = name => { this.setState({ name }) };

  updateAddress = address => { this.setState({ address }) };

  updatePrice = price => { this.setState({ price }) };

  shouldDisable = () => {
    const { name, address, price } = this.state;
    return isEmptyOrSpaces(name) || isEmptyOrSpaces(address) || isEmptyOrSpaces(price);
  };

  render() {
    const { visible, hideFn } = this.props;
    const { loading } = this.state;
    const updaters = {
      updateName: this.updateName,
      updateAddress: this.updateAddress,
      updatePrice: this.updatePrice,
    };

    return (
      <div>
        <Modal
          visible={visible}
          title="New Venue"
          footer={[
            <Button key="back" onClick={hideFn} style={{ borderRadius: 0, }}>
              Back
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleOk}
              style={{ borderRadius: 0 }}
              disabled={this.shouldDisable()}
            >
              Add
            </Button>
          ]}
          onCancel={hideFn}
        >
          <WrappedForm
            updaters={updaters}
            dialogStates={this.state}
          />
        </Modal>
      </div>
    )
  }
}

/* <AddClientDialog visible addFn hideFn /> */
export default AddVenueDialog;
