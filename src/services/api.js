import Cookies from "js-cookie"

export const getToken = () => {
    return Cookies.get('token')
}

export const setToken = (token) => {
    Cookies.set('token', token, { expires: 1 })
}

export const removeToken = () => {
    Cookies.remove('token')
}

export const setUid = (uid) => {
    Cookies.set('uid', uid, { expires: 1 })
}

export const getUid = () => {
    return Cookies.get('uid')
}

export const removeUid = () => {
    Cookies.remove('uid')
}