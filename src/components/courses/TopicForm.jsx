import React, { PropTypes } from 'react';
import TextInput from '../common/TextInput.jsx';

const TopicForm = ({ name, onChange, errors }) => {
    const errorElement = Object.keys(errors);
    return (
        <div className="form-container">
            <TextInput
                containerClass="form-group"
                label="Name"
                type="text"
                name="name"
                id="form-name"
                className="form-control"
                placeholder="Enter Topic's Name"
                value={name}
                onChange={onChange}
                errorMsg={errorElement.includes('name') ? errors.name : ''}
            />
        </div>
    );
};

TopicForm.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
};

export default TopicForm;
