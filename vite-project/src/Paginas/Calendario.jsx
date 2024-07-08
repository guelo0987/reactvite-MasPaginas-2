import React, { useState } from 'react';
import Calendar from 'react-calendar';
import '../Estilos/EstPaginas/Calendario.css';

import Sidebar from '../Componentes/Sidebar2.jsx';
import Header from '../Componentes/Header.jsx';

export function Calendario() {
    const [value, onChange] = useState(new Date());

    return (
        <div>
            <Header/>
            <Sidebar/>
             <div className="calendar-container">
                 <h1>Calendario</h1>
                 <Calendar
                onChange={onChange}
                value={value}
                locale="es-ES"
            />
             </div>
            <div/>
        </div>
    );
}
