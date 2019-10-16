import ajaxRequest from "./axiosConfig";

let redirectUrl = "";

const AUTH_USER = {
    Login: param => ajaxRequest("post", redirectUrl + "/authCheck", 0, param, false),
    Logout: param => ajaxRequest("post", redirectUrl + "/logOffToken", 0, param),
};


export { AUTH_USER };
