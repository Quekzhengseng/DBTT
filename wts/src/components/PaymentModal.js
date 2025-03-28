// components/PaymentModal.js
"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./PaymentModal.module.css";

const PaymentModal = ({ isOpen, onClose, item, onPaymentComplete }) => {
  const [paymentStep, setPaymentStep] = useState("details");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  });

  if (!isOpen || !item) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep("confirmation");
    }, 1500);
  };

  const handleConfirmPayment = () => {
    onPaymentComplete(item.id, item.type);
    onClose();
  };

  // Format price based on item type
  const formatPrice = () => {
    if (item.type === "flight") {
      return `$${item.price} (${item.class || "Economy"})`;
    } else if (item.type === "hotel") {
      return `$${item.price} (${item.nights})`;
    } else {
      return `$${item.price}`;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        {paymentStep === "details" && (
          <>
            <div className={styles.modalHeader}>
              <h2>Checkout</h2>
              <div className={styles.itemDetails}>
                <div className={styles.itemName}>{item.title}</div>
                <div className={styles.itemPrice}>{formatPrice()}</div>
              </div>
            </div>

            <div className={styles.paymentMethods}>
              <div className={styles.paymentMethodsHeader}>
                <h3>Payment Method</h3>
              </div>
              <div className={styles.paymentMethodOptions}>
                <div
                  className={`${styles.paymentMethod} ${
                    paymentMethod === "card" ? styles.selected : ""
                  }`}
                  onClick={() => handlePaymentMethodChange("card")}
                >
                  <div className={styles.paymentIcon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="2"
                        y="5"
                        width="20"
                        height="14"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="2"
                        y1="10"
                        x2="22"
                        y2="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="6"
                        y1="15"
                        x2="10"
                        y2="15"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className={styles.paymentLabel}>Credit Card</div>
                </div>

                <div
                  className={`${styles.paymentMethod} ${
                    paymentMethod === "paypal" ? styles.selected : ""
                  }`}
                  onClick={() => handlePaymentMethodChange("paypal")}
                >
                  <div className={styles.paymentIcon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.5 8.5C19.5 11 17.5 13 14.5 13H11L10 18H7L8.5 9H14.5C16.5 9 17.5 8 17.5 6.5C17.5 5 16.5 4 14.5 4H6L4 18H1L3.5 2H14.5C17.5 2 19.5 4.5 19.5 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 11C22 13.5 20 15.5 17 15.5H13.5L12.5 20.5H9.5L11 11.5H17C19 11.5 20 10.5 20 9C20 7.5 19 6.5 17 6.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className={styles.paymentLabel}>PayPal</div>
                </div>
              </div>
            </div>

            <form className={styles.paymentForm} onSubmit={handleSubmitPayment}>
              {paymentMethod === "card" && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="cardNumber">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="cardName">Cardholder Name</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        placeholder="John Doe"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        id="saveCard"
                        name="saveCard"
                        checked={formData.saveCard}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="saveCard">
                        Save card for future payments
                      </label>
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "paypal" && (
                <div className={styles.paypalInfo}>
                  <p>
                    You will be redirected to PayPal to complete your payment.
                  </p>
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.payButton}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay ${formatPrice()}`}
                </button>
              </div>
            </form>
          </>
        )}

        {paymentStep === "confirmation" && (
          <div className={styles.confirmationScreen}>
            <div className={styles.successIcon}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" fill="#4CAF50" />
                <path
                  d="M8 12L11 15L16 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2>Payment Successful!</h2>
            <p>
              Your payment for {item.title} has been processed successfully.
            </p>
            <div className={styles.paymentDetails}>
              <div className={styles.paymentDetail}>
                <span>Amount Paid:</span>
                <span>{formatPrice()}</span>
              </div>
              <div className={styles.paymentDetail}>
                <span>Payment Method:</span>
                <span>
                  {paymentMethod === "card" ? "Credit Card" : "PayPal"}
                </span>
              </div>
              <div className={styles.paymentDetail}>
                <span>Transaction ID:</span>
                <span>TXN{Math.floor(Math.random() * 10000000)}</span>
              </div>
              <div className={styles.paymentDetail}>
                <span>Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <button
              className={styles.confirmButton}
              onClick={handleConfirmPayment}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
