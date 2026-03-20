import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AskModalProvider } from "@/components/modals/AskQuestionModal";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import AllQuestionsPage from "@/pages/AllQuestionsPage";
import PopularPage from "@/pages/PopularPage";
import SavedPage from "@/pages/SavedPage";
import TagsPage from "@/pages/TagsPage";
import TopicPage from "@/pages/TopicPage";
import QuestionDetailPage from "@/pages/QuestionDetailPage";
import DashboardPage from "@/pages/DashboardPage";
import UsersPage from "@/pages/UsersPage";
import AdminNotificationsPage from "@/pages/AdminNotificationsPage";
import AIAssistPage from "@/pages/AIAssistPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <AskModalProvider>
          <TooltipProvider>
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/all" element={<AllQuestionsPage />} />
                  <Route path="/popular" element={<PopularPage />} />
                  <Route path="/saved" element={<SavedPage />} />
                  <Route path="/tags" element={<TagsPage />} />
                  <Route path="/topic/:topicId" element={<TopicPage />} />
                  <Route path="/question/:id" element={<QuestionDetailPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/admin-notifications" element={<AdminNotificationsPage />} />
                  <Route path="/ai" element={<AIAssistPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AskModalProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
