import React, { Component } from 'react';
import { Button, Form, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Label, Input, FormText, Row, Col, Badge } from 'reactstrap';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export class CreateListenerTask extends Component {
    constructor(props) {
        super(props);
        this.state = { rules: [] };

        this.TaskId = 1;
    }

    handleRulesInput(evt) {        
        if (evt.charCode == 13) {
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

    render() {
        return (
            <div>
                <Row>
                    <Col sm={6}>
                        <h1>Listener Task #{this.TaskId}</h1>
                    </Col>
                    <Col sm={6}>
                        <div className="text-right">
                            <Button color="success" style={{ padding: 10 }}>Save</Button>
                        </div>
                    </Col>
                </Row>
                <Form>
                    <FormGroup>
                        <Label for="taskName" sm="2">Name</Label>
                        <Col sm={6}>
                            <Input name="taskName" id="taskName" placeholder="add meaningful name" />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Label for="filterRule" sm="2">Filter rules</Label>
                        <Col sm={6}>
                            <Input name="filterRule" id="filterRule" placeholder="enter rule and press enter" onKeyPress={(evt) => this.handleRulesInput(evt)} />
                        </Col>
                        <Col sm={6} style={{ marginTop: 10 }}>
                            {this.state.rules.map((rule, index) =>
                                <Badge key={index} color="secondary" style={{ padding: 8 }}>
                                    {rule}
                                    <Badge color="danger" style={{ marginLeft: 8 }}>
                                        <a href="#" onClick={(evt) => { evt.preventDefault(); this.deleteRule(index); } }>X</a>
                                    </Badge>
                                </Badge>
                            )}
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col sm={3}>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>Start date</InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="date" name="startDate" id="startDate" />
                                </InputGroup>
                                <InputGroup>
                                    <DatePicker
                                        selected={new Date()}
                                        /*onChange={(date) => setStartDate(date)}*/
                                        timeInputLabel="Time:"
                                        dateFormat="MM/dd/yyyy h:mm aa"
                                        showTimeInput
                                    />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>End date</InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="date"name="endDateGroup" id="endDateGroup" />
                                </InputGroup>
                            </Col>
                        </Row>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}