import React, { PropTypes } from 'react';

const Teacher = ({ id, name, bio, img, editing, handleTeacherClick }) => {
    let teacherClass = 'teacher';
    if (editing) {
        teacherClass += ' editing';
    }
    return (
        <li onClick={handleTeacherClick} className={teacherClass} id={id}>
            <img src={img} alt={name} className="teacher-img" />
            <div className="content-container">
                <h3>{name}</h3>
                <p>{bio}</p>
            </div>
        </li>
    );
};

Teacher.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    editing: PropTypes.bool.isRequired,
    handleTeacherClick: PropTypes.func.isRequired,
};

export default Teacher;
