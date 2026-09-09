import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import ExploreIndia from '@/pages/ExploreIndia';
import Experience from '@/pages/Experience';
import CharacterStudio from '@/pages/CharacterStudio';
import CreateKatha from '@/pages/CreateKatha';
import MyRoots from '@/pages/MyRoots';
import Community from '@/pages/Community';
import Profile from '@/pages/Profile';

const AuthenticatedApp = () => {
  const { isLoadingPublicSettings } = useAuth();

  // Show loading spinner while checking app public settings
  if (isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExploreIndia />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/characters" element={<CharacterStudio />} />
        <Route path="/create" element={<CreateKatha />} />
        <Route path="/roots" element={<MyRoots />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App