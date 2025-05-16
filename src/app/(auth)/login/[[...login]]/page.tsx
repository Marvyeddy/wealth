import { SignIn } from "@clerk/nextjs";
import React from "react";

const LoginPage = () => {
  return (
    <section className="flex items-center h-screen bg-gray-200">
      <div className="mx-auto">
        <SignIn />
      </div>
    </section>
  );
};

export default LoginPage;
