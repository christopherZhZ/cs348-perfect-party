import React, { Component } from 'react';
import { Table, Input, InputNumber, Select, Popconfirm, Form, Divider, Button, Icon, message } from 'antd';
import Highlighter from 'react-highlight-words';
import {dataIndexToInputType, interceptErr, ObjSetAll, STAT_SUCCESS} from "../utils/utils";

const EditableContext = React.createContext();
class EditableCell extends Component {
  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }
  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }
  handleClickOutside = e => {
/*
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
*/
  };

  getInput = () => {
    const { inputType } = this.props;
    console.log('DAMNNNNN! inp_type:',inputType);// .
    if (inputType === 'rdonly') {
      return <Input disabled />;
    } else if (inputType === 'num') {
      return <InputNumber />;
    } else if (inputType === 'select') {
      return <Select />;
    } else if (inputType === 'text') {
      return <Input />;
    }
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
                  message: `Please enter ${title}!`,
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
    this.state = {
      data: [],
      editingKey: '',
      searchText: '',
    };
    let dataColumns;
    if (props.searchable === true) {
      dataColumns = props.dataColumns.map(col => ({
        ...col,
        ...this.getColumnSearchProps(col.dataIndex),
      }));
    } else {
      dataColumns = props.dataColumns;
    }

    if (props.editable === false) {
      this.columns = [...dataColumns];
    } else {
      this.columns = [...dataColumns, {
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const {editingKey} = this.state;
          return this.isEditing(record) ? (
            <span>
                <EditableContext.Consumer>
                  {form => (
                    <a
                      onClick={() => this.save(form, record.key)}
                      style={{marginRight: 8}}
                    >
                      Save
                    </a>
                  )}
                </EditableContext.Consumer>
                <Divider type="vertical"/>
                <a
                  onClick={this.cancel}
                >
                  Cancel
                </a>
              </span>
          ) : (
            <div>
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                Edit
              </a>
              <Divider disabled={editingKey !== ''} type="vertical"/>
              <Popconfirm title="Sure to delete this?" onConfirm={() => this.delete(record.key)}>
                <a>Delete</a>
              </Popconfirm>
            </div>
          );
        },
      }];
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource } = this.props;
    if (nextProps.dataSource !== undefined && nextProps.dataSource != dataSource) {
      this.setState({ data: nextProps.dataSource });
    }
  }

  componentDidUpdate(prevProps) {
    const { dataSource } = this.props;
    if (prevProps.dataSource !== dataSource && dataSource !== undefined) {
      this.setState({data: dataSource});
    }
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  delete = key => {
    const { deleteFn, title, fetchData } = this.props;
    const data = [...this.state.data];
    deleteFn(key, ({ status }) => {
      interceptErr(status, () => {
        this.setState({ data: data.filter(item => item.key !== key) }, () => {
          fetchData();
          message.info(`${title} deleted!`);
        });
      })
    });
  };

  save(form, key) {
    const { editFn, title, fetchData } = this.props;
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
        // console.log('!row',row);// .
        // console.log('!item',item);// .
        // console.log('!key',key);// .
        editFn(key, row, ({ status }) => {
          interceptErr(status, () => {
            this.setState({ data: newData, editingKey: '' }, () => {
              fetchData();
              message.success(`${title} updated!`);
            });
          })
        });
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

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });
  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };


  render() {
    const { title, dataSource, showAddDialog, editable } = this.props;
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
          // inputType: col.dataIndex === 'type' ? 'select' : 'text',
          inputType: dataIndexToInputType(col.dataIndex),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div>
        {editable && (
          <Button onClick={showAddDialog} type="primary" style={{ marginBottom: 16 }}>
            New {title}
          </Button>
        )}
        <EditableContext.Provider value={this.props.form}>
          <Table
            size="small"
            components={components}
            bordered
            dataSource={dataSource}
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

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;

/* Usage: <EditableTable title dataSource dataColumns editFn addFn deleteFn /> */
