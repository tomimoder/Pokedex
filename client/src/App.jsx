import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomeBusqueda } from "./pages/Home-busqueda.jsx";
import { Pokemonvista } from "./pages/pokemon-vista.jsx";

function App(){
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<HomeBusqueda/>}/>
          <Route path = "/pokemon/:name" element = {<Pokemonvista/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;