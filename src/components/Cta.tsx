import Link from "next/link";
import { Button } from "./ui/button";

const Cta = () => {
  return (
    <section className="py-14 bg-blue-600">
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="text-3xl font-bold text-center  mb-4 capitalize">
          Ready to take control of your finances?
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-8">
          Join thousands of users who are already managing their finances
          smarter with wealth
        </p>

        <Button
          className="bg-white text-blue-500 animate-bounce hover:bg-blue-50"
          asChild
        >
          <Link href={"/dashboard"}>Start Free Trial</Link>
        </Button>
      </div>
    </section>
  );
};

export default Cta;
