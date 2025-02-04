import { FC } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/Main/Main';
import routes from './routes';

const Router: FC = () => (
  <HashRouter>
    <MainLayout routes={routes}>
      <Routes>
        {routes.map(({ path, element: Element }) => (
          <Route key={path} path={path} element={<Element />} />
        ))}
      </Routes>
    </MainLayout>
  </HashRouter>
);

export default Router;
