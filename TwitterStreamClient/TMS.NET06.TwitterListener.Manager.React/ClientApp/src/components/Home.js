import React, { Component } from 'react';
import { Button, Container, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Row, Table } from 'reactstrap';
import Moment from 'moment';
import { Pagination } from './Pagination';

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingTasks: true,
            listenerTasks: [],
            taskStatusesMatching: {},
            taskPerPage: 2,
            tasksCount: null,
        };

        this.currentPage = 1; 
    }

    componentDidMount() {
        this.populateTaskStatusesMatching();
        this.populateListenerTasks();
    }

    static renderListenerTasksTable(data, loading) {
        return (
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
                    {!data.listenerTasks.length && !loading && (
                        <tr className="text-center">
                            <td colSpan={9}>No tasks</td>
                        </tr>
                    )}
                    {loading && (
                        <tr className="text-center">
                            <td colSpan={9}>
                                <span>Loading...</span>
                            </td>
                        </tr>
                    )}
                    {!loading &&
                        data.listenerTasks.map(task =>
                        <tr key={task.taskId}>
                            <th scope="row">{task.taskId}</th>
                                <td>{task.name}</td>
                                <td>{task.listenerOptions.filterRules.length
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
                            <td>{data.taskStatusesMatching[task.status]}</td>
                            <td>
                                <Row>
                                    <Button color="primary" style={{ margin: 2 }}>edit</Button>
                                    <Button color="danger" style={{ margin: 2 }}>delete</Button>
                                </Row>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
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

    render() {
        const paginate = (pageNum) => {
            this.currentPage = pageNum;
            this.populateListenerTasks(document.getElementById("searchText").value);
        }

        let tableListenerTasks = Home.renderListenerTasksTable(
            { listenerTasks: this.state.listenerTasks, taskStatusesMatching: this.state.taskStatusesMatching },
            this.state.loadingTasks
        ); 

        return (
            <Container>
                <Row>
                    <Col sm={6}>
                        <h1 id="tabelLabel">Listener Tasks</h1>
                    </Col>
                    <Col sm={6}>
                        <div className="text-right">
                            <Button color="success" style={{ padding: 10 }}>New Task</Button>
                        </div>
                    </Col>
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
                                {tableListenerTasks}
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
