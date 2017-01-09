import React, { PropTypes } from 'react';
import TextInput from '../common/TextInput.jsx';
import TextArea from '../common/TextArea.jsx';

const TeacherForm = ({ name, bio, img, onChange, errors }) => {
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
                placeholder="Enter Teacher's Name"
                value={name}
                onChange={onChange}
                errorMsg={errorElement.includes('name') ? errors.name : ''}
            />
            <TextArea
                containerClass="form-group"
                label="Biography"
                name="bio"
                id="form-bio"
                className="form-control"
                placeholder="Enter Teacher's Biography"
                value={bio}
                onChange={onChange}
                errorMsg={errorElement.includes('bio') ? errors.name : ''}
            />
            <TextInput
                containerClass="form-group"
                label="Image"
                type="url"
                name="img_src"
                id="form-img"
                className="form-control"
                placeholder="Enter Teacher's Image"
                value={img}
                onChange={onChange}
                errorMsg={errorElement.includes('img_src') ? errors.name : ''}
            />
        </div>
    );
};

TeacherForm.propTypes = {
    name: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
};

export default TeacherForm;
