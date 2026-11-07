import HeaderClase from './components/HeaderClase';
import ObjetivosCard from './components/ObjetivosCard';
import ListaActividades from './components/ListaActividades';

function App() {
    return (
        <div style={{
            maxWidth: '600px',
            margin: '20px auto',
            padding: '20px',
            fontFamily: 'Segoe UI'
        }}>
            <HeaderClase
                tituloTema="Partes de la computadora"
                nombreDocente="Diego Enrique Pacay García"
                horario="Duración: 40 minutos"
            />

            <ObjetivosCard
                competencia="Reconoce las partes principales de una computadora y su utilidad."
                indicadorLogro="Identifica los componentes básicos y explica para qué sirven."
            />

            <ListaActividades />
        </div>
    );
}

export default App;