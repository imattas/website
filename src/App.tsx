import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Work from "./components/Work";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Marquee from "./components/Marquee";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import Writeups from "./pages/Writeups";
import WriteupPost from "./pages/WriteupPost";

const marqueeItems = [
  "Reverse Engineering",
  "Malware Analysis",
  "Binary Obfuscation",
  "Symbolic Execution",
  "Cryptography",
  "Low-Level Systems",
  "CTFs",
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Home() {
  return (
    <>
      <Hero />
      <Marquee items={marqueeItems} />
      <About />
      <Work />
      <Skills />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <ScrollToTop />
      <Navbar />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writeups" element={<Writeups />} />
          <Route path="/writeups/:slug" element={<WriteupPost />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
