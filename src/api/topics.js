/**
 * Created by Wayuki on 07-Jan-17 0007.
 */
import CourseAPI from './courses';
import taskCommands from './taskCommands';
import delay from './delay';

const TopicList = [
    {
        id: 'html',
        name: 'HTML',
        pointer: 'HTML',
    },
    {
        id: 'css',
        name: 'CSS',
        pointer: 'CSS',
    },
    {
        id: 'javascript',
        name: 'JavaScript',
        pointer: 'JAVASCRIPT',
    },
];

const generateId = topic => (
    topic.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '-')
);

const generatePointer = topic => (
    topic.name
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]+/g, '_')
);

class TopicAPI {
    static getDefaultTopic(index = -1) {
        let topicId = '';
        if (TopicList.length > 0) {
            if (index < 0 || TopicList.length <= index) {
                topicId = TopicList[0].id;
            } else {
                topicId = TopicList[index].id;
            }
        }
        return topicId;
    }

    static getAllTopics() {
        return TopicList;
    }

    static saveTopic(topic) {
        const errMsg = {
            error: false,
            msg: {},
        };

        // VALIDATION - START

        const { name } = topic;

        if (name.trim().length < 1) {
            errMsg.error = true;
            errMsg.msg = {
                ...errMsg.msg,
                name: 'No content detected!',
            };
        }

        // VALIDATION - END

        if (!errMsg.error) {
            if (topic.id) {
                const exitingTopicIndex = TopicList.findIndex(a => a.id === topic.id);
                TopicList.splice(exitingTopicIndex, 1, topic);
            } else {
                const newTopic = { ...topic };
                newTopic.id = generateId(topic);
                newTopic.pointer = generatePointer(topic);
                TopicList.push(newTopic);
                CourseAPI.addNewTopic(newTopic.pointer);
            }
        }
        return errMsg;
    }

    static getTopicPointer(id) {
        const topicIndex = TopicList.findIndex(a => a.id === id);
        if (topicIndex < 0) {
            return false;
        }
        return TopicList[topicIndex].pointer;
    }

    static getTopicName(id) {
        const topicIndex = TopicList.findIndex(a => a.id === id);
        if (topicIndex < 0) {
            return false;
        }
        return TopicList[topicIndex].name;
    }

    static getCoursesByTopicId(id) {
        const pointer = this.getTopicPointer(id);
        return CourseAPI.getAllCourses(pointer);
    }

    static saveCourseByTopicId(id, course) {
        const pointer = this.getTopicPointer(id);
        return CourseAPI.saveCourse(pointer, course);
    }

    static deleteTopic(id) {
        const pointer = this.getTopicPointer(id);
        const indexOfTopicToDelete = TopicList.findIndex(topic => topic.id === id);
        TopicList.splice(indexOfTopicToDelete, 1);
        CourseAPI.deletePointer(pointer);
        return this.getDefaultTopic(indexOfTopicToDelete);
    }

    static deleteCourseByTopicId(id, courseId) {
        const pointer = this.getTopicPointer(id);
        return CourseAPI.deleteCourse(pointer, courseId);
    }

    static task(taskName, params = []) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                switch (taskName) {
                    case taskCommands.GET_ALL_TOPICS: {
                        const topics = this.getAllTopics();
                        resolve(topics);
                        break;
                    }
                    case taskCommands.GET_COURSES_BY_TOPIC_ID: {
                        const { topicId } = params;
                        const courses = this.getCoursesByTopicId(topicId);
                        resolve(courses);
                        break;
                    }
                    case taskCommands.GET_DEFAULT_TOPIC: {
                        const { index } = params;
                        const defaultTopicId = this.getDefaultTopic(index);
                        resolve(defaultTopicId);
                        break;
                    }
                    case taskCommands.DELETE_TOPIC: {
                        const { id } = params;
                        const defaultTopicId = this.deleteTopic(id);
                        resolve(defaultTopicId);
                        break;
                    }
                    case taskCommands.SAVE_TOPIC: {
                        const { topic } = params;
                        const errMsg = this.saveTopic(topic);
                        if (!errMsg.error) {
                            resolve();
                        } else {
                            reject(errMsg);
                        }
                        break;
                    }
                    case taskCommands.SAVE_COURSE_BY_TOPIC_ID: {
                        const { id, course } = params;
                        const errMsg = this.saveCourseByTopicId(id, course);
                        if (!errMsg.error) {
                            resolve();
                        } else {
                            reject(errMsg);
                        }
                        break;
                    }
                    case taskCommands.DELETE_COURSE_BY_TOPIC_ID: {
                        const { id, courseId } = params;
                        const errMsg = this.deleteCourseByTopicId(id, courseId);
                        if (!errMsg.error) {
                            resolve(errMsg);
                        }
                        break;
                    }
                    default: {
                        reject('No such command.');
                        break;
                    }
                }
            }, delay);
        });
    }
}

export default TopicAPI;
