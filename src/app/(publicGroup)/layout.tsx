import React from "react";
import Navbar from "./_components/Navbar";

type ChildrenType = {
  children: React.ReactNode;
};

const layout = ({ children }: ChildrenType) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
