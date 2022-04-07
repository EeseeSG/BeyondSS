import firebase from 'firebase';
require('firebase/firestore');

export const getAllProjectData = async () => {
    return await firebase.firestore()
        .collection('projects')
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(project => {
                let _id = project.id;
                let data = project.data();
                return { _id, ...data }
            })
        })
}

export const getAllUpcomingProjectData = async () => {
    return await firebase.firestore()
        .collection('projects')
        .where('datetime', '>', new Date())
        .orderBy('datetime', 'asc')
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(project => {
                let _id = project.id;
                let data = project.data();
                return { _id, ...data }
            })
        })
}

export const getProjectByID = async (project_id) => {
    return await firebase.firestore()
        .collection('projects')
        .doc(project_id)
        .get()
        .then((project) => {
            let _id = project.id;
            let data = project.data();
            return { _id, ...data }
        })
}
