import React, { PropTypes } from 'react';

const TextArea = ({ containerClass, label, name, id, className, placeholder, value, onChange, errorMsg }) => {
    if (errorMsg.length > 0) {
        containerClass += ' has-danger';
        className += ' form-control-danger';
    }
    return (
        <div className={containerClass}>
            <label className="form-control-label" htmlFor={id}>{label}</label>
            <textarea
                name={name}
                className={className}
                id={id}
                placeholder={placeholder}
                value={value}
                cols="30"
                rows="10"
                onChange={onChange}
            />
            { errorMsg.length > 0 && <div className="form-control-feedback">{errorMsg}</div> }
        </div>
    );
};

TextArea.propTypes = {
    containerClass: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errorMsg: PropTypes.string.isRequired,
};

export default TextArea;
