import Image from "next/image";
import React from "react";

const Home = () => {
  return (
    <div className="bg-black">
      <Image src="/logo.png" alt="logo" width={100} height={100} />
      <h1 className="text-white">Hello world</h1>
    </div>
  );
};

export default Home;
