import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FullServicePage from './pages/FullServicePage';
import RepairPage from './pages/RepairPage';
import CleaningPage from './pages/CleaningPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { AdminAuthProvider } from './hooks/useAdminAuth';

// Root route with Layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Child routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const fullServiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/full-service',
  component: FullServicePage,
});

const repairRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/repair',
  component: RepairPage,
});

const cleaningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cleaning',
  component: CleaningPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmation',
  component: BookingConfirmationPage,
  validateSearch: (search: Record<string, unknown>) => ({
    bookingId: (search.bookingId as string) || '',
    name: (search.name as string) || '',
    service: (search.service as string) || '',
    slot: (search.slot as string) || '',
  }),
});

const adminBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/bookings',
  component: () => (
    <ProtectedAdminRoute>
      <AdminBookingsPage />
    </ProtectedAdminRoute>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ProtectedAdminRoute>
      <AdminBookingsPage />
    </ProtectedAdminRoute>
  ),
});

// Route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  fullServiceRoute,
  repairRoute,
  cleaningRoute,
  confirmationRoute,
  adminBookingsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AdminAuthProvider>
      <RouterProvider router={router} />
    </AdminAuthProvider>
  );
}
