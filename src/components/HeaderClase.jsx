function HeaderClase({ tituloTema, nombreDocente, horario }) {
    return (
        <header style={{ background: '#0f4c81', color: 'white', padding: '15px', borderRadius: '8px' }}>
            <h1 style={{ color: 'white', fontSize: '24px' }}>
                {tituloTema}
            </h1>
            <p>Docente: {nombreDocente}</p>
            <p>Horario: {horario}</p>
        </header>
    );
}

export default HeaderClase;