import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import {formItemLayout,width200} from "@/utils/style-utils/style-utils";
import {PAYITEM_TYPE_LIST,upper1st} from "@/utils/utils";
import {requiredRule} from "../../utils/utils";

const { Item } = Form;
const { Option } = Select;

class AddVenueForm extends PureComponent {

  render() {
    const { updaters, dialogStates, form } = this.props;
    const { getFieldDecorator } = form;
    const { name, address, price } = dialogStates;

    return (
      <Form>
        <Item
          {...formItemLayout}
          label="Venue"
        >
          {getFieldDecorator('name', {
            rules: requiredRule('venue'),
          })(
            <Input
              placeholder='Enter..'
              style={width200}
              value={name}
              onChange={e => {
                updaters.updateName(e.target.value);
              }}
            />
          )}
        </Item>
        <Item
          {...formItemLayout}
          label="Address"
        >
          {getFieldDecorator('address', {
            rules: requiredRule('address'),
          })(
            <Input
              placeholder='Enter..'
              style={width200}
              value={address}
              onChange={e => {
                updaters.updateAddress(e.target.value);
              }}
            />
          )}
        </Item>
        <Item
          {...formItemLayout}
          label="Price"
        >
          {getFieldDecorator('price', {
            rules: requiredRule('price'),
          })(
            <InputNumber
              placeholder='Enter..'
              style={width200}
              value={price}
              onChange={val => {
                updaters.updatePrice(val);
              }}
            />
          )}
        </Item>
      </Form>
    )
  }
}

const WrappedForm = Form.create()(AddVenueForm);
export default WrappedForm;
