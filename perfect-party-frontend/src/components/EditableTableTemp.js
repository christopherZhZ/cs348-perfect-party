import React, { Component } from 'react';
import { Table, Input, Divider, Form, Tag } from 'antd';
import { ObjSetAll } from "../utils/utils";
import styles from './EditableTable.less';

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

const tagsRenderFn = color => (tags => (
  <span>
    {
      tags !== undefined ? tags.map(tag => <Tag color={color} key={tag} style={{ marginTop: "5px", }}>{tag}</Tag>):''
    }
  </span>
));

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' };
    this.columns = [...props.dataColumns, {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
        const { editingKey } = this.state;
        return this.isEditing(record) ? (
          <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Divider type="vertical" />
              <a>Cancel</a>
            </span>
        ) : (
          <div>
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              Edit
            </a>
            <Divider disabled={editingKey !== ''} type="vertical" />
            <Popconfirm title="Sure to delete this?" onConfirm={() => this.delete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          </div>
        );
      },
    },];

/*
    this.columns = [
      {
        title: 'name',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      },
      {
        title: 'age',
        dataIndex: 'age',
        width: '15%',
        editable: true,
      },
      {
        title: 'address',
        dataIndex: 'address',
        width: '40%',
        editable: true,
      },
    ];
*/
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    const { editFn } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        editFn(newData, () => {
          this.setState({ data: newData, editingKey: '' });
        });// ?
      }
/*
      else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
*/
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  add = () => {
    const { addFn, dummyCol } = this.props;
    const { count, dataSource } = this.state;

    ObjSetAll(dummyCol, 'Enter..');

    addFn(dummyCol, () => {
      this.setState({
        dataSource: [...dataSource, dummyCol],
        count: count+1,
      });
    });// ?
  };

  delete = key => {
    const { deleteFn } = this.props;
    const dataSource = [...this.state.dataSource];
    deleteFn(key, () => {
      this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    });// .
  };

  render() {
    const { title, addable } = this.props;
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div>
        {addable ? (
          <Button onClick={this.add} type="primary" style={{ marginBottom: 16 }}>
            Add new {title}
          </Button>
        ) : null}
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            rowClassName="editable-row"
            pagination={{
              onChange: this.cancel,
            }}
          />
        </EditableContext.Provider>
      </div>
    );
  }
}

// TODO: add Customized filter panel...

export default Form.create()(EditableTable);

/* <EditableTable addable title dataSource columns dummyCol editFn addFn deleteFn /> */
