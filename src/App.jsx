import ForoClase from './components/ForoClase';
import ProgresoClase from './components/ProgresoClase';
import BarraProgreso from './components/BarraProgreso';
import HeaderClase from './components/HeaderClase';
import ObjetivosCard from './components/ObjetivosCard';
import ExploradorComputadora from './components/ExploradorComputadora';
import InteriorComputadora from './components/InteriorComputadora';
import PracticaComputadora from './components/PracticaComputadora';
import ListaActividades from './components/ListaActividades';
import './App.css';

function App() {
  return (
    <ProgresoClase>
    <div
      style={{
        maxWidth: '1120px',
        margin: '20px auto',
        padding: '20px',
      }}
    >
      <HeaderClase
        tituloTema="Partes de la computadora"
        nombreDocente="Diego Enrique Pacay García"
        horario="Duración: 40 minutos"
      />

      <BarraProgreso />

      <main>
        <ObjetivosCard
          competencia="Reconoce las partes principales de una computadora y su utilidad."
          indicadorLogro="Identifica componentes externos e internos y explica cómo participan en una tarea cotidiana."
        />

        <ExploradorComputadora />

        <InteriorComputadora />

        <PracticaComputadora />

        <ForoClase />

        <ListaActividades />
      </main>

      <footer
        style={{
          padding: '28px 0',
          marginTop: '24px',
          borderTop: '1px solid var(--borde)',
          color: 'var(--texto-secundario)',
          fontSize: '0.8rem',
        }}
      >
        Plan de Clase Digital · Primero básico
        <br />
        Diego Enrique Pacay García
      </footer>
    </div>
    </ProgresoClase>
  );
}

export default App;