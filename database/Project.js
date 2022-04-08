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
                return { ...data, _id }
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
            return snapshot.docs.map(snap => {
                let _id = snap.id;
                let data = snap.data();
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

export const getAllUpcomingReservations = async () => {
    return await firebase.firestore()
        .collection('reservations')
        .where('project.datetime', '>', new Date())
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(snap => {
                let _id = snap.id;
                let data = snap.data();
                return { ...data, _id }
            })
        })
}

export const getOutstandingProjects = async () => {
    let project_arr = await getAllProjectData();

    // map current availability
    let new_project_arr = await _parseDetailedProjectData(project_arr)
    return new_project_arr;
}

export const _parseDetailedProjectData = async (project_arr) => {
    let reservations_arr = await getAllUpcomingReservations();
    let new_project_arr = project_arr.map((project) => {
        let reserved = 0;
        let beneficiaries = [];
        let reservation_data = [];
        for(var i = 0; i < reservations_arr.length; i++) {
            if(project._id === reservations_arr[i].project_id) {
                reserved += reservations_arr[i].reserved;
                beneficiaries.push(reservations_arr[i].user_id);
                reservation_data.push({
                    user: reservations_arr[i].user,
                    reserved: reservations_arr[i].reserved,
                })
            }
        }
        return {
            ...project,
            reserved,
            beneficiaries,
            reservation_data
        }
    });
    return new_project_arr;
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

export const cancelReservation = async (reservation_id) => {
    try {
        await firebase.firestore()
            .collection('reservations')
            .doc(reservation_id)
            .delete()
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