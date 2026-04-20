import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import SiteLayout from "./components/site/SiteLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import HazardousWaste from "./pages/HazardousWaste";
import NablLab from "./pages/NablLab";
import Products from "./pages/Products";
import Industries from "./pages/Industries";
import Certifications from "./pages/Certifications";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import VendorOnboarding from "./pages/VendorOnboarding";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

function withLayout(Component) {
    return (
        <SiteLayout>
            <Component />
        </SiteLayout>
    );
}

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={withLayout(Home)} />
                    <Route path="/about" element={withLayout(About)} />
                    <Route path="/services" element={withLayout(Services)} />
                    <Route path="/services/hazardous-waste" element={withLayout(HazardousWaste)} />
                    <Route path="/services/nabl-lab" element={withLayout(NablLab)} />
                    <Route path="/products" element={withLayout(Products)} />
                    <Route path="/industries" element={withLayout(Industries)} />
                    <Route path="/certifications" element={withLayout(Certifications)} />
                    <Route path="/projects" element={withLayout(Projects)} />
                    <Route path="/contact" element={withLayout(Contact)} />
                    <Route path="/vendor-onboarding" element={withLayout(VendorOnboarding)} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="*" element={withLayout(NotFound)} />
                </Routes>
            </BrowserRouter>
            <Toaster richColors position="top-right" />
        </div>
    );
}

export default App;
