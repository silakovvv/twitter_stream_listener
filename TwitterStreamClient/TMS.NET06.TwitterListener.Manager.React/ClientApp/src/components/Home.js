import React, { Component, useState } from 'react';
import {
    Container, Col, Row, Form, FormGroup, Input, InputGroup, InputGroupAddon,
    Button, Table, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import Moment from 'moment';
import { Pagination } from './Pagination';
import { CreateListenerTask } from './CreateListenerTask';

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingTasks: true,
            listenerTasks: [],
            taskStatusesMatching: {},
            taskPerPage: 8,
            tasksCount: null,
            openModalDeletingTask: false,
            createTask: false,
            selectedTask: 0
        };

        this.currentPage = 1; 
    }

    componentDidMount() {
        this.populateTaskStatusesMatching();
        this.populateListenerTasks();
    }

    handleSearchStringsInput(evt) {
        if (evt.charCode == 13) {
            this.currentPage = 1;
            this.populateListenerTasks(evt.target.value);
        }
    }

    handleSearch(searchText) {
        this.populateListenerTasks(searchText);
    }

    clearSearchResults(evt) {
        if (!evt.target.value) {
            this.currentPage = 1;
            this.populateListenerTasks();
        }
    }

    saveTask = () => {
        this.setState({ createTask: false, selectedTask: 0 });
        this.populateListenerTasks();
    }

    render() {
        if (this.state.createTask) {
            return (
                <CreateListenerTask saveTask={this.saveTask} taskId={this.state.selectedTask}/>
            );
        }

        const paginate = (pageNum) => {
            this.currentPage = pageNum;
            this.populateListenerTasks(document.getElementById("searchText").value);
        }

        return (
            <Container>
                <Row>
                    <Col sm={6}>
                        <h1 id="tabelLabel">Listener Tasks</h1>
                    </Col>
                    <Col sm={6}>
                        <div className="text-right">
                            <Button
                                color="success" style={{ padding: 10 }}
                                onClick={(evt) => {
                                    evt.preventDefault();
                                    this.setState({ createTask: true, selectedTask: 0 });
                                }}>New Task</Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Modal isOpen={this.state.openModalDeletingTask}>
                        <ModalHeader>Delete task?</ModalHeader>
                        <ModalBody>
                            Don't delete anything yet, please.
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={(evt) => {
                                evt.preventDefault();
                                this.setState({ openModalDeletingTask: false });
                            }}>Welldone... :/</Button>
                        </ModalFooter>
                    </Modal>
                </Row>
                <Row>
                    <Col sm={12}>
                        <div style={{ marginTop: 15 }}>
                            <Row>
                                <Col sm={12}>
                                    <Form>
                                        <FormGroup>
                                            <InputGroup>
                                                <Input
                                                    name="searchText"
                                                    id="searchText"
                                                    placeholder="Search for a task by name..."
                                                    /*onKeyPress={(evt) => { this.handleSearchStringsInput(evt); evt.preventDefault(); }}*/
                                                    onChange={(evt) => this.clearSearchResults(evt) }
                                                />
                                                <InputGroupAddon addonType="append">
                                                    <Button
                                                        color="primary"
                                                        onClick={(evt) => { evt.preventDefault(); this.handleSearch(document.getElementById("searchText").value); }}>
                                                        Search
                                                    </Button>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormGroup>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Table className='table table-striped' aria-labelledby="tabelLabel">
                                    <thead>
                                        <tr>
                                            <th className="text-center">#</th>
                                            <th className="text-center">Name</th>
                                            <th className="text-center">Filter rules</th>
                                            <th className="text-center">Period</th>
                                            <th className="text-center">Duration (min.)</th>
                                            <th className="text-center">Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!this.state.listenerTasks.length && !this.state.loading && (
                                            <tr className="text-center">
                                                <td colSpan={9}>No tasks</td>
                                            </tr>
                                        )}
                                        {this.state.loading && (
                                            <tr className="text-center">
                                                <td colSpan={9}>
                                                    <span>Loading...</span>
                                                </td>
                                            </tr>
                                        )}
                                        {!this.state.loading &&
                                            this.state.listenerTasks.map(task =>
                                                <tr key={task.taskId}>
                                                    <th scope="row">{task.taskId}</th>
                                                    <td>{task.name}</td>
                                                    <td className="col-sm-2">{task.listenerOptions.filterRules.length
                                                        ? task.listenerOptions.filterRules.toString() : ''}</td>
                                                    <td>
                                                        <Row>
                                                            {Moment(task.taskOptions.startDate).format('d.MM.yyyy h:mm:ss a')}
                                                        </Row>
                                                        <Row>
                                                            - {Moment(task.taskOptions.endDate).format('d.MM.yyyy h:mm:ss a')}
                                                        </Row>
                                                    </td>
                                                    <td className="text-center">{task.taskOptions.duration}</td>
                                                    <td>{this.state.taskStatusesMatching[task.status]}</td>
                                                    <td>
                                                        <Row>
                                                            <Button color="primary" style={{ margin: 2 }}
                                                                onClick={(evt) => {
                                                                    evt.preventDefault();
                                                                    this.setState({ createTask: true, selectedTask: task.taskId });
                                                                }}>edit</Button>
                                                            <Button color="danger" style={{ margin: 2 }}
                                                                onClick={(evt) => {
                                                                    evt.preventDefault();
                                                                    this.setState({ openModalDeletingTask: true });
                                                                }}>delete</Button>
                                                        </Row>
                                                    </td>
                                                </tr>
                                            )}
                                    </tbody>
                                </Table>
                            </Row>
                            <Row>
                                {!(this.state.listenerTasks.length === 0) && !this.state.loadingTasks && !!this.state.tasksCount && (
                                    <Col>
                                        <Pagination
                                            totalCount={this.state.tasksCount}
                                            perPage={this.state.taskPerPage}
                                            paginate={paginate}
                                            currentPage={this.currentPage}
                                        />
                                    </Col>
                                )}
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    async populateListenerTasks(searchText) {
        const params = {
            'currentPage': this.currentPage,
            'taskPerPage': this.state.taskPerPage,
            'searchText': searchText
        };

        let query = 'listenerTask?' + Object.keys(params)
                                            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                                            .join('&');

        const response = await fetch(query, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        this.setState({ listenerTasks: data, loadingTasks: false });

        this.populateCountTasks(searchText);
    }

    async populateCountTasks(searchText) {
        let query = 'listenerTask/count?searchText=' + encodeURIComponent(searchText);

        const response = await fetch(query, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        this.setState({ tasksCount: data });
    }

    async populateTaskStatusesMatching() {
        const response = await fetch('listenerTask/taskStatusesMatching', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        const data = await response.json();
        this.setState({ taskStatusesMatching: data });
    }
}
