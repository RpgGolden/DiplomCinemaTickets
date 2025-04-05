import React from 'react';
import PropTypes from 'prop-types';
import styles from './Layout.module.scss'; // Импортируем стили

const Layout = ({ children }) => {
  return <div className={styles.layout__container}>{children}</div>;
};

Layout.propTypes = {
  children: PropTypes.node.isRequired, // 'children' должен быть передан
};

export default Layout;
