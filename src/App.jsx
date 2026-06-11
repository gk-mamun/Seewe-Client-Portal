import { AuthProvider } from './context/AuthContext.jsx';
import { SidebarProvider } from './context/SidebarContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppRoutes />
      </SidebarProvider>
    </AuthProvider>
  );
}
