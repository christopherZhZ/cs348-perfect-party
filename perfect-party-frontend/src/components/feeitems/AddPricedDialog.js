import React, { PureComponent } from 'react';
import { Modal, Button, message } from 'antd';
import WrappedForm from './AddPricedForm';
import {interceptErr, isEmptyOrSpaces, STAT_SUCCESS} from "../../utils/utils";

class AddPricedDialog extends PureComponent {
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
    const { itemname, itemprice, supplierid } = this.state;
    const newItem = { itemname, itemprice, supplierid };
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

  updateItemname = itemname => { this.setState({ itemname }) };

  updateItemprice = itemprice => { this.setState({ itemprice }) };

  updateSupplierid = supplierid => { this.setState({ supplierid }) };

  shouldDisable = () => {
    const { itemname, itemprice, supplierid }  = this.state;
    return isEmptyOrSpaces(itemname) || isEmptyOrSpaces(itemprice) || isEmptyOrSpaces(supplierid);
  };

  render() {
    const { visible, hideFn, title, supplierList } = this.props;
    const { loading } = this.state;
    const updaters = {
      updateItemname: this.updateItemname,
      updateItemprice: this.updateItemprice,
      updateSupplierid: this.updateSupplierid,
    };

    return (
      <div>
        <Modal
          visible={visible}
          title={`New ${title}`}
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
            supplierList={supplierList}
          />
        </Modal>
      </div>
    )
  }
}

export default AddPricedDialog;
