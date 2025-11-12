import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Landing } from './pages/Landing.jsx';
import { Auth } from './pages/Auth.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { queryClient } from './lib/queryClient.js';
import { ResumeDraftProvider } from './context/ResumeDraftContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ResumeDraftProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ResumeDraftProvider>
    </QueryClientProvider>
  );
}
