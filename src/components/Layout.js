import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@chakra-ui/core';
import Navbar from './NavBar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <Box maxWidth="1200px" p={[4, 8, 10, 16]} mx="auto" my={0}>
      {children}
      <Footer />
    </Box>
  </>
);

export default Layout;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
