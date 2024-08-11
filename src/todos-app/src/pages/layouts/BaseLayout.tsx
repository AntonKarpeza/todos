import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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