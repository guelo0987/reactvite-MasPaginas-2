import React, { useState } from 'react';
import Calendar from 'react-calendar';
import '../Estilos/EstPaginas/Calendario.css';

import Sidebar from '../Componentes/SibarProfesor.jsx';
import Header from '../Componentes/Header.jsx';

export function CalendarioAcademico() {
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
