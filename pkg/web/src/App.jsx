import { useState, useEffect } from "react";
import { Container } from "@mui/material";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Repos } from "./components/Repos";
import { HowItWorks } from "./components/HowItWorks";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { FossPage } from "./pages/FossPage";

function App() {
  const [page, setPage] = useState(() =>
    window.location.hash === "#foss" ? "foss" : "home",
  );

  useEffect(() => {
    function onHashChange() {
      setPage(window.location.hash === "#foss" ? "foss" : "home");
      window.scrollTo(0, 0);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (page === "foss") return <FossPage />;

  return (
    <>
      <Nav />
      <Container sx={{ px: { xs: 2, md: 3 } }}>
        <Hero />
        <Repos />
        <HowItWorks />
        <Contact />
      </Container>
      <Footer />
    </>
  );
}

export default App;
