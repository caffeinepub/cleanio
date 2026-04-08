import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { AdminAuthProvider } from "./hooks/useAdminAuth";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import CleaningPage from "./pages/CleaningPage";
import FullServicePage from "./pages/FullServicePage";
import HomePage from "./pages/HomePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import PremiumPlansPage from "./pages/PremiumPlansPage";
import RepairPage from "./pages/RepairPage";
import TrackBookingPage from "./pages/TrackBookingPage";

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
  path: "/",
  component: HomePage,
});

const fullServiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/full-service",
  component: FullServicePage,
});

const repairRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/repair",
  component: RepairPage,
});

const cleaningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cleaning",
  component: CleaningPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/confirmation",
  component: BookingConfirmationPage,
  validateSearch: (search: Record<string, unknown>) => ({
    bookingId: (search.bookingId as string) || "",
    name: (search.name as string) || "",
    service: (search.service as string) || "",
    slot: (search.slot as string) || "",
  }),
});

const trackBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track-booking",
  component: TrackBookingPage,
});

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-bookings",
  component: MyBookingsPage,
});

const premiumPlansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/premium-plans",
  component: PremiumPlansPage,
});

const adminBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/bookings",
  component: () => (
    <ProtectedAdminRoute>
      <AdminBookingsPage />
    </ProtectedAdminRoute>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
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
  trackBookingRoute,
  myBookingsRoute,
  premiumPlansRoute,
  adminBookingsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
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
