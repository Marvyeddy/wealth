import Header from "@/components/Header";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <main className="min-h-screen container mx-auto mt-32">{children}</main>
      <footer className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="font-medium">Made with love by jsx_eddy ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
