// Defining Dataset
export function dataSet(data) {
    data.app_name = process.env.app_name;
    return data;
}

export function returnBool(data){
    return data == 'true'
}