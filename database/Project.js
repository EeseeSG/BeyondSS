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
                return { ...data, _id }
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

export const updateReservation = async (data) => {
    try {
        await firebase.firestore()
            .collection('reservations')
            .doc(data.project_id+'-'+data.user_id)
            .set(data)
        return {
            success: true,
        }
    } catch(error) {
        return {
            success: false,
            error,
        }
    }
}