import React from "react";
import { AuthContext } from "./AuthContext";

export const useAuthContext = () => React.useContext(AuthContext)