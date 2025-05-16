import { SignUp } from "@clerk/nextjs";
import React from "react";

const RegisterPage = () => {
  return (
    <section className="flex items-center h-screen bg-gray-200">
      <div className="mx-auto">
        <SignUp />
      </div>
    </section>
  );
};

export default RegisterPage;
