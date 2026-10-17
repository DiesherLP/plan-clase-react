import { useState } from 'react';

function ActividadItem({ titulo, tiempo, tipo }) {
    const [completada, setCompletada] = useState(false);

    return (
        <div style={{
            border: '1px solid #cbd5e1',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '10px',
            color: '#0f172a',
            background: completada ? '#dcfce7' : '#f8fafc'
        }}>
            <span>{tipo}</span>
            <h4>{titulo}</h4>
            <p>Duración: {tiempo}</p>
            <p>Estado: {completada ? 'Completada' : 'Pendiente'}</p>

            <button onClick={() => setCompletada(!completada)}>
                {completada ? 'Marcar como pendiente' : 'Marcar como completada'}
            </button>
        </div>
    );
}

export default ActividadItem;