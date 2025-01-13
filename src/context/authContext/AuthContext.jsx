/* eslint-disable react/prop-types */
import React from 'react'
import { getToken } from '../../services/api'

export const AuthContext = React.createContext()

const AuthContextProvider = ({ children }) => {
    const [auth, setAuth] = React.useState({
        profile: null,
        isLogin: getToken() ? true : false,
    })
    const resetAuth = () => setAuth({ profile: null, isLogin: false })
    const value = {
        auth,
        setAuth,
        resetAuth,
    }
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export default AuthContextProvider