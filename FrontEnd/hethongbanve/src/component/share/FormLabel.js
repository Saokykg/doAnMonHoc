import React from "react";
import { Form } from "react-bootstrap";

class FormLabel extends React.Component{
    render(){
        return(
            <Form.Group className="mb-3" controlId={this.props.name}>
                <Form.Label>{this.props.label}</Form.Label>
                <Form.Control type={this.props.type} value = {this.props.value} readOnly={this.props.read} onChange={this.props.change}/>
            </Form.Group>
        )
    }
}

export default FormLabel;