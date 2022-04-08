export const sendPushNotification = async (expoPushToken_arr, message) => {

    let step = _orderByHundred(expoPushToken_arr);

    step.forEach(async (arr) => {
        const data = {
            to: arr,
            sound: 'default',
            title: message.title,
            body: message.body,
            data: message.data,
        };
      
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    })
}

const _orderByHundred = (array) => {
    const chunkSize = 100;
    let new_arr = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        new_arr.push(chunk);
    }
    return new_arr;
}