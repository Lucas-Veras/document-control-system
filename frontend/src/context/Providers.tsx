import React from "react";
import { AuthProvider } from "./AuthProvider";
import { UserProvider } from "./UserProvider";

const Providers = ({ children }: { children: React.ReactNode[] }) => {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
};

export default Providers;
