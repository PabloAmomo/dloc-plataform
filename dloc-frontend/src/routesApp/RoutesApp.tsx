import { Routes, Route } from 'react-router-dom';
import Home from 'pages/Home/Home';
import Layout from 'templates/Layout';
import Page404 from 'pages/Page404/Page404';

function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
}

export default RoutesApp;
