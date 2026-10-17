import HeaderClase from './components/HeaderClase';
import ObjetivosCard from './components/ObjetivosCard';
import ActividadItem from './components/ActividadItem';

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

            <ActividadItem
                titulo="Preguntas sobre las partes que conocemos"
                tiempo="5 minutos"
                tipo="Inicio"
            />
            <ActividadItem
                titulo="Identificación de componentes y sus funciones"
                tiempo="25 minutos"
                tipo="Desarrollo"
            />
            <ActividadItem
                titulo="Repaso de las partes de la computadora"
                tiempo="10 minutos"
                tipo="Cierre"
            />
        </div>
    );
}

export default App;