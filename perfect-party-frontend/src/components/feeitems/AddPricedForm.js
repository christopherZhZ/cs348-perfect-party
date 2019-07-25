import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Select, Icon } from 'antd';
import {formItemLayout,width200} from "@/utils/style-utils/style-utils";
import {requiredRule} from "../../utils/utils";

const { Item } = Form;
const { Option } = Select;

class AddClientForm extends PureComponent {

  render() {
    const { updaters, dialogStates, form, supplierList } = this.props;
    const { getFieldDecorator } = form;
    const { itemname, itemprice, supplierid } = dialogStates;

    const supplierOpts = supplierList.map(sup => (
      <Option key={sup.supplierid}>{sup.name}</Option>
    ));

    return (
      <Form>
        <Item
          {...formItemLayout}
          label="Item Name"
        >
          {getFieldDecorator('itemname', {
            rules: requiredRule('item name'),
          })(
            <Input
              placeholder='Enter..'
              style={width200}
              value={itemname}
              onChange={e => {
                updaters.updateItemname(e.target.value);
              }}
            />
          )}
        </Item>
        <Item
          {...formItemLayout}
          label="Item Price"
        >
          {getFieldDecorator('itemprice', {
            rules: requiredRule('item price'),
          })(
            <InputNumber
              placeholder='$ 1,000'
              defaultValue={0}
              style={width200}
              // prefix={(<Icon type="dollar-circle" theme="filled"/>)}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              value={itemprice}
              onChange={value => {
                console.log('VVV =>',value);// .
                updaters.updateItemprice(value);
              }}
            />
          )}
        </Item>
        <Item
          {...formItemLayout}
          label="Supplier"
        >
          {getFieldDecorator('supplierid', {
            rules: requiredRule('supplier'),
          })(
            <Select
              showSearch
              style={width200}
              placeholder="Select a type"
              optionFilterProp="children"
              onChange={(value,opt) => {
                // console.log('VAL =>',value);// .
                // console.log('OPT =>',opt);// .w
                updaters.updateSupplierid(value);
              }}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {supplierOpts}
            </Select>

          )}
        </Item>
      </Form>
    )
  }
}

const WrappedForm = Form.create()(AddClientForm);
export default WrappedForm;
