import React, { Component } from 'react';
import './Test.css';
import { Avatar, Icon, Form, Button, notification, Input, Card, Select, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import { getTest, createTest, removeTest } from '../util/APIUtils';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faList, faEdit, faTrash, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';
import MyToast from '../MyToast';
import axios from 'axios';
import { 
    NAME_MIN_LENGTH, NAME_MAX_LENGTH, 
} from '../constants';

const Option = Select.Option;
const FormItem = Form.Item;
const key = 'updatable';
const openNotification = () => {
    notification.open({
      key,
      message: 'Save Successful!',
      description: 'Test info updated.',
    });
    setTimeout(() => {
      notification.open({
        key,
        message: 'Test info saved!',
        description: 'Test info was saved.',
      });
    }, 1000);
  };

class Test extends Component {

    constructor(props) {
        super(props);
        this.state = {
            test: {
                type: '',
                location: '',
                date: '',
                key: 'Info',
                locationItems: [],
                selectedLocation: null,
                typeItems: [],
                selectedType: null
            }
        }

        this.removeTestClicked = this.removeTestClicked.bind(this);
        this.testList = this.testList.bind(this);
        this.loadTest = this.loadTest.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);

        const id = this.props.match.params.id;
        this.loadTest(id);
    }

    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({ [type]: key });
      };

    loadTest(id) {
        this.setState({
            isLoading: true
        });

        getTest(id)
        .then(response => {
            this.setState({
                test: response,
                isLoading: false
            });
        }).catch(error => {
            console.log("fail");
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });        
            }
        });
    }

    componentDidMount() {
        //const id = this.props.match.params.id;
        //this.loadTest(id);
    
        //fetch(api)
        //.then(resp => resp.json())
        //.then(locationData => {
        //    this.setState({ 
        //    locationItems: locationData.map(item => ({ value: item, label: item })) }) 
        //})
    }

    render() {
        const {locationItems, selectedLocation, typeItems, selectedType} = this.state.test;

        const contentList = {
            Info: <div className="test-content">
            <Form onSubmit={this.handleSubmit} className="test-form">
            <Form.Item label="Type">
            <Select
                defaultValue={selectedType} onChange={this.handleDropdownChange}>
                {typeItems.map((item, index) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}

                <Option value="color">Color</Option>
                <Option value="blackbelt">Blackbelt</Option>

            </Select>
                </Form.Item>
            <Form.Item label="Location">
            <Select
                defaultValue={selectedLocation} onChange={this.handleDropdownChange}>
                {locationItems.map((item, index) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}

                <Option value="loc1">Loc 1</Option>
                <Option value="loc2">Loc 2</Option>
                <Option value="loc3">Loc 3</Option>

            </Select>
                </Form.Item>

                <Form.Item label="Date">
                <DatePicker />
                </Form.Item>

                <FormItem>
                    <Button type="primary" 
                        htmlType="submit" 
                        size="large" 
                        className="test-form-button-save"
                        disabled={this.isFormInvalid()}>Update Test</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" 
                        size="large" 
                        className="test-form-button-remove"
                        onClick={this.removeTestClicked}
                        //FontAwesomeIcon icon={faTrash}
                        >Remove Test</Button>
                </FormItem>
            </Form>
        </div>,



            Tests: <p>content2</p>,
          };

        return (
            <div className="test-container">

        <Card
          style={{ width: '100%',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}
          title={"Test "+this.state.test.id}
          //extra={<a href="#">More</a>}
          tabList={tabList}
          activeTabKey={this.state.key}
          onTabChange={key => {
            this.onTabChange(key, 'key');
          }}
        >
          {contentList[this.state.key]}
        </Card>
            </div>
        );
    }

    removeTestClicked () {
        removeTest(this.state.test)
        .then(response => {
            notification.success({
                message: 'Removal Successful',
                description: "Test removed.",
                duration: 6,
            });          
            this.props.history.push("/tests");
        }).catch(error => {
            notification.error({
                message: 'Unsuccessful',
                description: error.message || 'Something went wrong. Please try again!'
            });
        });
    }

    updateTest = event => {
        event.preventDefault();

        const test = {
            id: this.state.test.id,
            type: this.state.test.type,
            location: this.state.test.location,
            date: this.state.test.date
        };
        this.props.updateTest(test);
        setTimeout(() => {
            if(this.props.updatedTestObject.test != null) {
                this.setState({"show":true, "method":"put"});
                setTimeout(() => this.setState({"show":false}), 3000);
            } else {
                this.setState({"show":false});
            }
        }, 2000);
        this.setState(this.initialState);
    };

    handleDropdownChange = (value) => {
        this.setState({ selectedValue: value })
     }

    handleSubmit(event) {
        event.preventDefault();
    
        const test = {
            id: this.state.test.id,
            type: this.state.test.type,
            location: this.state.test.location,
            date: this.state.test.date
        };
        createTest(test)
        .then(response => {
            notification.success({
                message: 'Save Successful',
                description: "Test info updated.",
                duration: 6,
            });          
            this.props.history.push("/tests");
        }).catch(error => {
            notification.error({
                message: 'Unsuccessful',
                description: error.message || 'Something went wrong. Please try again!'
            });
        });
    }

    testList = () => {
        return this.props.history.push("/tests");
    };
};

const tabList = [
    {
      key: 'Info',
      tab: 'Info',
    },
    {
      key: 'Students',
      tab: 'Students',
    },
  ];

export default Test;