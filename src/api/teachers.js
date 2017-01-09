/**
 * Created by Wayuki on 07-Jan-17 0007.
 */
import delay from './delay';
import taskCommands from './taskCommands';

const TeacherList = [
    {
        name: 'Angie McAngular',
        bio: 'Angie is a web developer and teacher who is passionate about building scalable, data driven web apps, especially ones that address old problems with new tech!',
        img_src: 'http://treehouse-code-samples.s3.amazonaws.com/bootstrap-4/img/angie.png',
        id: 'angie-mcangular',
    },
    {
        name: 'NodeStradamus',
        bio: "'NodeStra' is a software engineer and philosopher trying to leave the world better than he found it. He codes for non-profits, eCommerce, and large-scale web apps.",
        img_src: 'http://treehouse-code-samples.s3.amazonaws.com/bootstrap-4/img/nodestradamus.png',
        id: 'nodestradamus',
    },
    {
        name: "Geo 'Lo' Cation",
        bio: "Geo is a JavaScript developer working on large-scale applications. He's also a teacher who strives to support students in removing all barriers to learning code.",
        img_src: 'http://treehouse-code-samples.s3.amazonaws.com/bootstrap-4/img/geo.png',
        id: 'geo-lo-cation',
    },
    {
        name: 'Ecma Scriptnstuff',
        bio: 'Ecma found her passion for computers and programming over 15 years ago. She is excited to introduce people to the wonderful world of JavaScript.',
        img_src: 'http://treehouse-code-samples.s3.amazonaws.com/bootstrap-4/img/ecma.png',
        id: 'ecmo-scriptnstuff',
    },
    {
        name: 'Jay Query',
        bio: 'Jay is a developer, author of CSS: The Missing Manual, JavaScript & jQuery: The Missing Manual, and web development teacher.',
        img_src: 'http://treehouse-code-samples.s3.amazonaws.com/bootstrap-4/img/jay.png',
        id: 'jay-query',
    },
    {
        name: 'Json Babel',
        bio: 'All of his professional life, Json has worked with computers online; he is a polyglot programmer and likes using the right tools for the job.',
        img_src: 'http://treehouse-code-samples.s3.amazonaws.com/bootstrap-4/img/json.png',
        id: 'json-babel',
    },
];

const generateId = teacher => (
    teacher.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '-')
);

const getAllTeachers = () => TeacherList;

const saveTeacher = (teacher) => {
    const errMsg = {
        error: false,
        msg: '',
    };

    // VALIDATION - START

    const { name, bio, img_src } = teacher;

    if (name.trim().length < 1) {
        errMsg.error = true;
        errMsg.msg = {
            ...errMsg.msg,
            name: 'No content detected!',
        };
    }
    if (bio.trim().length < 1) {
        errMsg.error = true;
        errMsg.msg = {
            ...errMsg.msg,
            bio: 'No content detected!',
        };
    }
    if (img_src.trim().length < 1) {
        errMsg.error = true;
        errMsg.msg = {
            ...errMsg.msg,
            img_src: 'No content detected!',
        };
    }

    // VALIDATION - END

    if (!errMsg.error) {
        if (teacher.id) {
            const exitingTeacherIndex = TeacherList.findIndex(a => a.id === teacher.id);
            TeacherList.splice(exitingTeacherIndex, 1, teacher);
        } else {
            const newTeacher = { ...teacher };
            newTeacher.id = generateId(newTeacher);
            TeacherList.push(newTeacher);
        }
    }
    return errMsg;
};

const deleteTeacher = (teacherId) => {
    const errMsg = {
        error: false,
        msg: '',
    };
    const indexOfTeacherToDelete = TeacherList.findIndex(teacher => teacher.id === teacherId);
    TeacherList.splice(indexOfTeacherToDelete, 1);
    errMsg.msg = 'pass';
    return errMsg;
};

class TeacherAPI {

    static task = (taskName, params = {}) => (
        new Promise((resolve, reject) => {
            setTimeout(() => {
                switch (taskName) {
                    case taskCommands.GET_ALL_TEACHERS: {
                        const teachers = getAllTeachers();
                        resolve(teachers);
                        break;
                    }
                    case taskCommands.SAVE_TEACHER: {
                        const { teacher } = params;
                        const errMsg = saveTeacher(teacher);
                        if (!errMsg.error) {
                            resolve();
                        } else {
                            reject(errMsg);
                        }
                        break;
                    }
                    case taskCommands.DELETE_TEACHER: {
                        const { teacherId } = params;
                        const errMsg = deleteTeacher(teacherId);
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
        })
    );
}

export default TeacherAPI;
