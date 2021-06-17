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
            currentPage: 1,
            taskPerPage: 2,
            tasksCount: null,
        };
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
                                    <Button color="primary">edit</Button>
                                    <Button color="danger">delete</Button>
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
            this.populateListenerTasks(evt.target.value);
        }
    }

    handleSearch(searchText) {
        this.populateListenerTasks(searchText);
    }

    clearSearchResults(evt) {
        if (!evt.target.value) {
            this.populateListenerTasks();
        }
    }

    render() {
        const paginate = pageNum => { this.populateListenerTasks() };

        let tableListenerTasks = Home.renderListenerTasksTable(
            { listenerTasks: this.state.listenerTasks, taskStatusesMatching: this.state.taskStatusesMatching },
            this.state.loadingTasks
        ); 

        return (
            <Container>
                <Row>
                    <h1 id="tabelLabel">Listener tasks</h1>
                </Row>
                <Row>
                    <Col sm={12}>
                        <div>
                            <Row>
                                <Col sm={12}>
                                    <Form>
                                        <FormGroup>
                                            <InputGroup>
                                                <Input
                                                    name="searchText"
                                                    id="searchText"
                                                    placeholder="Search for a task by name..."
                                                    onKeyPress={(evt) => { evt.preventDefault(); this.handleSearchStringsInput(evt) }}
                                                    onChange={(evt) => { evt.preventDefault(); this.clearSearchResults(evt) }}
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
                                <Col>
                                    <Pagination infoPerPage={this.state.taskPerPage}
                                        totalInfo={this.state.patientsCount} paginate={paginate} currentPage={this.state.currentPage} />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    async populateListenerTasks(searchText) {
        const params = {
            'currentPage': this.state.currentPage,
            'taskPerPage': this.state.taskPerPage,
            'searchText': searchText
        };

        let query = 'listenerTask?' + Object.keys(params)
                                            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                                            .join('&');
        console.log(query);

        const response = await fetch(query, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        this.setState({ listenerTasks: data, loadingTasks: false, tasksCount: data.length });
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
