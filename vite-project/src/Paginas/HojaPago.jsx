import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from "../Componentes/AutenticacionUsuario.jsx";
import Sidebar from '../Componentes/Sidebar2.jsx';
import Header from '../Componentes/Header.jsx';
import styles from '../Estilos/EstPaginas/HojaPago.module.css';
import logoImage from '../assets/LogoUniOscuro.png';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51OnXQeIOscMFPORGXu6Vhukwp3pGFKHtB856OdCi8rDWZ6S33sop4KTTefqejdct38Nv7ygP0xhsahkL7bi0L1SZ00Sxu9xIH8');

const CheckoutForm = ({ facturaId, montoTotal, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      onPaymentError(error);
    } else {
      try {
        const response = await axios.post('http://localhost:5124/api/Factura/procesarPago', {
          facturaId: facturaId,
          paymentMethodId: paymentMethod.id
        });
        
        if (response.data.success) {
          onPaymentSuccess(response.data.paymentIntentId);
        } else {
          onPaymentError(new Error('Error al procesar el pago'));
        }
      } catch (error) {
        onPaymentError(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pagar ${montoTotal.toFixed(2)}</button>
    </form>
  );
};

export function HojaPago() {
  const { user } = useAuth();
  const [year, setYear] = useState('2024');
  const [period, setPeriod] = useState('MAY-JUL');
  const [isGenerated, setIsGenerated] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [cuentasPorPagar, setCuentasPorPagar] = useState([]);
  const [montoTotal, setMontoTotal] = useState(0);
  const [message, setMessage] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [facturaId, setFacturaId] = useState(null);
  const [tieneDeuda, setTieneDeuda] = useState(true);

  const obtenerCuentasPorPagar = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const cuentasResponse = await axios.get(`http://localhost:5124/api/CuentaPorPagar/cuentaporpagar`, {
        ...config,
        params: {
          periodo: `${year}-${period}`,
          codigoEstudiante: user.id
        }
      });
      const cuentasData = cuentasResponse.data;
      setCuentasPorPagar(cuentasData);
      
      const total = cuentasData.reduce((sum, cuenta) => sum + cuenta.montoTotalaPagar, 0);
      setMontoTotal(total);

      setStudentData({
        trimestre: `${year}-${period}`,
        nombre: user.nombreEstudiante,
        carrera: user.nombreCarrera,
        tipoTarifa: 'Dominicano',
        conceptos: cuentasData.map(cuenta => ({
          concepto: cuenta.nombreMateria,
          aula: cuenta.aula,
          horarios: cuenta.horario,
          cr: cuenta.materias?.creditos || 'N/A',
          fecha: new Date().toLocaleDateString(),
          deudaCorriente: cuenta.montoTotalaPagar
        })),
        balanceActual: total,
        primerPago: total * 0.4,
        segundoPago: total * 0.3,
        tercerPago: total * 0.3,
        fechaPrimerPago: '05/may./2024',
        fechaSegundoPago: '26/may./2024',
        fechaTercerPago: '23/jun./2024'
      });

      setIsGenerated(true);
    } catch (error) {
      console.error('Error al obtener las cuentas por pagar:', error);
      setMessage('Error al obtener los datos de las cuentas por pagar');
    }
  };

  const verificarDeuda = async () => {
    try {
      const response = await axios.get(`http://localhost:5124/api/Factura/verificarDeuda`, {
        params: {
          codigoEstudiante: user.id,
          periodo: `${year}-${period}`
        }
      });
      
      setTieneDeuda(response.data.tieneDeuda);
      if (!response.data.tieneDeuda) {
        setMessage(response.data.mensaje);
      } else {
        setMontoTotal(response.data.montoTotal);
      }
    } catch (error) {
      console.error('Error al verificar deuda:', error);
      setMessage('Error al verificar el estado de la deuda');
    }
  };

  const handleGenerateInvoice = () => {
    verificarDeuda();
    if (tieneDeuda) {
      obtenerCuentasPorPagar();
    }
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post(`http://localhost:5124/api/Factura/generarFactura`, {
        periodo: `${year}-${period}`,
        codigoEstudiante: user.id
      });
      
      if (response.data.success) {
        setFacturaId(response.data.facturaId);
        setShowPaymentForm(true);
      } else {
        setMessage('Error al generar la factura');
      }
    } catch (error) {
      console.error('Error al generar la factura:', error);
      setMessage('Error al generar la factura');
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    setMessage('Pago realizado con éxito');
    setShowPaymentForm(false);
    verificarDeuda(); // Actualizar el estado de la deuda después del pago
  };

  const handlePaymentError = (error) => {
    console.error('Error en el pago:', error);
    setMessage('Error al procesar el pago');
  };

  const handleDownloadPDF = () => {
    if (!studentData) return;

    const doc = new jsPDF();
    let yPos = 20;

    // Añadir el logo
    const imgWidth = 40;
    const imgHeight = 40;
    const x = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
    doc.addImage(logoImage, 'PNG', x, yPos, imgWidth, imgHeight);
    yPos += imgHeight + 10;

    // Título
    doc.setFontSize(18);
    doc.text('Hoja de Pago', 105, yPos, { align: 'center' });
    yPos += 15;

    // Información del estudiante
    doc.setFontSize(12);
    doc.text(`Trimestre: ${studentData.trimestre}`, 20, yPos);
    yPos += 10;
    doc.text(`Nombre: ${studentData.nombre}`, 20, yPos);
    yPos += 10;
    doc.text(`Carrera: ${studentData.carrera}`, 20, yPos);
    yPos += 10;
    doc.text(`Tipo Tarifa: ${studentData.tipoTarifa}`, 20, yPos);
    yPos += 15;

    // Tabla de conceptos
    const headers = ['Concepto', '(Aula) Horarios', 'Cr', 'Fecha', 'Deuda Corriente'];
    const data = studentData.conceptos.map(c => [
      c.concepto,
      `(${c.aula}) ${c.horarios}`,
      c.cr,
      c.fecha,
      `$${c.deudaCorriente.toFixed(2)}`
    ]);

    doc.autoTable({
      startY: yPos,
      head: [headers],
      body: data,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { top: 20 }
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // Balance y pagos
    doc.setFontSize(12);
    doc.text(`Balance Actual: $${studentData.balanceActual.toFixed(2)}`, 20, yPos);
    yPos += 15;
    doc.text(`Primer Pago: $${studentData.primerPago.toFixed(2)} - Fecha: ${studentData.fechaPrimerPago}`, 20, yPos);
    yPos += 10;
    doc.text(`Segundo Pago: $${studentData.segundoPago.toFixed(2)} - Fecha: ${studentData.fechaSegundoPago}`, 20, yPos);
    yPos += 10;
    doc.text(`Tercer Pago: $${studentData.tercerPago.toFixed(2)} - Fecha: ${studentData.fechaTercerPago}`, 20, yPos);

    doc.save('hoja_de_pago.pdf');
  };
  
  if (!user) {
    return <div>Cargando información del usuario...</div>;
  }

  return (
    <div className={styles['hoja-de-pago-page']}>
      <Header />
      <div className={styles['main-content']}>
        <Sidebar />
        <div className={styles['content-area']}>
          <h1>Hoja De Pago</h1>
          <div className={styles['filters']}>
            <div className={styles['filter-item']}>
              <label htmlFor="year">Año</label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div className={styles['filter-item']}>
              <label htmlFor="period">Periodo</label>
              <select
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="FEB-ABR">FEB-ABR</option>
                <option value="MAY-JUL">MAY-JUL</option>
                <option value="AGO-OCT">AGO-OCT</option>
                <option value="NOV-ENE">NOV-ENE</option>
              </select>
            </div>
            <button onClick={handleGenerateInvoice} className={styles['generate-button']}>
              Generar factura
            </button>
          </div>
          {message && <div className={styles['message']}>{message}</div>}
          {tieneDeuda && isGenerated && studentData && (
            <div className={styles['hoja-pago']}>
              <div className={styles['encabezado']}>
                <div>
                  <p><strong>Trimestre:</strong> {studentData.trimestre}</p>
                  <p><strong>Nombre:</strong> {studentData.nombre}</p>
                  <p><strong>Carrera:</strong> {studentData.carrera}</p>
                </div>
                <div>
                  <p><strong>Tipo Tarifa:</strong> {studentData.tipoTarifa}</p>
                </div>
              </div>
              
              <table className={styles['tabla-conceptos']}>
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>(Aula) Horarios</th>
                    <th>Cr</th>
                    <th>Fecha</th>
                    <th>Deuda Corriente</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.conceptos.map((concepto, index) => (
                    <tr key={index}>
                      <td>{concepto.concepto}</td>
                      <td>({concepto.aula}) {concepto.horarios}</td>
                      <td>{concepto.cr}</td>
                      <td>{concepto.fecha}</td>
                      <td>${concepto.deudaCorriente.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className={styles['balance']}>
                <p><strong>Balance Actual:</strong> ${studentData.balanceActual.toFixed(2)}</p>
              </div>
              
              <div className={styles['pagos']}>
                <div>
                  <p><strong>Primer Pago:</strong> ${studentData.primerPago.toFixed(2)}</p>
                  <p><strong>Fecha:</strong> {studentData.fechaPrimerPago}</p>
                </div>
                <div>
                  <p><strong>Segundo Pago:</strong> ${studentData.segundoPago.toFixed(2)}</p>
                  <p><strong>Fecha:</strong> {studentData.fechaSegundoPago}</p>
                </div>
                <div>
                  <p><strong>Tercer Pago:</strong> ${studentData.tercerPago.toFixed(2)}</p>
                  <p><strong>Fecha:</strong> {studentData.fechaTercerPago}</p>
                </div>
              </div>

              <div className={styles['actions']}>
                <button onClick={handlePayment} className={styles['pay-button']}>
                  Pagar
                </button>
                <button onClick={handleDownloadPDF} className={styles['download-button']}>
                  Descargar PDF
                </button>
              </div>

              {showPaymentForm && (
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    facturaId={facturaId}
                    montoTotal={montoTotal}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </Elements>
              )}
            </div>
          )}
          {!tieneDeuda && (
            <div className={styles['no-deuda-message']}>
              No tiene deudas pendientes para este período.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}