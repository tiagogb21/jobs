import React from 'react';
import PropTypes from 'prop-types';

import 'fomantic-ui-css/semantic.min.css';

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
};

App.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.object,
}.isRequired;

export default App;
