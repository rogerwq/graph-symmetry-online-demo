import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const title = 'Online Demo - Molecular Symmetry Perception and Canonical SMILES';

ReactDOM.render(
  <App title={title} />,
  document.getElementById('app')
);

module.hot.accept();
