"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./payment.module.css";

const PaymentPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");

  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  // Load saved data from localStorage
  useEffect(() => {
    const savedTripDetails = localStorage.getItem(`trip_${tripId}`);
    if (savedTripDetails) {
      setTripDetails(JSON.parse(savedTripDetails));
    }

    const savedActivities = localStorage.getItem(`activities_${tripId}`);
    if (savedActivities) {
      setDayActivities(JSON.parse(savedActivities));
    }
  }, [tripId]);

  // Mock trip data - in a real app, this would be fetched from an API using the tripId
  const [tripDetails, setTripDetails] = useState({
    id: tripId,
    title: "My Japan Trip",
    destination: "Tokyo, Japan",
    dates: "23 Feb - 28 Feb",
    totalDays: 6,
    flights: [
      {
        id: "flight-1",
        title: "Singapore Airlines - SIN to NRT",
        date: "23 Feb 2025",
        departureTime: "12:30",
        departureAirport: "SIN T1",
        arrivalTime: "19:15",
        arrivalAirport: "NRT T1",
        duration: "6h 45m",
        airline: "Singapore Airlines",
        price: 859,
        class: "Economy",
        status: "pending",
      },
      {
        id: "flight-2",
        title: "Singapore Airlines - NRT to SIN",
        date: "28 Feb 2025",
        departureTime: "10:00",
        departureAirport: "NRT T1",
        arrivalTime: "16:40",
        arrivalAirport: "SIN T1",
        duration: "7h 40m",
        airline: "Singapore Airlines",
        price: 859,
        class: "Economy",
        status: "pending",
      },
    ],
    hotel: {
      id: "hotel-1",
      title: "VIA INN PRIME AKASAKA",
      name: "VIA INN PRIME AKASAKA",
      location: "2-Chome-6-7 Akasaka, Minato, Akasaka 107-0052, Japan",
      checkIn: "23 Feb",
      checkOut: "28 Feb",
      image: "/tokyo-hotel.jpg",
      amenities: ["Onsen", "Luggage Storage", "Free WiFi"],
      price: 769,
      nights: "5 Nights",
      status: "pending",
    },
  });

  // Mock day activities data
  const [dayActivities, setDayActivities] = useState({
    1: [
      {
        id: "existing-1",
        title: "Check-in at VIA INN PRIME AKASAKA",
        time: "15:00 - 16:00",
        description: "Check in and rest after flight",
        price: 0,
        status: "confirmed",
      },
    ],
    2: [
      {
        id: "existing-2",
        title: "Tokyo Imperial Palace",
        time: "09:00 - 11:30",
        description: "Visit the primary residence of the Emperor of Japan",
        image: "/tokyo-palace.jpg",
        price: 0,
        status: "confirmed",
      },
    ],
    3: [
      {
        id: "existing-4",
        title: "1. Meiji Jingu Tour",
        time: "09:00 - 13:30",
        description: "Dedicated to Emperor Meiji and Empress Shoken",
        image: "/meiji-jingu.jpg",
        duration: "4.5 hours",
        price: 100,
        status: "pending",
      },
      {
        id: "existing-5",
        title: "2. Shibuya Sky",
        time: "15:00 - 17:30",
        description: "Observation deck with an excellent view of Tokyo",
        image: "/shibuya-sky.jpg",
        duration: "2.5 hours",
        price: 100,
        status: "pending",
      },
    ],
    4: [
      {
        id: "existing-6",
        title: "1. Tokyo Disneyland",
        time: "09:00 - 20:00",
        description: 'Enjoy the "happiest place on Earth" for a full day',
        image: "/tokyo-disneyland.jpg",
        duration: "11 hours",
        price: 110,
        status: "pending",
      },
    ],
  });

  // State for unpaid items
  const [unpaidItems, setUnpaidItems] = useState({
    flights: [],
    hotel: null,
    activities: [],
  });

  const [totalCost, setTotalCost] = useState(0);

  // Collect all unpaid items on component mount
  useEffect(() => {
    const unpaidFlights = tripDetails.flights.filter(
      (flight) => flight.status === "pending"
    );
    const unpaidHotel =
      tripDetails.hotel.status === "pending" ? tripDetails.hotel : null;

    // Collect all unpaid activities from all days
    const unpaidActivities = [];
    Object.keys(dayActivities).forEach((day) => {
      dayActivities[day]
        .filter(
          (activity) => activity.status === "pending" && activity.price > 0
        )
        .forEach((activity) => {
          unpaidActivities.push({
            ...activity,
            day,
          });
        });
    });

    setUnpaidItems({
      flights: unpaidFlights,
      hotel: unpaidHotel,
      activities: unpaidActivities,
    });

    // Calculate total cost
    let total = 0;
    unpaidFlights.forEach((flight) => (total += flight.price));
    if (unpaidHotel) total += unpaidHotel.price;
    unpaidActivities.forEach((activity) => (total += activity.price));

    setTotalCost(total);
  }, [tripDetails, dayActivities]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Update all items to confirmed
      const updatedFlights = tripDetails.flights.map((flight) => ({
        ...flight,
        status: "confirmed",
      }));

      const updatedTripDetails = {
        ...tripDetails,
        flights: updatedFlights,
        hotel: {
          ...tripDetails.hotel,
          status: "confirmed",
        },
      };

      // Update activities
      const updatedActivities = { ...dayActivities };
      Object.keys(updatedActivities).forEach((day) => {
        updatedActivities[day] = updatedActivities[day].map((activity) =>
          activity.price > 0 ? { ...activity, status: "confirmed" } : activity
        );
      });

      // Save to localStorage
      localStorage.setItem(
        `trip_${tripId}`,
        JSON.stringify(updatedTripDetails)
      );
      localStorage.setItem(
        `activities_${tripId}`,
        JSON.stringify(updatedActivities)
      );

      setIsProcessing(false);
      setSuccessMessage(
        "Payment successful! All bookings have been confirmed."
      );

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(`/trip/${tripId}`);
      }, 3000);
    }, 2000);
  };
  // Check if there are any unpaid items
  const hasUnpaidItems =
    unpaidItems.flights.length > 0 ||
    unpaidItems.hotel !== null ||
    unpaidItems.activities.length > 0;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/wts-logo.png"
              alt="WTS Travel Logo"
              width={120}
              height={40}
            />
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/plan-trip" className={styles.navLink}>
            Plan a trip
          </Link>
          <Link href="/tours" className={styles.navLink}>
            Tours
          </Link>
          <Link href="/promotions" className={styles.navLink}>
            Promotions
          </Link>
          <Link href="/about" className={styles.navLink}>
            About Us
          </Link>
        </nav>
        <div className={styles.profileIcon}>
          <Image
            src="/profile-avatar.png"
            alt="Profile"
            width={32}
            height={32}
            className={styles.avatar}
          />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Payment Summary</h1>
          <Link href={`/trip/${tripId}`} className={styles.backButton}>
            Back to Trip
          </Link>
        </div>

        {successMessage ? (
          <div className={styles.successMessage}>
            <svg
              className={styles.successIcon}
              width="48"
              height="48"
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
            <p>{successMessage}</p>
          </div>
        ) : (
          <>
            <div className={styles.paymentContent}>
              {!hasUnpaidItems ? (
                <div className={styles.noPendingItems}>
                  <p>All of your bookings have been paid for and confirmed!</p>
                  <Link
                    href={`/trip/${tripId}`}
                    className={styles.returnButton}
                  >
                    Return to Trip
                  </Link>
                </div>
              ) : (
                <>
                  <div className={styles.paymentSummary}>
                    <div className={styles.totalSummary}>
                      <h2>Total Cost: ${totalCost.toFixed(2)}</h2>
                      <p>
                        {unpaidItems.flights.length +
                          (unpaidItems.hotel ? 1 : 0) +
                          unpaidItems.activities.length}{" "}
                        items pending payment
                      </p>
                    </div>

                    {/* Unpaid Flights Section */}
                    {unpaidItems.flights.length > 0 && (
                      <div className={styles.sectionContainer}>
                        <h3 className={styles.sectionTitle}>Flights</h3>
                        {unpaidItems.flights.map((flight, index) => (
                          <div
                            key={`flight-${index}`}
                            className={styles.paymentItem}
                          >
                            <div className={styles.itemDetails}>
                              <div className={styles.itemName}>
                                {flight.title}
                              </div>
                              <div className={styles.itemInfo}>
                                {flight.date} • {flight.departureTime} -{" "}
                                {flight.arrivalTime}
                              </div>
                            </div>
                            <div className={styles.itemPrice}>
                              ${flight.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Unpaid Hotel Section */}
                    {unpaidItems.hotel && (
                      <div className={styles.sectionContainer}>
                        <h3 className={styles.sectionTitle}>Hotel</h3>
                        <div className={styles.paymentItem}>
                          <div className={styles.itemDetails}>
                            <div className={styles.itemName}>
                              {unpaidItems.hotel.name}
                            </div>
                            <div className={styles.itemInfo}>
                              {unpaidItems.hotel.checkIn} to{" "}
                              {unpaidItems.hotel.checkOut} •{" "}
                              {unpaidItems.hotel.nights}
                            </div>
                          </div>
                          <div className={styles.itemPrice}>
                            ${unpaidItems.hotel.price}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Unpaid Activities Section */}
                    {unpaidItems.activities.length > 0 && (
                      <div className={styles.sectionContainer}>
                        <h3 className={styles.sectionTitle}>Activities</h3>
                        {unpaidItems.activities.map((activity, index) => (
                          <div
                            key={`activity-${index}`}
                            className={styles.paymentItem}
                          >
                            <div className={styles.itemDetails}>
                              <div className={styles.itemName}>
                                {activity.title}
                              </div>
                              <div className={styles.itemInfo}>
                                Day {activity.day} •{" "}
                                {activity.time || "Time TBD"}
                                {activity.duration && ` • ${activity.duration}`}
                              </div>
                            </div>
                            <div className={styles.itemPrice}>
                              ${activity.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.paymentFormContainer}>
                    <h3>Payment Information</h3>
                    <form
                      onSubmit={handleSubmit}
                      className={styles.paymentForm}
                    >
                      <div className={styles.formGroup}>
                        <label htmlFor="cardNumber">Card Number</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="expiryDate">Expiry Date</label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
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
                            value={paymentInfo.cvv}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="cardholderName">Cardholder Name</label>
                        <input
                          type="text"
                          id="cardholderName"
                          name="cardholderName"
                          placeholder="John Doe"
                          value={paymentInfo.cardholderName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className={styles.paymentActions}>
                        <Link
                          href={`/trip/${tripId}`}
                          className={styles.cancelButton}
                        >
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          className={styles.payButton}
                          disabled={isProcessing}
                        >
                          {isProcessing
                            ? "Processing..."
                            : `Pay $${totalCost.toFixed(2)}`}
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <Image
            src="/wts-logo.png"
            alt="WTS Travel Logo"
            width={100}
            height={30}
          />
        </div>
        <div className={styles.footerLinks}>
          <Link href="/plan-trip">Plan a Trip</Link>
          <Link href="/tours">Tours</Link>
          <Link href="/promotions">Promotions</Link>
          <Link href="/about">About Us</Link>
        </div>
        <div className={styles.footerInfo}>
          <p>WTS Travel & Tours Pte Ltd</p>
          <p>Travel Agent License Number: TA02307</p>
          <p>Copyright 2025©</p>
        </div>
      </footer>
    </div>
  );
};

export default PaymentPageContent;
