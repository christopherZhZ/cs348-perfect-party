import React, { PureComponent } from 'react';
import { Modal, Button, message } from 'antd';
import WrappedForm from './AddClientForm';
import {interceptErr, isEmptyOrSpaces, STAT_SUCCESS} from "../../utils/utils";

class AddClientDialog extends PureComponent {
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
    const { fname, lname, email } = this.state;
    const newItem = { fname, lname, email };
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

  updateFname = fname => { this.setState({ fname }) };

  updateLname = lname => { this.setState({ lname }) };

  updateEmail = email => { this.setState({ email }) };

  shouldDisable = () => {
    const { fname, lname, email } = this.state;
    return isEmptyOrSpaces(fname) || isEmptyOrSpaces(lname) || isEmptyOrSpaces(email);
  };

  render() {
    const { visible, hideFn, title } = this.props;
    const { loading } = this.state;
    const updaters = {
      updateFname: this.updateFname,
      updateLname: this.updateLname,
      updateEmail: this.updateEmail,
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
          />
        </Modal>
      </div>
    )
  }
}

/* <AddClientDialog visible addFn hideFn /> */
export default AddClientDialog;
