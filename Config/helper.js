// Defining Dataset
export function dataSet(data) {
    data.app_name = process.env.app_name;
    return data;
}

export function returnBool(data) {
    if (data == 'true') {
        return true;
    }else{
        return false;
    }
}

export function extractVideoID(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[7].length == 11) {
        return match[7];
    } else {
        return null
    }
}

export function random_number(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}