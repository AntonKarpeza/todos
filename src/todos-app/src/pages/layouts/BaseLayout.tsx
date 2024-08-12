import React from "react";
import Header from "../../components/layouts/Header";
import Footer from "../../components/layouts/Footer";

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default BaseLayout;
