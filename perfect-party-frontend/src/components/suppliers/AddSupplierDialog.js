import React, { PureComponent } from 'react';
import { Modal, Button, message } from 'antd';
import WrappedForm from './AddSupplierForm';
import {interceptErr, isEmptyOrSpaces, STAT_SUCCESS} from "@/utils/utils";

class AddSupplierDialog extends PureComponent {
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
    const { name, offeredtype, tel } = this.state;
    const newItem = { name, offeredtype, tel };
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

  updateOfferedtype = offeredtype => { this.setState({ offeredtype }) };

  updateTel = tel => { this.setState({ tel }) };

  shouldDisable = () => {
    const { name, offeredtype, tel } = this.state;
    return isEmptyOrSpaces(name) || isEmptyOrSpaces(offeredtype) || isEmptyOrSpaces(tel);
  };

  render() {
    const { visible, hideFn } = this.props;
    const { loading } = this.state;
    const updaters = {
      updateName: this.updateName,
      updateOfferedtype: this.updateOfferedtype,
      updateTel: this.updateTel,
    };

    return (
      <div>
        <Modal
          visible={visible}
          title="New Supplier"
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
export default AddSupplierDialog;
