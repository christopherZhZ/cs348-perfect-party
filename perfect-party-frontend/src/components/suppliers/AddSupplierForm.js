import React, { PureComponent } from 'react';
import { Form, Input, AutoComplete, Select } from 'antd';
import {formItemLayout,width200} from "@/utils/style-utils/style-utils";
import {PAYITEM_TYPE_LIST,upper1st} from "@/utils/utils";
import {requiredRule} from "../../utils/utils";

const { Item } = Form;
const { Option } = Select;

class AddSupplierForm extends PureComponent {

  render() {
    const { updaters, dialogStates, form } = this.props;
    const { getFieldDecorator } = form;
    const { name, offeredtype, tel } = dialogStates;

    return (
      <Form>
        <Item
          {...formItemLayout}
          label="Supplier"
        >
          {getFieldDecorator('name', {
            rules: requiredRule('supplier'),
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
          label="Item Type"
        >
          {getFieldDecorator('offeredtype', {
            rules: requiredRule('item type'),
          })(
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a type"
              optionFilterProp="children"
              onChange={(value,opt) => {
                // console.log('VAL =>',value);// .
                // console.log('OPT =>',opt);// .w
                updaters.updateOfferedtype(value);
              }}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {PAYITEM_TYPE_LIST.map(t => (
                <Option key={t}>{upper1st(t)}</Option>
              ))}
            </Select>
          )}
        </Item>
        <Item
          {...formItemLayout}
          label="Tel."
        >
          {getFieldDecorator('tel', {
            rules: requiredRule('phone number'),
          })(
            <Input
              placeholder='Enter..'
              style={width200}
              value={tel}
              onChange={e => {
                updaters.updateTel(e.target.value);
              }}
            />
          )}
        </Item>
      </Form>
    )
  }
}

const WrappedForm = Form.create()(AddSupplierForm);
export default WrappedForm;
