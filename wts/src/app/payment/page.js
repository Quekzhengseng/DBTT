"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./payment.module.css";

// Wrapper component that uses Suspense
export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
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
    // Load trip details
    const savedTripDetails = localStorage.getItem(`trip_${tripId}`);
    if (savedTripDetails) {
      try {
        const parsedTripDetails = JSON.parse(savedTripDetails);
        setTripDetails(parsedTripDetails);
        console.log("Loaded trip details:", parsedTripDetails);
      } catch (error) {
        console.error("Error parsing trip details:", error);
      }
    }

    // Load activities with improved error handling
    const savedActivities = localStorage.getItem(`activities_${tripId}`);
    if (savedActivities) {
      try {
        const parsedActivities = JSON.parse(savedActivities);
        console.log("Loaded activities:", parsedActivities);

        // Ensure we have a proper object structure
        if (parsedActivities && typeof parsedActivities === "object") {
          setDayActivities(parsedActivities);
        } else {
          console.error(
            "Saved activities is not a valid object:",
            parsedActivities
          );
        }
      } catch (error) {
        console.error("Error parsing activities:", error);
      }
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
        price: 0,
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

  // Enhanced unpaid items collection with more debugging
  useEffect(() => {
    if (!tripDetails || !dayActivities) return;

    console.log("Processing payment items from:", {
      tripDetails,
      dayActivities,
    });

    const unpaidFlights = tripDetails.flights.filter(
      (flight) => flight.status === "pending"
    );
    const unpaidHotel =
      tripDetails.hotel.status === "pending" ? tripDetails.hotel : null;

    // Collect all unpaid activities from all days with improved logging
    const unpaidActivities = [];
    Object.keys(dayActivities).forEach((day) => {
      console.log(`Processing day ${day} activities:`, dayActivities[day]);

      if (Array.isArray(dayActivities[day])) {
        dayActivities[day]
          .filter(
            (activity) => activity.status === "pending" && activity.price > 0
          )
          .forEach((activity) => {
            console.log(`Adding pending activity from day ${day}:`, activity);
            unpaidActivities.push({
              ...activity,
              day,
            });
          });
      } else {
        console.warn(
          `Day ${day} activities is not an array:`,
          dayActivities[day]
        );
      }
    });

    console.log("Final unpaid items:", {
      flights: unpaidFlights,
      hotel: unpaidHotel,
      activities: unpaidActivities,
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
      // Update all items to confirmed (your existing code)
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

      // Update activities (your existing code)
      const updatedActivities = { ...dayActivities };
      Object.keys(updatedActivities).forEach((day) => {
        updatedActivities[day] = updatedActivities[day].map((activity) =>
          activity.price > 0 ? { ...activity, status: "confirmed" } : activity
        );
      });

      // Save to localStorage (your existing code)
      localStorage.setItem(
        `trip_${tripId}`,
        JSON.stringify(updatedTripDetails)
      );
      localStorage.setItem(
        `activities_${tripId}`,
        JSON.stringify(updatedActivities)
      );

      // NEW CODE: Update the trip status in savedTrips
      try {
        const savedTripsStr = localStorage.getItem("savedTrips");
        if (savedTripsStr) {
          const savedTrips = JSON.parse(savedTripsStr);

          // Find and update the trip with matching ID
          const updatedSavedTrips = savedTrips.map((trip) => {
            if (trip.id.toString() === tripId) {
              return {
                ...trip,
                status: "upcoming", // Change status from "planning" to "upcoming"
              };
            }
            return trip;
          });

          // Save updated trips back to localStorage
          localStorage.setItem("savedTrips", JSON.stringify(updatedSavedTrips));
          console.log("Trip status updated to 'upcoming'");
        }
      } catch (error) {
        console.error("Error updating saved trips:", error);
      }

      setIsProcessing(false);
      setSuccessMessage(
        "Payment successful! All bookings have been confirmed and your trip is now upcoming."
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
              width={200}
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
                        {unpaidItems.flights.length -1 +
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
                            {/* changed the abv dict to set return flight to 0 and added if for this */}
                            {flight.price > 0 && (
                              <div className={styles.itemPrice}>
                                ${flight.price}
                              </div>
                            )}
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
}
