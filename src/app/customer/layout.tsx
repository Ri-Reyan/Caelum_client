import React from "react";

type ChildType = {
  children: React.ReactNode;
};

const CustomerLayout = ({ children }: ChildType) => {
  return <div>{children}</div>;
};

export default CustomerLayout;
