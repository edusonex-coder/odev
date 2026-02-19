/** OdevGPT Main Application */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import AskQuestion from "./pages/AskQuestion";
import ChatScreen from "./pages/ChatScreen";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import TeacherPanel from "./pages/TeacherPanel";
import QuestionDetail from "./pages/QuestionDetail";
import Premium from "./pages/Premium";
import AdminPanel from "./pages/AdminPanel";
import ClassDetail from "./pages/ClassDetail";
import AssignmentDetail from "./pages/AssignmentDetail";
import Leaderboard from "./pages/Leaderboard";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import ParentPanel from "./pages/ParentPanel";
import Referral from "./pages/Referral";
import ExecutiveDashboard from "./components/ExecutiveDashboard";


import { TenantProvider } from "./contexts/TenantContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TenantProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="ask" element={<AskQuestion />} />
                <Route path="chat" element={<ChatScreen />} />
                <Route path="history" element={<History />} />
                <Route path="question/:id" element={<QuestionDetail />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} /> {/* Settings Route */}
                <Route path="referral" element={<Referral />} />
                <Route path="premium" element={<Premium />} />
                <Route path="upgrade" element={<Premium />} />
                <Route
                  path="admin"
                  element={
                    <ProtectedRoute requireRole="admin">
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                /> {/* Admin Panel Rotası */}
                <Route path="class/:id" element={<ClassDetail />} /> {/* Student Class Detail */}
                <Route path="assignment/:id" element={<AssignmentDetail />} /> {/* Assignment Detail */}
                <Route path="leaderboard" element={<Leaderboard />} /> {/* Global Leaderboard */}
                <Route
                  path="parent"
                  element={
                    <ProtectedRoute requireRole="parent">
                      <ParentPanel />
                    </ProtectedRoute>
                  }
                /> {/* Parent Panel */}
              </Route>

              <Route
                path="/teacher"
                element={
                  <ProtectedRoute requireRole="teacher">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<TeacherPanel />} />
                <Route path="class/:id" element={<ClassDetail />} /> {/* Teacher Class Detail */}
                <Route path="assignment/:id" element={<AssignmentDetail />} /> {/* Teacher Assignment Detail */}
              </Route>

              <Route
                path="/parent"
                element={
                  <ProtectedRoute requireRole="parent">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ParentPanel />} />
              </Route>

              <Route
                path="/executive"
                element={
                  <ProtectedRoute requireRole="admin">
                    <ExecutiveDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />

            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TenantProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
