"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./trip.module.css";

// Drag and Drop Components
const DraggableActivity = ({
  activity,
  index,
  onRemove,
  origin,
  day,
  onAddToDay,
  onCheckout,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "activity",
      item: () => ({
        id: activity.id,
        title: activity.title,
        time: activity.time,
        description: activity.description,
        image: activity.image,
        price: activity.price,
        duration: activity.duration,
        origin,
        day,
      }),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      // Ensure the item identity is updated when props change
      options: { dropEffect: "move" },
    }),
    [activity, origin, day]
  ); // Add dependencies to ensure useDrag recreates when these change

  return (
    <div
      ref={drag}
      className={`${styles.activity} ${isDragging ? styles.dragging : ""}`}
    >
      <div className={styles.activityContent}>
        <div className={styles.activityHeader}>
          <h4>{activity.title}</h4>
          {origin === "itinerary" && (
            <button
              className={styles.removeButton}
              onClick={() => onRemove(activity.id, day)}
            >
              ×
            </button>
          )}
        </div>
        <div className={styles.activityTime}>
          {activity.time || "00:00 - 00:00"}
        </div>
        {activity.description && (
          <div className={styles.activityDescription}>
            {activity.description}
          </div>
        )}

        {/* Show checkout button for itinerary paid activities */}
        {origin === "itinerary" && activity.price > 0 && (
          <div className={styles.activityCheckout}>
            {activity.status === "pending" ? (
              <button
                className={styles.checkoutButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckout(activity, "activity");
                }}
              >
                Checkout ${activity.price}
              </button>
            ) : (
              <div className={styles.confirmedStatus}>
                <svg
                  className={styles.checkIcon}
                  width="16"
                  height="16"
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
                Confirmed
              </div>
            )}
          </div>
        )}
      </div>
      {activity.image && (
        <div className={styles.activityImageContainer}>
          <Image
            src={activity.image}
            alt={activity.title}
            width={80}
            height={60}
            className={styles.activityImage}
          />
        </div>
      )}
      {origin === "recommendations" && (
        <div className={styles.activityPrice}>${activity.price}</div>
      )}
      {origin === "recommendations" && (
        <button
          className={styles.addButton}
          onClick={() => onAddToDay(activity, 1)} // Add to Day 1
        >
          Add to Trip
        </button>
      )}
    </div>
  );
};

const DroppableDay = ({
  day,
  date,
  activities,
  onDrop,
  onRemove,
  onCheckout,
}) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "activity",
      drop: (item) => {
        console.log("Dropping item:", item, "to day:", day);
        onDrop(item, day);
        return { dropped: true, day };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [day, onDrop]
  ); // Add dependencies to ensure useDrop recreates when these change

  return (
    <div
      className={`${styles.dayContainer} ${isOver ? styles.dropHighlight : ""}`}
    >
      <div className={styles.dayHeader}>
        <h3>
          Day {day} - {date}
        </h3>
        <button className={styles.addActivity}>Add Activity</button>
      </div>
      <div className={styles.dayNotes}>
        {day === 1 && "Check in around 3pm by Lawson Red."}
        {day === 2 &&
          "Visit Tokyo Imperial Palace first. Take shopping at Shibuya at night."}
        {day === 3 && "Leave comfort zone to explore for dinner."}
        {day === 4 && ""}
        {day === 5 && ""}
        {day === 6 && ""}
      </div>
      <div className={styles.activitiesSection} ref={drop}>
        <h4>Activities</h4>
        <div className={styles.activitiesList}>
          {activities.map((activity, index) => (
            <DraggableActivity
              key={`${activity.id}-${day}`}
              activity={activity}
              index={index}
              onRemove={onRemove}
              origin="itinerary"
              day={day}
              onCheckout={onCheckout}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Add Payment Modal component
const PaymentModal = ({ isOpen, onClose, item, onPaymentComplete }) => {
  if (!isOpen || !item) return null;

  const handlePayment = () => {
    onPaymentComplete(item.id, item.type);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Checkout</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <h4>{item.title}</h4>
          <p>Total Amount: ${item.price}</p>
          {/* Payment form would go here */}
          <div className={styles.paymentForm}>
            <div className={styles.formGroup}>
              <label>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Expiry Date</label>
                <input type="text" placeholder="MM/YY" />
              </div>
              <div className={styles.formGroup}>
                <label>CVV</label>
                <input type="text" placeholder="123" />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Cardholder Name</label>
              <input type="text" placeholder="John Doe" />
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.payButton} onClick={handlePayment}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

const TripItineraryPage = () => {
  const params = useParams();
  const tripId = params.id;

  // State for payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // State for trip details
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
        status: "pending", // pending, confirmed
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

  // State for day activities
  const [dayActivities, setDayActivities] = useState({
    1: [
      {
        id: "existing-1",
        title: "Check-in at VIA INN PRIME AKASAKA",
        time: "15:00 - 16:00",
        description: "Check in and rest after flight",
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
      {
        id: "existing-3",
        title: "Shopping at Shibuya",
        time: "14:00 - 17:00",
        description: "Visit the famous crossing and enjoy shopping",
        image: "/shibuya.jpg",
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
    5: [],
    6: [],
  });

  // Recommended activities
  const [recommendations, setRecommendations] = useState([
    {
      id: "rec-1",
      title: "TeamLab Borderless",
      description: "Digital art museum with immersive experiences",
      image: "/teamlab.jpg",
      price: 35,
      duration: "2-3 hours",
      rating: 4.7,
    },
    {
      id: "rec-2",
      title: "Sanrio Puroland Tokyo",
      description: "Indoor theme park featuring Hello Kitty and friends",
      image: "/sanrio.jpg",
      price: 45,
      duration: "4-5 hours",
      rating: 4.5,
    },
    {
      id: "rec-3",
      title: "Mt Fuji One Day Trip",
      description: "Day trip to Japan's iconic mountain",
      image: "/mtfuji.jpg",
      price: 125,
      duration: "Full day",
      rating: 4.6,
    },
    {
      id: "rec-4",
      title: "TeamLab Planets",
      description: "Another digital art installation by TeamLab",
      image: "/teamlab-planets.jpg",
      price: 35,
      duration: "2-3 hours",
      rating: 4.7,
    },
    {
      id: "rec-5",
      title: "Tokyo Tower",
      description: "Iconic Tokyo landmark with observation decks",
      image: "/tokyo-tower.jpg",
      price: 25,
      duration: "2-3 hours",
      rating: 4.5,
    },
    {
      id: "rec-6",
      title: "Tsukiji Fish Market",
      description: "Famous fish market with delicious food stalls",
      image: "/tsukiji.jpg",
      price: 0,
      duration: "3-4 hours",
      rating: 4.6,
    },
  ]);

  // Handle payment completion
  const handlePaymentComplete = (itemId, itemType) => {
    console.log("Payment completed for:", itemId, itemType);

    // Update status based on item type
    if (itemType === "flight") {
      // Update flight status
      setTripDetails((prev) => {
        const updatedFlights = prev.flights.map((flight) =>
          flight.id === itemId ? { ...flight, status: "confirmed" } : flight
        );

        return {
          ...prev,
          flights: updatedFlights,
        };
      });
    } else if (itemType === "hotel") {
      // Update hotel status
      setTripDetails((prev) => ({
        ...prev,
        hotel: {
          ...prev.hotel,
          status: "confirmed",
        },
      }));
    } else if (itemType === "activity") {
      // Find which day contains the activity
      let foundDay = null;

      for (const day in dayActivities) {
        const activityIndex = dayActivities[day].findIndex(
          (act) => act.id === itemId
        );
        if (activityIndex !== -1) {
          foundDay = day;
          break;
        }
      }

      if (foundDay) {
        setDayActivities((prev) => {
          const updatedActivities = { ...prev };
          updatedActivities[foundDay] = prev[foundDay].map((activity) =>
            activity.id === itemId
              ? { ...activity, status: "confirmed" }
              : activity
          );

          return updatedActivities;
        });
      }
    }
  };

  // Handle opening payment modal
  const handleOpenPayment = (item, type) => {
    setSelectedItem({ ...item, type });
    setPaymentModalOpen(true);
  };

  // Handle drop activity into a day
  const handleDrop = (item, targetDay) => {
    console.log("Handle drop called with:", item, "target day:", targetDay);

    // If already in the same day, do nothing
    if (item.origin === "itinerary" && item.day === targetDay) {
      console.log("Same day, ignoring drop");
      return;
    }

    // If from recommendations, add it to the day
    if (item.origin === "recommendations") {
      console.log("Adding from recommendations");
      // Create a new activity entry with a unique ID
      const newActivity = {
        ...item,
        id: `added-${item.id}-${Date.now()}`, // Create a unique ID
        time: "09:00 - 11:00", // Default time
        status: "pending",
      };

      setDayActivities((prev) => {
        const updatedActivities = { ...prev };
        updatedActivities[targetDay] = [
          ...updatedActivities[targetDay],
          newActivity,
        ];
        return updatedActivities;
      });
    }
    // If moving from one day to another
    else if (item.origin === "itinerary" && item.day !== targetDay) {
      console.log("Moving from day", item.day, "to day", targetDay);

      // Find the activity in the source day
      const sourceDay = dayActivities[item.day] || [];
      const sourceActivity = sourceDay.find(
        (activity) => activity.id === item.id
      );

      if (!sourceActivity) {
        console.log("Source activity not found");
        return;
      }

      // Create a complete copy to avoid reference issues
      const activityToAdd = {
        ...sourceActivity,
        // Optionally update any properties if needed
      };

      setDayActivities((prev) => {
        // Create a new object to ensure React recognizes state change
        const updatedActivities = { ...prev };

        // Remove from source day
        updatedActivities[item.day] = prev[item.day].filter(
          (a) => a.id !== item.id
        );

        // Add to target day
        updatedActivities[targetDay] = [...prev[targetDay], activityToAdd];

        return updatedActivities;
      });
    }
  };

  const handleAddToDay = (activity, targetDay) => {
    console.log("Adding activity directly to day", targetDay, activity);

    // Create a new activity entry with a unique ID
    const newActivity = {
      ...activity,
      id: `btn-added-${activity.id}-${Date.now()}`, // Create a unique ID with different prefix
      time: "09:00 - 11:00", // Default time
      status: "pending",
    };

    setDayActivities((prev) => {
      // Create a new object to ensure React recognizes state change
      const updatedActivities = { ...prev };
      updatedActivities[targetDay] = [
        ...updatedActivities[targetDay],
        newActivity,
      ];
      return updatedActivities;
    });
  };

  // Handle remove activity from a day
  const handleRemoveActivity = (activityId, day) => {
    setDayActivities((prev) => ({
      ...prev,
      [day]: prev[day].filter((activity) => activity.id !== activityId),
    }));
  };

  // Generate dates for each day of the trip
  const generateTripDates = () => {
    const startDate = new Date(2025, 1, 23); // Feb 23, 2025
    return Array.from({ length: tripDetails.totalDays }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date.getDate() + " Feb";
    });
  };

  const tripDates = generateTripDates();

  return (
    <DndProvider backend={HTML5Backend}>
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

        {/* Hero Banner */}
        <div className={styles.heroBanner}>
          <Image
            src="/japan-cherry-blossom.jpg"
            alt="Japan Cherry Blossoms with Mt. Fuji"
            width={1200}
            height={300}
            className={styles.bannerImage}
          />
        </div>

        {/* Trip Info Bar */}
        <div className={styles.tripInfo}>
          <div className={styles.tripTitle}>
            <h1>{tripDetails.title}</h1>
            <div className={styles.tripTags}>
              <span className={styles.tag}>Free & Easy</span>
              <span className={styles.tag}>Family</span>
            </div>
          </div>
          <div className={styles.tripActions}>
            <button className={styles.downloadBtn}>Download PDF</button>
            <button className={styles.shareBtn}>Share Trip</button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          {/* Left Section - Trip Details */}
          <div className={styles.tripDetailsSection}>
            {/* Flight Information */}
            <div className={styles.sectionContainer}>
              <h2 className={styles.sectionTitle}>
                <svg
                  className={styles.sectionIcon}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 16H2C1.44772 16 1 15.5523 1 15C1 14.4477 1.44772 14 2 14H22C22.5523 14 23 14.4477 23 15C23 15.5523 22.5523 16 22 16Z"
                    fill="currentColor"
                  />
                  <path
                    d="M15 16V20M9 16V20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18 4H6C4.89543 4 4 4.89543 4 6V14H20V6C20 4.89543 19.1046 4 18 4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                Flights
                <svg
                  className={styles.chevronIcon}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </h2>
              <div className={styles.flightInfo}>
                {/* Outbound Flight */}
                <div className={styles.flight}>
                  <div className={styles.flightDate}>23 Feb 2025</div>
                  <div className={styles.flightDetails}>
                    <div className={styles.flightTime}>
                      <div className={styles.time}>12:30</div>
                      <div className={styles.airport}>SIN T1</div>
                    </div>
                    <div className={styles.flightDuration}>
                      <div className={styles.durationLine}></div>
                      <div className={styles.durationText}>6h 45m</div>
                    </div>
                    <div className={styles.flightTime}>
                      <div className={styles.time}>19:15</div>
                      <div className={styles.airport}>NRT T1</div>
                    </div>
                    <div className={styles.flightPrice}>
                      <div className={styles.price}>
                        ${tripDetails.flights[0].price}
                      </div>
                    </div>
                  </div>
                  <div className={styles.flightActions}>
                    {tripDetails.flights[0].status === "pending" ? (
                      <button
                        className={styles.checkoutBtn}
                        onClick={() =>
                          handleOpenPayment(tripDetails.flights[0], "flight")
                        }
                      >
                        Checkout
                      </button>
                    ) : (
                      <div className={styles.confirmedStatus}>
                        <svg
                          className={styles.checkIcon}
                          width="16"
                          height="16"
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
                        Confirmed
                      </div>
                    )}
                  </div>
                </div>

                {/* Return Flight */}
                <div className={styles.flight}>
                  <div className={styles.flightDate}>28 Feb 2025</div>
                  <div className={styles.flightDetails}>
                    <div className={styles.flightTime}>
                      <div className={styles.time}>10:00</div>
                      <div className={styles.airport}>NRT T1</div>
                    </div>
                    <div className={styles.flightDuration}>
                      <div className={styles.durationLine}></div>
                      <div className={styles.durationText}>7h 40m</div>
                    </div>
                    <div className={styles.flightTime}>
                      <div className={styles.time}>16:40</div>
                      <div className={styles.airport}>SIN T1</div>
                    </div>
                  </div>
                  <div className={styles.flightActions}>
                    {tripDetails.flights[1].status === "pending" ? (
                      <button
                        className={styles.checkoutBtn}
                        onClick={() =>
                          handleOpenPayment(tripDetails.flights[1], "flight")
                        }
                      >
                        Checkout
                      </button>
                    ) : (
                      <div className={styles.confirmedStatus}>
                        <svg
                          className={styles.checkIcon}
                          width="16"
                          height="16"
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
                        Confirmed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel Information */}
            <div className={styles.sectionContainer}>
              <h2 className={styles.sectionTitle}>
                <svg
                  className={styles.sectionIcon}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 21H21M6 18V9.5M18 18V9.5M6 14H18M10 10.5H14M10 6.5H14M5 6L12 3L19 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Hotels
                <svg
                  className={styles.chevronIcon}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </h2>
              <div className={styles.hotelInfo}>
                <div className={styles.hotelImageContainer}>
                  <Image
                    src="/tokyo-hotel.jpg"
                    alt={tripDetails.hotel.name}
                    width={120}
                    height={100}
                    className={styles.hotelImage}
                  />
                </div>
                <div className={styles.hotelDetails}>
                  <h3 className={styles.hotelName}>{tripDetails.hotel.name}</h3>
                  <div className={styles.hotelLocation}>
                    {tripDetails.hotel.location}
                  </div>
                  <div className={styles.hotelStay}>
                    {tripDetails.hotel.checkIn} - {tripDetails.hotel.checkOut}
                  </div>
                  <div className={styles.hotelCheckout}>
                    5 Nights, check out 10:00am
                  </div>
                  <div className={styles.hotelAmenities}>
                    <h4>Amenities</h4>
                    <ul>
                      {tripDetails.hotel.amenities.map((amenity, index) => (
                        <li key={index}>{amenity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {tripDetails.hotel.status === "pending" ? (
                <button
                  className={styles.checkoutBtn}
                  onClick={() => handleOpenPayment(tripDetails.hotel, "hotel")}
                >
                  Checkout ${tripDetails.hotel.price}
                </button>
              ) : (
                <div className={styles.confirmedBooking}>
                  <svg
                    className={styles.checkIcon}
                    width="16"
                    height="16"
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
                  Booking Confirmed
                </div>
              )}
            </div>

            {/* Itinerary */}
            {Array.from({ length: tripDetails.totalDays }, (_, i) => i + 1).map(
              (day) => (
                <DroppableDay
                  key={`day-${day}`}
                  day={day}
                  date={tripDates[day - 1]}
                  activities={dayActivities[day] || []}
                  onDrop={handleDrop}
                  onRemove={handleRemoveActivity}
                  onCheckout={handleOpenPayment}
                />
              )
            )}
          </div>

          {/* Right Section - Recommendations */}
          <div className={styles.recommendationsSection}>
            <div className={styles.recommendationsHeader}>
              <h2>WTS Recommendations</h2>
              <div className={styles.recommendationsSearch}>
                <input
                  type="text"
                  placeholder="Customize your journey with..."
                  className={styles.searchInput}
                />
                <button className={styles.searchBtn}>Search</button>
              </div>
            </div>
            <div className={styles.recommendationsList}>
              {recommendations.map((recommendation, index) => (
                <div key={index} className={styles.recommendationCard}>
                  <DraggableActivity
                    activity={recommendation}
                    index={index}
                    origin="recommendations"
                    onAddToDay={handleAddToDay}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        item={selectedItem}
        onPaymentComplete={handlePaymentComplete}
      />
    </DndProvider>
  );
};

export default TripItineraryPage;
