import React, { PureComponent } from 'react';
import { Form, Input, AutoComplete } from 'antd';
import {formItemLayout,width150} from "@/utils/style-utils/style-utils";
import {requiredRule} from "../../utils/utils";

const { Item } = Form;

class AddClientForm extends PureComponent {
  state = {
    emailOptions: [],
  };

  fillSuggestion = value => {
    this.setState({
      emailOptions:
        !value || value.indexOf('@') >= 0
          ? []
          : [`${value}@gmail.com`, `${value}@outlook.com`, `${value}@yahoo.com`],
    });
  };

  render() {
    const { updaters, dialogStates, form } = this.props;
    const { getFieldDecorator } = form;
    const { fname, lname, email } = dialogStates;

    return (
      <Form>
        <Item
          {...formItemLayout}
          label="First Name"
        >
          {getFieldDecorator('fname', {
            rules: requiredRule('first name'),
          })(
            <Input
              placeholder='Enter..'
              style={width150}
              value={fname}
              onChange={e => {
                updaters.updateFname(e.target.value);
              }}
            />
          )}
        </Item>
        <Item
          {...formItemLayout}
          label="Last Name"
        >
          {getFieldDecorator('lname', {
            rules: requiredRule('last name'),
          })(
            <Input
              placeholder='Enter..'
              style={width150}
              value={lname}
              onChange={e => {
                updaters.updateLname(e.target.value);
              }}
            />
          )}
        </Item>
        <Item
          {...formItemLayout}
          label="Email"
        >
          {getFieldDecorator('email', {
            rules: [...requiredRule('email'), {
              type: 'email',
              message: 'This is not a valid email!',
            }]
          })(
            <AutoComplete
              placeholder="Enter.."
              style={width150}
              value={email}
              onChange={value => {
                this.fillSuggestion(value);
                updaters.updateEmail(value);
              }}
              dataSource={this.state.emailOptions}
            />
          )}
        </Item>
      </Form>
    )
  }
}

const WrappedForm = Form.create()(AddClientForm);
export default WrappedForm;
