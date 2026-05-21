
import "./index.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Generic Stuff
import Navbar from "./Components/Generic/Navbar";
import Footer from "./Components/Generic/Footer";

// Tech
import TechTimeline from "./Components/Tech/TechTimeline";

// Legal Stuff
import Datenschutz from "./Components/Legal/Datenschutz";
import Privacy from "./Components/Legal/Privacy"

// Real Work
import ReverseImageSearch from "./Components/Search/ReverseImageSearch";

export function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      
      <main className="grow flex items-center justify-center max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<ReverseImageSearch />} />
          <Route path="/technology" element={<TechTimeline />} />
          <Route path="/datenschutz" element={<Datenschutz/>} />
          <Route path="/privacy" element={<Privacy/>} />
        </Routes>
      </BrowserRouter>
      </main>
      <Footer />
    </div>
  );
}

export default App;
