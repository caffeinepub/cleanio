import { useAdminAuth } from "../hooks/useAdminAuth";
import AdminLoginForm from "./AdminLoginForm";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({
  children,
}: ProtectedAdminRouteProps) {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return <>{children}</>;
}
