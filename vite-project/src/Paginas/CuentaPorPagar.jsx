import React, { useState } from 'react';
import styles from '../Estilos/EstPaginas/CuentaPorPagar.module.css';
import visaMasterDiscoverLogo from '../assets/visa-master-discover.png';
import amexLogo from '../assets/amex.png';
import Header from '../Componentes/Header';
import Sidebar from '../Componentes/Sidebar2.jsx';

export function CuentaPorPagar() {
  const [selectedCard, setSelectedCard] = useState('visa');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [montoPendiente, setMontoPendiente] = useState(32558.40);

  // Validar fecha de vencimiento
  const validateExpiryDate = (date) => {
    const currentDate = new Date();
    const [inputMonth, inputYear] = date.split('/');
    const expiryDate = new Date(2000 + parseInt(inputYear), inputMonth - 1);
    return expiryDate > currentDate;
  };

  // Validar CVV
  const validateCVV = (cvv) => {
    return selectedCard === 'amex' ? /^[0-9]{4}$/.test(cvv) : /^[0-9]{3}$/.test(cvv);
  };

  // Manejar cambio en la fecha de vencimiento
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value);

    if (value.length === 5) {
      if (!validateExpiryDate(value)) {
        setErrors(prev => ({ ...prev, expiryDate: 'Fecha de vencimiento inválida' }));
      } else {
        setErrors(prev => ({ ...prev, expiryDate: null }));
      }
    }
  };

  // Manejar cambio en el CVV
  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value);

    if (value.length === (selectedCard === 'amex' ? 4 : 3)) {
      if (!validateCVV(value)) {
        setErrors(prev => ({ ...prev, cvv: 'CVV inválido' }));
      } else {
        setErrors(prev => ({ ...prev, cvv: null }));
      }
    }
  };

  // Manejar cambio en el número de tarjeta
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (selectedCard === 'amex') {
      value = value.slice(0, 15).replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    } else {
      value = value.slice(0, 16).replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    }
    setCardNumber(value.trim());
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateExpiryDate(expiryDate) && validateCVV(cvv) && amount) {
      const amountPaid = parseFloat(amount);
      if (amountPaid > 0 && amountPaid <= montoPendiente) {
        setPaymentSuccess(true);
        setMontoPendiente(prevMonto => Math.max(0, prevMonto - amountPaid));
        // Aquí puedes agregar la lógica para enviar el pago
      } else {
        setErrors(prev => ({ ...prev, amount: 'Monto inválido' }));
      }
    } else {
      console.log('Formulario inválido');
      // Aquí puedes agregar la lógica para manejar el formulario inválido
    }
  };

  return (
    <div className={styles.cuentaPorPagar}>
      <Header />
      <Sidebar />
      <div className={styles.cuentaPorPagarContent}>
        <h2>$ Cuenta Por Pagar</h2>
        <div className={styles.paymentForm}>
          <h3>Pago En Línea</h3>
          <form onSubmit={handleSubmit}>
            {paymentSuccess && (
              <div className={styles.paymentSuccessMessage}>
                ¡Pago realizado con éxito!
              </div>
            )}
            <div className={styles.cardSelection}>
              <label>
                <input
                  type="radio"
                  value="visa"
                  checked={selectedCard === 'visa' || selectedCard === 'mastercard' || selectedCard === 'discover'}
                  onChange={() => setSelectedCard('visa')}
                />
                <img src={visaMasterDiscoverLogo} alt="Visa, MasterCard y Discover" />
                Visa, MasterCard y Discover
              </label>
              <label>
                <input
                  type="radio"
                  value="amex"
                  checked={selectedCard === 'amex'}
                  onChange={() => setSelectedCard('amex')}
                />
                <img src={amexLogo} alt="American Express" />
                American Express
              </label>
            </div>

            <div className={styles.cardDetails}>
              <input
                type="text"
                placeholder="Numero de Tarjeta"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={selectedCard === 'amex' ? 17 : 19} // 15 digits + 2 spaces for Amex, 16 digits + 3 spaces for others
              />
              <div className={styles.expiryCvv}>
                <input
                  type="text"
                  placeholder="Fecha de Vencimiento (MM/YY)"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  maxLength={5}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={handleCVVChange}
                  maxLength={selectedCard === 'amex' ? 4 : 3}
                />
              </div>
              {errors.expiryDate && <span className={styles.error}>{errors.expiryDate}</span>}
              {errors.cvv && <span className={styles.error}>{errors.cvv}</span>}
            </div>

            <div className={styles.amountSection}>
              <input
                type="number"
                placeholder="Monto a pagar"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={paymentSuccess}
              />
              {errors.amount && <span className={styles.error}>{errors.amount}</span>}
              <div className={styles.montoPendiente}>
                Monto Pendiente: $ {montoPendiente.toFixed(2)} DOP
              </div>
            </div>

            <button type="submit" className={styles.button} disabled={paymentSuccess}>
              {paymentSuccess ? 'Pagado' : 'Pagar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
