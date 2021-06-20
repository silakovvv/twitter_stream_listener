import React, { Component, useState } from 'react';
import {
    Button, Form, FormGroup, Label, Input, Badge, Row, Col, Card, CardBody,
    TabContent, TabPane, Nav, NavItem, NavLink, Breadcrumb, BreadcrumbItem,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ButtonGroup
} from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import DatePicker from "react-datepicker"
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import Cron from 'react-cron-generator'

import "react-datepicker/dist/react-datepicker.css"
import 'react-cron-generator/dist/cron-builder.css'
import './ListenerTask.css'

export class CreateListenerTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskId: this.props.taskId,
            taskName: "",
            startDate: new Date(),
            endDate: setMinutes(new Date(), 60),
            duration: 0,
            rules: [],
            filteringMode: 0,
            cronSchedule: '* * * * * * *',
            savedTask: false,
            activeTab: '1',
            dropdownFiltersOnContensOpen: false, dropdownFiltersOnGeoOperatorsOpen: false, 
            dropdownFiltersOfInterestOpen: false, dropdownFiltersOnAttributesOpen: false
        };

        this.listFiltersOnContens = ['@', '#', '$', 'url:', 'lang:'];
        this.listFiltersOfInterest = ['from:', 'to:', 'retweets_of:'];
        this.listFiltersOnAttributes = ['is:retweet', 'has:mentions', 'has:hashtags', 'has:media', 'has:videos',
                                        'has:images', 'has:links', 'ha:symbols', 'is:verified', 'is:nullcast'];
        this.listFiltersOnGeoOperators = ['bounding_box:', 'point_radius:', 'has:geo', 'place:', 'place_country:',
                                          'has:profile_geo', 'profile_country:', 'profile_region:', 'profile_locality:'];
    }

    async componentDidMount() {
        await this.populateTask();
    }

    componentWillMount() {
        this.changeName = this.changeName.bind(this)
    }

    toggleTabPane = tab => {
        if (this.activeTab !== tab) this.setState({ activeTab: tab });
    }

    toggleDropdownFiltersOnContens = () => {
        this.setState({ dropdownFiltersOnContensOpen: !this.state.dropdownFiltersOnContensOpen });
    }

    toggleDropdownFiltersOnGeoOperators = () => {
        this.setState({ dropdownFiltersOnGeoOperatorsOpen: !this.state.dropdownFiltersOnGeoOperatorsOpen });
    }

    toggleDropdownFiltersOfInterest = () => {
        this.setState({ dropdownFiltersOfInterestOpen: !this.state.dropdownFiltersOfInterestOpen });
    }

    toggleDropdownFiltersOnAttributes = () => {
        this.setState({ dropdownFiltersOnAttributesOpen: !this.state.dropdownFiltersOnAttributesOpen });
    }

    addRuleLayoutInInput(rule) {
        var elemFilterRule = document.getElementById("filterRule");
        elemFilterRule.value = rule;
        elemFilterRule.focus();
    }

    defineColorClass(rule) {
        var index;

        for (index = 0; index < this.listFiltersOnContens.length; ++index) {
            if (rule.includes(this.listFiltersOnContens[index])) {
                return "filtersOnContensBadge";
            }
        }
        for (index = 0; index < this.listFiltersOfInterest.length; ++index) {
            if (rule.includes(this.listFiltersOfInterest[index])) {
                return "filtersOfInterestBadge";
            }
        }
        for (index = 0; index < this.listFiltersOnAttributes.length; ++index) {
            if (rule.includes(this.listFiltersOnAttributes[index])) {
                return "filtersOnAttributesBadge";
            }
        }
        for (index = 0; index < this.listFiltersOnGeoOperators.length; ++index) {
            if (rule.includes(this.listFiltersOnGeoOperators[index])) {
                return "filtersOnGeoOperatorsBadge";
            }
        }

        return "";
    }

    handleRulesInput(evt) {        
        if (evt.charCode == 13 && evt.target.value != '') {
            var rules = this.state.rules;
            rules.push(evt.target.value);
            this.setState({ rules: rules });
            evt.target.value = '';
        }
    }

    deleteRule(index) {
        var rules = this.state.rules;
        rules.splice(index, 1);
        this.setState({ rules: rules });
    }

    changeName(evt) {
        const { name, value } = evt.target;
        this.setState({ [name]: value });
    }

    render() {
        if (this.state.savedTask) {
            return (
                <p><em>Task added</em></p>
            );
        }

        return (
            <div>
                <Row>
                    <Col sm={6}>
                        <h1>Listener Task #{this.state.taskId}</h1>
                    </Col>
                    <Col sm={6}>
                        <div className="text-right">
                            <Button color="success"
                                style={{
                                    paddingTop: 10,
                                    paddingRight: 20,
                                    paddingBottom: 10,
                                    paddingLeft: 20,
                                    fontWeight: 700
                                }}
                                onClick={(evt) => { evt.preventDefault(); this.saveListenerTask(); }}>
                                Save</Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Breadcrumb tag="nav" listTag="div">
                        <BreadcrumbItem /*tag={Link} to="/"*/>
                            <a href="#" onClick={(evt) => { evt.preventDefault(); this.props.saveTask(); }}>&lt;- Back to the list</a>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Row>
                <Row>
                    <Form className="row" style={{ width: "100%" }}>
                        <Col sm={6}>
                            <FormGroup>
                                <Row>
                                    <Label for="taskName" sm={12}>Name</Label>
                                    <Col sm={12}>
                                        <Input type="text" name="taskName" id="taskName" placeholder="Add meaningful name"
                                            value={this.state.taskName}
                                            onChange={(evt) => { this.changeName(evt) }} />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col sm={6}>
                                        <Label for="startDate">Start date</Label>
                                        <Col style={{ padding: 0 }}>
                                            <DatePicker
                                                className="form-control"
                                                selected={this.state.startDate}
                                                onChange={(date) => { this.setState({ startDate: date }); }}
                                                timeInputLabel="Time:"
                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                showTimeInput
                                            />
                                        </Col>
                                    </Col>
                                    <Col sm={6}>
                                        <Label for="endDate">End date</Label>
                                        <Col style={{ padding: 0 }}>
                                            <DatePicker
                                                className="form-control"
                                                selected={this.state.endDate}
                                                onChange={(date) => { this.setState({ endDate: date }); }}
                                                timeInputLabel="Time:"
                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                showTimeInput
                                            />
                                        </Col>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col sm={6} style={{ padding: 0 }}>
                                        <Label for="duration" sm={12}>Duration (min.)</Label>
                                        <Col sm={12}>
                                            <Input name="duration" id="duration" placeholder="0"
                                                value={this.state.duration}
                                                onChange={(evt) => { this.changeName(evt) }} />
                                        </Col>
                                    </Col>
                                    <Col sm={6} style={{ padding: 0 }}>
                                        <Label for="filteringMode" sm={12}>Filtering mode</Label>
                                        <Col sm={12}>
                                            <ButtonGroup>
                                                <Button
                                                    className={this.state.filteringMode == 0 ? "btn-filteringMode btn-filteringMode-active" : "btn-filteringMode"}
                                                    onClick={(evt) => {
                                                        evt.preventDefault();
                                                        this.setState({ filteringMode: 0 })
                                                    }}>
                                                    All</Button>
                                                <Button
                                                    className={this.state.filteringMode == 1 ? "btn-filteringMode btn-filteringMode-active" : "btn-filteringMode"}
                                                    onClick={(evt) => {
                                                        evt.preventDefault();
                                                        this.setState({ filteringMode: 1 })
                                                    }}>
                                                    Any</Button>
                                            </ButtonGroup>
                                        </Col>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <div>
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '1' })}
                                            onClick={() => { this.toggleTabPane('1'); }}>
                                            Filter rules
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '2' })}
                                            onClick={() => { this.toggleTabPane('2'); }}>
                                            Scheduler
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.activeTab}>
                                    <TabPane tabId="1">
                                        <FormGroup>
                                            <Row>
                                                <Col style={{ marginTop: 10 }}>
                                                    <Dropdown className="filtersOnContens" style={{ paddingLeft: 15 }}
                                                        isOpen={this.state.dropdownFiltersOnContensOpen}
                                                        toggle={() => { this.toggleDropdownFiltersOnContens(); }}>
                                                        <DropdownToggle caret>
                                                            Matching on Tweet contents
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem text>keyword</DropdownItem>
                                                            <DropdownItem text>"quoted phrase"</DropdownItem>
                                                            <DropdownItem text>"keyword1 keyword2"~N</DropdownItem>
                                                            {this.listFiltersOnContens.map(el =>
                                                                <DropdownItem key={el} onClick={(evt) => { evt.preventDefault(); this.addRuleLayoutInInput(el); }}>{el}</DropdownItem>
                                                            )}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </Col>
                                                <Col style={{ marginTop: 10 }}>
                                                    <Dropdown className="filtersOnGeoOperators"
                                                        isOpen={this.state.dropdownFiltersOnGeoOperatorsOpen}
                                                        toggle={() => { this.toggleDropdownFiltersOnGeoOperators(); }}>
                                                        <DropdownToggle caret>
                                                            Geospatial operators
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            {this.listFiltersOnGeoOperators.map(el =>
                                                                <DropdownItem key={el} onClick={(evt) => { evt.preventDefault(); this.addRuleLayoutInInput(el); }}>{el}</DropdownItem>
                                                            )}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col style={{ marginTop: 15 }}>
                                                    <Dropdown className="filtersOfInterest" style={{ paddingLeft: 15 }}
                                                        isOpen={this.state.dropdownFiltersOfInterestOpen}
                                                        toggle={() => { this.toggleDropdownFiltersOfInterest(); }}>
                                                        <DropdownToggle caret>
                                                            Matching on accounts of interest
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            {this.listFiltersOfInterest.map(el =>
                                                                <DropdownItem key={el} onClick={(evt) => { evt.preventDefault(); this.addRuleLayoutInInput(el); }}>{el}</DropdownItem>
                                                            )}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </Col>
                                                <Col style={{ marginTop: 15 }}>
                                                    <Dropdown className="filtersOnAttributes"
                                                        isOpen={this.state.dropdownFiltersOnAttributesOpen}
                                                        toggle={() => { this.toggleDropdownFiltersOnAttributes(); }}>
                                                        <DropdownToggle caret>
                                                            Tweet attributes
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            {this.listFiltersOnAttributes.map(el =>
                                                                <DropdownItem key={el} onClick={(evt) => { evt.preventDefault(); this.addRuleLayoutInInput(el); }}>{el}</DropdownItem>
                                                            )}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </Col>
                                            </Row>
                                            <Col sm={12} style={{ marginTop: 15 }}>
                                                <Input name="filterRule" id="filterRule" placeholder="Enter rule and press enter" onKeyPress={(evt) => this.handleRulesInput(evt)} />
                                            </Col>
                                            <Col>
                                                <Card style={{ marginTop: 20 }}>
                                                    <CardBody>
                                                        <Col sm={12} style={{ marginTop: 10 }}>
                                                            {!this.state.rules.length && (<p>No rules :)</p>)}
                                                            {this.state.rules.map((rule, index) =>
                                                                <Badge className={"filterRule " + this.defineColorClass(rule)} key={index} color="secondary" style={{ padding: 8 }}>
                                                                    {rule}
                                                                    <Badge className="filterRule-del text-center " color="danger" >
                                                                        <a href="#" onClick={(evt) => { evt.preventDefault(); this.deleteRule(index); } }>X</a>
                                                                    </Badge>
                                                               </Badge>)}
                                                        </Col>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </FormGroup>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <FormGroup>
                                            <Cron
                                                onChange={(value) => { this.setState({ cronSchedule: value }); }}
                                                value={this.state.cronSchedule}
                                                showResultText={true}
                                                showResultCron={true}
                                            />
                                        </FormGroup>
                                    </TabPane>
                                </TabContent>
                            </div>
                        </Col>
                    </Form>
                </Row>
            </div>
        );
    }

    async populateTask() {
        if (this.props.taskId == 0) {
            return;
        }

        let query = 'listenerTask/task?id=' + this.props.taskId;

        const response = await fetch(query, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        this.setState({
            taskName: data.name,
            startDate: new Date(data.taskOptions.startDate),
            endDate: new Date(data.taskOptions.endDate),
            duration: data.taskOptions.duration,
            rules: data.listenerOptions.filterRules,
            filteringMode: data.listenerOptions.mode,
            cronSchedule: data.taskOptions.cronSchedule
        });
    }

    async saveListenerTask(date) {
        const response = await fetch('listenerTask/saveTask', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskId: this.state.taskId,
                name: this.state.taskName,
                "taskOptions": {
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    duration: this.state.duration,
                    cronSchedule: this.state.cronSchedule
                },
                "listenerOptions": {
                    filterRules: this.state.rules,
                    mode: this.state.filteringMode
                }
            })
        });
        const data = await response.json();
        this.setState({ savedTask: data });

        this.props.saveTask();
    }

}