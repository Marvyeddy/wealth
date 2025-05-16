"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="pb-20 px">
      <div>
        <h1>
          Manage your finances <br /> with intelligence
        </h1>
        <p>
          {" "}
          An AI-powered financial management platform that helps you track,
          analyze and optimize your spending with real-time insights.
        </p>
        <div>
          <Link href={"/dashboard"}>
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>
        <div>
          <div>
            <Image
              src={"/banner.jpeg"}
              alt="banner"
              width={1280}
              height={720}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
