import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import toastr from 'toastr';
import Teacher from './teacher/Teacher.jsx';
import TeacherForm from './TeacherForm.jsx';
import ModalContainer from '../common/ModalContainer.jsx';
import taskCommands from '../../api/taskCommands';

class TeachersPage extends Component {
    static propTypes = {
        route: PropTypes.shape({
            teacherAPI: PropTypes.func.isRequired,
        }),
    };

    state = {
        editing: false,
        modal: {
            modalTitle: 'New Teacher',
            saveButtonText: 'Add Teacher',
            teacher: {
                name: '',
                bio: '',
                img_src: '',
            },
        },
        editingTeacherId: '',
        teachers: [],
    };

    componentDidMount() {
        this.props.route.teacherAPI
            .task(taskCommands.GET_ALL_TEACHERS)
            .then((teachers) => {
                this.setState({
                    teachers,
                });
            });
    }

    editTeacher = (teacherId) => {
        let teacher = {
            name: '',
            bio: '',
            img_src: '',
        };
        if (teacherId) {
            teacher = this.state.teachers.filter(item => (item.id === teacherId))[0];
            this.setState({
                modal: {
                    ...this.state.modal,
                    modalTitle: `Edit ${teacher.name}`,
                    saveButtonText: 'Save Changes',
                    teacher,
                },
                editingTeacherId: teacher.id,
            }, this.toggleModal);
        } else {
            this.setState({
                modal: {
                    ...this.state.modal,
                    modalTitle: 'New Teacher',
                    saveButtonText: 'Add Teacher',
                    teacher,
                },
            }, this.toggleModal);
        }
    };

    toggleModal = () => {
        const editing = !this.state.editing;
        this.setState({
            editing,
            editingTeacherId: editing ? this.state.editingTeacherId : '',
            modal: {
                ...this.state.modal,
                errors: editing ? this.state.modal.errors : {},
            },
        });
    };

    updateTeacherState = (e) => {
        this.setState({
            modal: {
                ...this.state.modal,
                teacher: {
                    ...this.state.modal.teacher,
                    [e.target.name]: e.target.value,
                },
            },
        });
    };

    teacherFormSubmit = (e) => {
        e.preventDefault();
        $('.btn-teacher-submit').prop('disabled', true).addClass('loading').text('Processing...');
        const teacherAPI = this.props.route.teacherAPI;
        teacherAPI.task(taskCommands.SAVE_TEACHER, {
            teacher: this.state.modal.teacher,
        }).then(() => {
            toastr.success('Teacher saved!');
            $('.btn-teacher-submit').prop('disabled', false).removeClass('loading').text(this.state.modal.saveButtonText);
            this.toggleModal();
        }, ({ msg }) => {
            toastr.error('Something happened! Teacher could not be saved!');
            $('.btn-teacher-submit').prop('disabled', false).removeClass('loading').text(this.state.modal.saveButtonText);
            this.setState({
                modal: {
                    ...this.state.modal,
                    errors: msg,
                },
            });
        });
    };

    deleteTeacher = (teacherId) => {
        $('.btn-teacher-delete').prop('disabled', true).addClass('loading').text('Processing...');
        const teacherAPI = this.props.route.teacherAPI;
        teacherAPI.task(taskCommands.DELETE_TEACHER, {
            teacherId,
        }).then((errMsg) => {
            if (!errMsg.error) {
                toastr.success('Teacher deleted!');
                $('.btn-teacher-delete').prop('disabled', false).removeClass('loading').text('Delete Teacher');
                this.toggleModal();
            }
        });
    };

    render() {
        const { modal } = this.state;
        return (
            <div className="main-content">
                <h2>Teachers</h2>
                <ul className="clearfix">
                    <ReactCSSTransitionGroup
                        transitionName="block"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={0}
                        transitionAppear
                        transitionAppearTimeout={500}
                    >
                        {
                            this.state.teachers.map(teacher => (
                                <Teacher
                                    key={teacher.id}
                                    id={teacher.id}
                                    name={teacher.name}
                                    bio={teacher.bio}
                                    img={teacher.img_src}
                                    editing={teacher.id === this.state.editingTeacherId}
                                    handleTeacherClick={() => this.editTeacher(teacher.id)}
                                />
                            ))
                        }
                    </ReactCSSTransitionGroup>
                </ul>
                <div className="btn-container text-right">
                    <Button outline color="primary" onClick={() => this.editTeacher(undefined)}>Add Teacher</Button>
                </div>
                <ModalContainer
                    isOpen={this.state.editing}
                    toggle={this.toggleModal}
                    handleFormSubmit={this.teacherFormSubmit}
                    title={modal.modalTitle}
                    bodyContent={(
                        <TeacherForm
                            name={modal.teacher.name}
                            bio={modal.teacher.bio}
                            img={modal.teacher.img_src}
                            onChange={this.updateTeacherState}
                            errors={this.state.modal.errors || {}}
                        />
                    )}
                    footerContent={(
                        <ButtonGroup>
                            { this.state.editingTeacherId && <Button className="btn-teacher-delete" type="button" outline color="danger" onClick={(e) => { this.deleteTeacher(this.state.editingTeacherId); }}>Delete Teacher</Button> }
                            <Button
                                className="btn-teacher-submit"
                                type="submit"
                                color="primary"
                            >
                                {modal.saveButtonText}
                            </Button>
                        </ButtonGroup>
                    )}
                />
            </div>
        );
    }
}

export default TeachersPage;
