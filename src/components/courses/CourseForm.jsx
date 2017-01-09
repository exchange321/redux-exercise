import React, { PropTypes } from 'react';
import TextInput from '../common/TextInput.jsx';
import TextArea from '../common/TextArea.jsx';

const CourseForm = ({ title, description, img_src, onChange, errors }) => {
    const errorElement = Object.keys(errors);
    return (
        <div className="form-container">
            <TextInput
                containerClass="form-group"
                label="Title"
                type="text"
                name="title"
                id="form-title"
                className="form-control"
                placeholder="Enter Course's Title"
                value={title}
                onChange={onChange}
                errorMsg={errorElement.includes('title') ? errors.title : ''}
            />
            <TextArea
                containerClass="form-group"
                label="Description"
                name="description"
                id="form-desc"
                className="form-control"
                placeholder="Enter Course's Description"
                value={description}
                onChange={onChange}
                errorMsg={errorElement.includes('description') ? errors.description : ''}
            />
            <TextInput
                containerClass="form-group"
                label="Image"
                type="url"
                name="img_src"
                id="form-img"
                className="form-control"
                placeholder="Enter Course's Image URL"
                value={img_src}
                onChange={onChange}
                errorMsg={errorElement.includes('img_src') ? errors.img_src : ''}
            />
        </div>
    );
};

CourseForm.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    img_src: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
};

export default CourseForm;
