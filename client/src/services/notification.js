import { toast } from "react-toastify";

const init = () => {
    toast.configure({
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true
    });
}

const info = message => {
    toast.info(message);
};
const success = message => {
    toast.success(message);
};
const warning = message => {
    toast.warning(message);
};
const error = message => {
    toast.error(message);
};
const requestError = result => {
    if(!result.response){
        return;
    }
    let message = result.response.data;
    if(result.response.headers["content-type"].indexOf('text/html') !== -1){
        message = `${result.response.status}: ${result.response.statusText}`;
    }
    error(message);
}

export default {
    init,
    info,
    success,
    warning,
    error,
    requestError
};