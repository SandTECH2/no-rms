import React, { PropsWithChildren } from "react";

const Auth: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
      <div className="w-full max-w-4xl p-6">{children}</div>
    </div>
  );
};

export default Auth;
