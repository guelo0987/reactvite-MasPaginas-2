import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from './App.jsx';
import { Login } from './Paginas/Login.jsx';
import { MenuPrincipal } from './Paginas/MenuPrincipalEstu.jsx';
import { Calendario } from './Paginas/Calendario.jsx';
import  {PensumCarrera}  from './Paginas/PensumCarrera.jsx';
import { HojaPago } from './Paginas/HojaPago.jsx';
import { CuentaPorPagar } from './Paginas/CuentaPorPagar.jsx';
import { Horario } from './Paginas/Horario.jsx';
import { AuthProvider } from './Componentes/AutenticacionUsuario.jsx';
import { ReporteCalificaciones } from './Paginas/ReporteCalificaciones.jsx';
import ProtectedRoute from './Componentes/RutaProtegida.jsx';
import { AdminDashboard } from './Paginas/AdminDashboard.jsx';
import { EstudianteAgregarMaterias } from './Paginas/EstudianteAgregarMaterias.jsx';
import { EstudianteRetirarMaterias } from './Paginas/EstudianteRetirarMaterias.jsx';
import { ListadoUsuarios } from './Paginas/ListadoUsuarios.jsx';
import { AnadirEstudiante } from './Paginas/AnadirEstudiante.jsx';
import { AnadirProfesor } from './Paginas/AnadirProfesor.jsx';
import { Materias } from './Paginas/Materias.jsx';
import { Aulas } from './Paginas/Aulas.jsx';
import { Secciones } from './Paginas/Secciones.jsx';
import { ProfesorDashboard } from './Paginas/ProfesorDashboard.jsx';
import { CalendarioAcademico } from './Paginas/CalendarioAcademico.jsx';
import { PublicarNota } from './Paginas/PublicarCalificacion.jsx';
import { PensumCarreraViewer} from "./Paginas/PensumCarreraViewer.jsx"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/Menu',
    element: (
      <ProtectedRoute>
        <MenuPrincipal />
      </ProtectedRoute>
    ),
  },
  {
    path: '/Calendario',
    element: (
      <ProtectedRoute>
        <Calendario />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pensum-carrera',
    element: (
      <ProtectedRoute>
        <PensumCarreraViewer />
      </ProtectedRoute>
    ),
  },
  {
    path: '/cuenta-por-pagar',
    element: (
      <ProtectedRoute>
        <CuentaPorPagar />
      </ProtectedRoute>
    ),
  },
  {
    path: '/HojaPago',
    element: (
      <ProtectedRoute>
        <HojaPago />
      </ProtectedRoute>
    ),
  },
  {
    path: '/horario',
    element: (
      <ProtectedRoute>
        <Horario />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ReporteCalificaciones",
    element: (
      <ProtectedRoute>
        <ReporteCalificaciones />
      </ProtectedRoute>
    ),
  },
  {
    path: "/AdminDashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path:"/agregar-materias",
    element:(
      <ProtectedRoute>
        <EstudianteAgregarMaterias/>
      </ProtectedRoute>
    )
  },
  {
    path:"/retirar-materias",
    element:(
      <ProtectedRoute>
        <EstudianteRetirarMaterias/>
      </ProtectedRoute>
    )
  },
  {
    path:"/ListadoUsuarios",
    element:(<ProtectedRoute>
      <ListadoUsuarios/>
    </ProtectedRoute>)
  },
  {
    path:"/AñadirEstudiante",
    element:(
      <ProtectedRoute>
        <AnadirEstudiante/>
      </ProtectedRoute>
    )
  },
  {
    path:"/AñadirProfesor",
    element:(
      <ProtectedRoute>
        <AnadirProfesor/>
      </ProtectedRoute>
    )
  },
  {
    path:"/materias",
    element:(<ProtectedRoute>
      <Materias/>
    </ProtectedRoute>)
  },
  {
    path:"/aulas",
    element:(<ProtectedRoute>
      <Aulas/>
    </ProtectedRoute>)
  },
  {
    path:"/secciones",
    element:(<ProtectedRoute>
      <Secciones/>
    </ProtectedRoute>)
  },
  {
    path:"/ProfesorDashboard",
    element:(<ProtectedRoute>
      <ProfesorDashboard/>
    </ProtectedRoute>)
  },
  {
    path:"/CalendarioAcademico",
    element:(<ProtectedRoute>
      <CalendarioAcademico/>
    </ProtectedRoute>)
  },
  {
    path:"/PublicarNota",
    element:(<ProtectedRoute>
      <PublicarNota/>
    </ProtectedRoute>)
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);