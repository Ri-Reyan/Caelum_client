import React from "react";

type ChildrenType = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: ChildrenType) => {
  return <div>{children}</div>;
};

export default AdminLayout;
