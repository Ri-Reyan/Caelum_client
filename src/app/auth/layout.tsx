import React from "react";

type AuthType = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthType) => {
  return <div>{children}</div>;
};

export default AuthLayout;
