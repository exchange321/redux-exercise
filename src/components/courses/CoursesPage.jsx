/**
 * Created by Wayuki on 07-Jan-17 0007.
 */
import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { browserHistory } from 'react-router';
import toastr from 'toastr';
import NavLink from '../common/NavLink.jsx';
import ModalContainer from '../common/ModalContainer.jsx';
import CoursePage from './course/CoursePage.jsx';
import TopicForm from './TopicForm.jsx';
import CourseForm from './CourseForm.jsx';
import taskCommands from '../../api/taskCommands';

class CoursesPage extends Component {
    static propTypes = {
        route: PropTypes.shape({
            topicAPI: PropTypes.func.isRequired,
        }),
        params: PropTypes.shape({
            topic: PropTypes.string,
        }),
    };

    state = {
        topics: [],
        courses: [],
        topicId: this.props.params.topic || '',
        modal: {
            editingTopicId: '',
            editingCourseId: '',
        },
        modalSettings: {
            triggerModal: false,
            modalContent: {
                modalTitle: '',
                handleFormSubmit: () => {},
                bodyContent: (<div />),
                footerContent: (<div />),
            },
        },
    };

    componentDidMount() {
        const topicAPI = this.props.route.topicAPI;
        topicAPI.task(taskCommands.GET_ALL_TOPICS).then((topics) => {
            this.setState({
                topics,
            }, () => {
                let topicId = this.state.topicId;
                if (!topicId) {
                    topicAPI.task(taskCommands.GET_DEFAULT_TOPIC, {
                        index: -1,
                    }).then((newTopicId) => {
                        topicId = newTopicId;
                        browserHistory.push(`/courses/${topicId}`);
                        this.setState({
                            topicId,
                        });
                    });
                }
                this.updateCoursesState(topicId);
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        const nextTopicId = nextProps.params.topic || '';
        if (this.state.topicId !== nextTopicId) {
            this.setState({
                topicId: nextTopicId,
                courses: [],
            }, () => this.updateCoursesState(nextTopicId));
        }
    }

    updateCoursesState = (topicId) => {
        const topicAPI = this.props.route.topicAPI;
        topicAPI.task(taskCommands.GET_DEFAULT_TOPIC, {
            index: -1,
        }).then((routeTopicId) => {
            if (topicId === '' && routeTopicId === '') {
                this.setState({
                    courses: [],
                });
            } else {
                topicAPI.task(taskCommands.GET_COURSES_BY_TOPIC_ID, {
                    topicId,
                }).then((courses) => {
                    if (courses) {
                        this.setState({
                            courses,
                        });
                    } else {
                        browserHistory.push(`/courses/${routeTopicId}`);
                        this.setState({
                            topicId: routeTopicId,
                        });
                        this.updateCoursesState(routeTopicId);
                    }
                });
            }
        });
    };

    editTopic = (e, topicId = undefined) => {
        if (e) {
            e.preventDefault();
        }
        const modal = {
            editingTopicId: null,
            saveButtonText: 'Add Topic',
            topic: {
                name: '',
                pointer: '',
            },
        };
        const modalContent = {
            modalTitle: 'New Topic',
        };
        if (topicId) {
            modal.topic = this.state.topics.filter(item => item.id === topicId)[0];
            modal.editingTopicId = modal.topic.id;
            modal.saveButtonText = 'Save Changes';
            modalContent.modalTitle = `Edit ${modal.topic.name}`;
        }
        modalContent.handleFormSubmit = this.topicFormSubmit;
        modalContent.bodyContent = (
            <TopicForm name={modal.topic.name} errors={this.state.modal.errors || {}} onChange={event => this.updateFormState(event, 'topic')} />
        );
        modalContent.footerContent = (
            <ButtonGroup>
                { modal.editingTopicId && <Button className="btn-topic-delete" type="button" onClick={() => this.deleteTopic(modal.topic.id)} outline color="danger">Delete Topic</Button> }
                <Button className="btn-topic-submit" type="submit" color="primary">{modal.saveButtonText}</Button>
            </ButtonGroup>
        );
        this.setState({
            modal: {
                ...this.state.modal,
                ...modal,
            },
            modalSettings: {
                ...this.state.modalSettings,
                modalContent: {
                    ...this.state.modalSettings.modalContent,
                    ...modalContent,
                },
            },
        }, this.toggleModal);
    };

    deleteTopic = (topicId) => {
        $('.btn-topic-delete').prop('disabled', true).addClass('loading').text('Processing...');
        const topicAPI = this.props.route.topicAPI;
        topicAPI.task(taskCommands.DELETE_TOPIC, {
            id: topicId,
        }).then((routeTopicId) => {
            this.setState({
                courses: [],
            }, () => {
                $('.btn-topic-delete').prop('disabled', false).removeClass('loading').text('Delete Topic');
                toastr.success('Topic Deleted!');
                browserHistory.push(`/courses/${routeTopicId}`);
                this.toggleModal();
            });
        });
    };

    toggleModal = () => {
        const triggerModal = !this.state.modalSettings.triggerModal;
        this.setState({
            modal: {
                ...this.state.modal,
                editingTopicId: triggerModal ? this.state.modal.editingTopicId : '',
                editingCourseId: triggerModal ? this.state.modal.editingCourseId : '',
                errors: triggerModal ? this.state.modal.errors : {},
            },
            modalSettings: {
                ...this.state.modalSettings,
                triggerModal,
            },
        });
    };

    updateFormState = (e, key) => {
        this.setState({
            modal: {
                ...this.state.modal,
                [key]: {
                    ...this.state.modal[key],
                    [e.target.name]: e.target.value,
                },
            },
            modalSettings: {
                ...this.state.modalSettings,
                modalContent: {
                    ...this.state.modalSettings.modalContent,
                    bodyContent: React.cloneElement(
                        this.state.modalSettings.modalContent.bodyContent, {
                            [e.target.name]: e.target.value,
                        },
                    ),
                },
            },
        });
    };

    topicFormSubmit = (e) => {
        e.preventDefault();
        $('.btn-topic-submit').prop('disabled', true).addClass('loading').text('Processing...');
        const topicAPI = this.props.route.topicAPI;
        topicAPI.task(taskCommands.SAVE_TOPIC, {
            topic: this.state.modal.topic,
        }).then(() => {
            $('.btn-topic-submit').prop('disabled', false).removeClass('loading').text(this.state.modal.saveButtonText);
            toastr.success('Topic Saved!');
            this.toggleModal();
        }, ({ msg }) => {
            toastr.error('Something happened! Topic could not be saved!');
            $('.btn-topic-submit').prop('disabled', false).removeClass('loading').text(this.state.modal.saveButtonText);
            const bodyContent = React.cloneElement(
                this.state.modalSettings.modalContent.bodyContent, {
                    errors: msg,
                },
            );
            this.setState({
                modal: {
                    ...this.state.modal,
                    errors: msg,
                },
                modalSettings: {
                    ...this.state.modalSettings,
                    modalContent: {
                        ...this.state.modalSettings.modalContent,
                        bodyContent,
                    },
                },
            });
        });
    };

    editCourse = (e, topicId, course = undefined) => {
        if (e) {
            e.preventDefault();
        }
        const modal = {
            editingCourseId: null,
            saveButtonText: 'Add Course',
            topicId,
            course: {
                title: '',
                description: '',
                img_src: '',
            },
        };
        const modalContent = {
            modalTitle: 'New Course',
        };
        if (course) {
            modal.course = course;
            modal.editingCourseId = modal.course.id;
            modal.saveButtonText = 'Save Changes';
            modalContent.modalTitle = `Edit ${modal.course.title}`;
        }
        modalContent.handleFormSubmit = this.courseFormSubmit;
        modalContent.bodyContent = (
            <CourseForm
                title={modal.course.title}
                description={modal.course.description}
                img_src={modal.course.img_src}
                onChange={event => this.updateFormState(event, 'course')}
                errors={this.state.modal.errors || {}}
            />
        );
        modalContent.footerContent = (
            <ButtonGroup>
                { modal.editingCourseId && <Button className="btn-course-delete" type="button" onClick={() => this.deleteCourse(this.state.modal.topicId, modal.editingCourseId)} outline color="danger">Delete Course</Button> }
                <Button className="btn-course-submit" type="submit" color="primary">{modal.saveButtonText}</Button>
            </ButtonGroup>
        );
        this.setState({
            modal: {
                ...this.state.modal,
                ...modal,
            },
            modalSettings: {
                ...this.state.modalSettings,
                modalContent: {
                    ...this.state.modalSettings.modalContent,
                    ...modalContent,
                },
            },
        }, this.toggleModal);
    };

    courseFormSubmit = (e) => {
        e.preventDefault();
        $('.btn-course-submit').prop('disabled', true).addClass('loading').text('Processing...');
        const topicAPI = this.props.route.topicAPI;
        topicAPI.task(taskCommands.SAVE_COURSE_BY_TOPIC_ID, {
            id: this.state.modal.topicId,
            course: this.state.modal.course,
        }).then(() => {
            $('.btn-course-submit').prop('disabled', false).removeClass('loading').text(this.state.modal.saveButtonText);
            toastr.success('Course Saved!');
            this.toggleModal();
        }, ({ msg }) => {
            $('.btn-course-submit').prop('disabled', false).removeClass('loading').text(this.state.modal.saveButtonText);
            toastr.error('Something happened! Course could not be saved!');
            const bodyContent = React.cloneElement(
                this.state.modalSettings.modalContent.bodyContent, {
                    errors: msg,
                },
            );
            this.setState({
                modal: {
                    ...this.state.modal,
                    errors: msg,
                },
                modalSettings: {
                    ...this.state.modalSettings,
                    modalContent: {
                        ...this.state.modalSettings.modalContent,
                        bodyContent,
                    },
                },
            });
        });
    };

    deleteCourse = (topicId, courseId) => {
        $('.btn-course-delete').prop('disabled', true).addClass('loading').text('Processing...');
        const topicAPI = this.props.route.topicAPI;
        topicAPI.task(taskCommands.DELETE_COURSE_BY_TOPIC_ID, {
            id: topicId,
            courseId,
        }).then((errMsg) => {
            if (!errMsg.error) {
                $('.btn-course-delete').prop('disabled', false).removeClass('loading').text('Delete Course');
                toastr.success('Course Deleted!');
                this.toggleModal();
            }
        });
    };

    render() {
        const { modalSettings } = this.state;
        return (
            <div className="main-content courses">
                <div className="course-header clearfix">
                    <h2>Courses</h2>
                    <ul className="course-nav">
                        {
                            this.state.topics.length > 0 && this.state.topics.map(topic => (
                                <li key={topic.id}>
                                    <NavLink to={`/courses/${topic.id}`}>{topic.name}</NavLink>
                                </li>
                            ))
                        }
                        <li className="add-topic"><a href="/" onClick={e => this.editTopic(e)}>+ Add Topic</a></li>
                    </ul>
                </div>
                <CoursePage
                    topicId={this.state.topicId || false}
                    courses={this.state.courses}
                    onEditCourse={this.editCourse}
                    onEditTopic={this.editTopic}
                    editingCourseId={this.state.modal.editingCourseId}
                />
                <ModalContainer
                    isOpen={modalSettings.triggerModal}
                    toggle={this.toggleModal}
                    handleFormSubmit={modalSettings.modalContent.handleFormSubmit}
                    title={modalSettings.modalContent.modalTitle}
                    bodyContent={modalSettings.modalContent.bodyContent}
                    footerContent={modalSettings.modalContent.footerContent}
                />
            </div>
        );
    }
}

export default CoursesPage;
