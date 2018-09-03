import React, { Component } from 'react';
import {
    Button,
    Form
} from 'semantic-ui-react';

class Register extends Component {
    renderRegisterForm() {
        return (
            <Form>
                <Form.Field>
                    <label>Name</label>
                    <input name='name' placeholder='Full Name' />
                </Form.Field>
                <Form.Field>
                    <label>Username</label>
                    <input name='username' placeholder="Username" />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input type='password' name='password' placeholder="Password" />
                </Form.Field>
                <Button type="submit">Register</Button>
            </Form>
        )
    }

    render() {
        return(
        <div>
            <div style={{textAlign: 'center'}}>
                <h1>Schedule Hero</h1>
                <div>Register</div>
            </div>
            {this.renderRegisterForm()}
        </div>
        );
    }
}

export default Register;