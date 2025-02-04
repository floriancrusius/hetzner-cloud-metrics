import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Router from './router/Router';
import Theme from './theme/theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
const root = createRoot(document.body);

root.render(
  <StrictMode>
    <Theme>
      <Router />
    </Theme>
  </StrictMode>
);
