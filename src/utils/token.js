export function getToken(name) {
    return localStorage.getItem(name)
}

export function setToken(name, token) {
    return localStorage.setItem(name, token);
}

export function removeToken(name) {
    return localStorage.removeItem(name);
}

