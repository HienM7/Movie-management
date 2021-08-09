import React from "react";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

export const AuthContext = React.createContext();

export const AuthProvider = (props) => {
  const [authInfo, setAuthInfo] = useState({
    isLogin: false,
    isLoading: true,
  });

  useEffect(() => {
    const check = async () => {
      if (localStorage.getItem("token")) {
        const payload = jwt_decode(localStorage.getItem("token"));
        axios.defaults.headers.common["authorization"] =
          "Bearer " + localStorage.getItem("token");
        try {
          await axios.get("https://fbk-api-gateway.herokuapp.com/room");
        } catch (e) {
          setAuthInfo({
            isLoading: false,
          });
          return;
        }

        if (
          payload.roles.indexOf("ROLE_EMPLOYEE") !== -1 ||
          payload.roles.indexOf("ROLE_ADMIN") !== -1
        ) {
          setAuthInfo({
            ...authInfo,
            ...payload,
            isLogin: true,
            isLoading: false,
          });
        } else {
          localStorage.removeItem("token");
          setAuthInfo({
            isLoading: false,
          });
        }
      } else {
        setAuthInfo({
          isLoading: false,
        });
      }
    };
    check();
  }, []);

  if (authInfo.isLoading === true) {
    return (
      <CircularProgress
        style={{ position: "fixed", top: "50%", left: "50%" }}
      />
    );
  }

  return (
    <AuthContext.Provider value={{ authInfo, setAuthInfo }}>
      {props.children}
    </AuthContext.Provider>
  );
};
