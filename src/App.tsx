
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import CreateDeck from "./pages/CreateDeck";
import CreateCard from "./pages/CreateCard";
import StudyDeck from "./pages/StudyDeck";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import EditDeck from "./pages/EditDeck";
import EditCard from "./pages/EditCard";
import CategoryManager from "./pages/CategoryManager";
import IntegratedDeckCreator from "./pages/IntegratedDeckCreator";
import ImportCSV from "./pages/ImportCSV";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateDeck />} />
          <Route path="/create/card" element={<CreateCard />} />
          <Route path="/create/integrated" element={<IntegratedDeckCreator />} />
          <Route path="/study/:id" element={<StudyDeck />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/edit/deck/:id" element={<EditDeck />} />
          <Route path="/edit/card/:deckId/:id" element={<EditCard />} />
          <Route path="/categories" element={<CategoryManager />} />
          <Route path="/import" element={<ImportCSV />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
