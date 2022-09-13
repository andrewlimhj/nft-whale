import React from 'react';
import './App.css';
import Collection from './pages/Collection';
import Address from './pages/Address';
import Home from './pages/Home';
import ConnectWallet from './pages/ConnectWallet';

import {
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  // BrowserRouter as Router,
} from 'react-router-dom';

import { useAuth } from './hooks/use-auth';

// const Home = React.lazy(() => import('./pages/Home'));
// const Collection = React.lazy(() => import('./pages/Collection'));
// const Address = React.lazy(() => import('./pages/Address'));
// const ConnectWallet = React.lazy(() => import('./pages/ConnectWallet'));

const routes = [
  {
    path: '/sign-in',
    element: <ConnectWallet />,
  },
  // {
  //   path: '/',
  //   element: <Home />,
  // },
  // {
  //   path: '/:collection',
  //   element: <Collection />,
  // },
  // {
  //   path: '/:collection/:address',
  //   element: <Address />,
  // },
];

const authenticatedRoutes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/:collection',
    element: <Collection />,
  },
  {
    path: '/:collection/:address',
    element: <Address />,
  },
];

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated: ', isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/sign-in' state={{ from: location }} replace />;
  }

  return children;
}

const App = () => {
  return (
    <>
      <div className='topBanner'>
        <div>NFT Whales</div>
        <div className='menu'>
          <Link to='/'>
            <div className='menuItem'>Home</div>
          </Link>
          {/* <div>Submit NFT</div> */}
        </div>
      </div>
      <React.Suspense fallback={null}>
        <Routes>
          {routes.map((route, i) => (
            <Route key={i} path={route.path} exact element={route.element} />
          ))}

          {authenticatedRoutes.map((route, i) => (
            <Route
              key={i}
              path={route.path}
              exact
              element={<RequireAuth>{route.element}</RequireAuth>}
            />
          ))}
        </Routes>
      </React.Suspense>
    </>
  );
};

export default App;
