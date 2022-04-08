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
            return { ...data, _id }
        })
}

export const getProjectByRef = async (project_ref) => {
    return await firebase.firestore()
        .collection('projects')
        .where('ref', '==', project_ref)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(snap => {
                let _id = snap.id;
                let data = snap.data();
                return { ...data, _id }
            })
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

export const getReservationsByID = async (project_id) => {
    return await firebase.firestore()
        .collection('reservations')
        .where('project_id', '==', project_id)
        .get()
        .then((snapshot) => {
            let arr = snapshot.docs.map((snap) => {
                let _id = snap.id;
                let data = snap.data();
                return { ...data, _id }
            })
            return arr
        })
}

export const checkReservationAvailability = async (project_id, user_id, addition) => {
    let project_details = await getProjectByID(project_id);
    let total_available = project_details.count;
    let reservations_arr = await getReservationsByID(project_id);
    let filtered_reservation_arr = reservations_arr.filter((reservation) => reservation.user_id !== user_id);
    let total_count = filtered_reservation_arr.map((reservation) => reservation.reserved).reduce((a, b) => a + b, 0);
    let new_count = total_count + addition;

    if(total_available >= new_count) {
        return true
    } else {
        return false
    }
}

export const getUserUpcomingReservations = async (user_id) => {
    return await firebase.firestore()
        .collection('reservations')
        .where('user_id', '==', user_id)
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

export const getChefUpcomingReservations = async (chef_id) => {
    return await firebase.firestore()
        .collection('reservations')
        .where('user_id', '==', chef_id)
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

export const getUserPastReservations = async (user_id) => {
    return await firebase.firestore()
        .collection('reservations')
        .where('user_id', '==', user_id)
        .where('project.datetime', '<=', new Date())
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
    let project_arr = await getAllUpcomingProjectData();
    let reservations_arr = await getAllUpcomingReservations(); // map current availability
    let new_project_arr = await _parseDetailedProjectData(project_arr, reservations_arr)
    return new_project_arr;
}

export const _parseDetailedProjectData = async (project_arr, reservations_arr) => {
    let new_project_arr = await Promise.all(project_arr.map((project) => {
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
    }).sort((a, b) => a.datetime.seconds > b.datetime.seconds));
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

export const createProject = async (data) => {
    try {
        await firebase.firestore()
            .collection('projects')
            .add(data)
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

export const completeDelivery = async (reservation_id) => {
    try {
        await firebase.firestore()
            .collection('reservations')
            .doc(reservation_id)
            .update({
                delivered: true,
                deliveredDate: new Date(),
            })
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

export const acknowledgeDelivery = async (reservation_id) => {
    try {
        await firebase.firestore()
            .collection('reservations')
            .doc(reservation_id)
            .update({
                acknowledged: true,
                acknowledgedDate: new Date(),
            })
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