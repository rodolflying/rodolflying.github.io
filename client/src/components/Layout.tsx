import { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Rodolfo Sepúlveda`;
    } else {
      document.title = 'Rodolfo Sepúlveda | Data Engineer & Developer';
    }
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <motion.main
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
