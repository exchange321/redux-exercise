import React, { PropTypes } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Course from './Course.jsx';

const CoursePage = ({ courses, topicId, onEditTopic, onEditCourse, editingCourseId }) => {
    return (
        <div>
            <ul>
                <ReactCSSTransitionGroup
                    transitionName="block"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={0}
                    transitionAppear
                    transitionAppearTimeout={500}
                >
                    {
                        courses.map(course => (
                            <Course
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                desc={course.description}
                                img={course.img_src}
                                editing={editingCourseId === course.id}
                                onCourseClick={e => onEditCourse(e, topicId, course)}
                            />
                        ))
                    }
                </ReactCSSTransitionGroup>
            </ul>
            <div className="btn-container text-right">
                { topicId && <ButtonGroup>
                    <Button onClick={e => onEditTopic(e, topicId)} type="button" outline color="primary">Edit Topic</Button>
                    <Button onClick={e => onEditCourse(e, topicId)} type="button" color="primary">Add Course</Button>
                </ButtonGroup> }
            </div>
        </div>
    );
};

CoursePage.propTypes = {
    courses: PropTypes.array.isRequired,
    topicId: PropTypes.node.isRequired,
    onEditTopic: PropTypes.func,
    onEditCourse: PropTypes.func,
    editingCourseId: PropTypes.string,
};

export default CoursePage;
