/**
 * Created by Wayuki on 07-Jan-17 0007.
 */
import React, { PropTypes } from 'react';

const Course = ({ title, desc, img, onCourseClick, editing }) => {
    let classList = 'course media clearfix';
    if (editing) {
        classList += ' editing';
    }
    return (
        <li className={classList} onClick={e => onCourseClick(e)}>
            <img src={img} alt={title} className="course-img"/>
            <div>
                <h3>{title}</h3>
                <p>{desc}</p>
            </div>
        </li>
    )
};

Course.propTypes = {
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    onCourseClick: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
};

export default Course;
