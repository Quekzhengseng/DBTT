"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./trip.module.css";

// Updated DraggableActivity component with star ratings
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
        rating: activity.rating, // Make sure to include rating in the dragged item
        origin,
        day,
      }),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      options: { dropEffect: "move" },
    }),
    [activity, origin, day]
  );

  // Function to render stars based on rating
  const renderStars = (rating) => {
    // Only render stars if rating exists
    if (!rating) return null;

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className={styles.ratingStars}>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={`full-${i}`}
            className={styles.starIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#FFC107"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </svg>
        ))}

        {/* Half star */}
        {halfStar && (
          <svg
            className={styles.starIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#FFC107"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
              fill="url(#half-star)"
            />
            <defs>
              <linearGradient id="half-star" x1="0" y1="0" x2="1" y2="0">
                <stop offset="50%" stopColor="#FFC107" />
                <stop offset="50%" stopColor="#e0e0e0" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            className={styles.starIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#e0e0e0"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </svg>
        ))}

        {/* Display numeric rating */}
        <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div
      ref={drag}
      className={`${styles.activity} ${isDragging ? styles.dragging : ""}`}
    >
      {/* Left column - Activity content */}
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

        {/* Add star rating display */}
        {(origin === "recommendations" || origin === "itinerary") &&
          activity.rating &&
          renderStars(activity.rating)}
      </div>

      {/* Right column - Image and checkout button */}
      <div className={styles.activityRightSection}>
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

      {origin === "itinerary" && (
        <button
          className={styles.removeButton}
          onClick={() => onRemove(activity.id, day)}
        >
          ×
        </button>
      )}

      {/* "Add to Trip" button for recommendations */}
      {origin === "recommendations" && (
        <button
          className={styles.addButton}
          onClick={() => onAddToDay(activity, 1)}
        >
          {activity.price > 0
            ? `Add to Trip ($${activity.price})`
            : "Add to Trip"}
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
  notes,
  onEditNotes,
  isEditingNotes,
  onSaveNotes,
  onCancelEdit,
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
  );

  // State for editing notes
  const [editedNotesContent, setEditedNotesContent] = useState(notes || "");

  // Update the editedNotesContent when notes prop changes
  useEffect(() => {
    setEditedNotesContent(notes || "");
  }, [notes]);

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
        <div className={styles.dayNotesHeader}>
          <h4 className={styles.dayNotesTitle}>Notes</h4>
          {isEditingNotes ? (
            <div className={styles.editButtonsGroup}>
              <button
                className={styles.saveButton}
                onClick={() => onSaveNotes(day, editedNotesContent)}
              >
                Save
              </button>
              <button className={styles.cancelButton} onClick={onCancelEdit}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              className={styles.editNotesButton}
              onClick={() => onEditNotes(day)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              Edit
            </button>
          )}
        </div>
        <div className={styles.dayNotesContent}>
          {isEditingNotes ? (
            <textarea
              className={styles.notesTextarea}
              value={editedNotesContent}
              onChange={(e) => setEditedNotesContent(e.target.value)}
              placeholder="Add your notes for this day..."
            />
          ) : (
            notes || ""
          )}
        </div>
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

  // Add a state for overall trip confirmation status
  const [isTripConfirmed, setIsTripConfirmed] = useState(false);

  // State for payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // State for pending payments calculation
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const [pendingItemsCount, setPendingItemsCount] = useState(0);

  // First, add state for tracking which day's notes are being edited
  const [editingNotesForDay, setEditingNotesForDay] = useState(null);
  const [dayNotes, setDayNotes] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });

  // Function to handle starting editing notes for a specific day
  const handleEditNotes = (day) => {
    setEditingNotesForDay(day);
  };

  // Function to save edited notes
  const handleSaveNotes = (day, newNotes) => {
    setDayNotes((prev) => ({
      ...prev,
      [day]: newNotes,
    }));

    // Save to localStorage
    localStorage.setItem(
      `notes_${tripId}`,
      JSON.stringify({
        ...dayNotes,
        [day]: newNotes,
      })
    );

    setEditingNotesForDay(null);
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingNotesForDay(null);
  };

  // Modify the useEffect to load saved notes from localStorage
  useEffect(() => {
    const savedTripDetails = localStorage.getItem(`trip_${tripId}`);
    if (savedTripDetails) {
      setTripDetails(JSON.parse(savedTripDetails));
    }

    const savedActivities = localStorage.getItem(`activities_${tripId}`);
    if (savedActivities) {
      setDayActivities(JSON.parse(savedActivities));
    }

    // Load saved notes
    const savedNotes = localStorage.getItem(`notes_${tripId}`);
    if (savedNotes) {
      setDayNotes(JSON.parse(savedNotes));
    }
  }, [tripId]);

  // State for trip details
  const [tripDetails, setTripDetails] = useState({
    id: tripId,
    title: "Relaxation Trip",
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

  const handleResetAllPurchases = () => {
    // Show a confirmation dialog
    if (
      window.confirm(
        "Are you sure you want to reset all purchases? This will mark all items as 'pending' again."
      )
    ) {
      // 1. Reset flights to pending
      const resetFlights = tripDetails.flights.map((flight) => ({
        ...flight,
        status: "pending",
      }));

      // 2. Reset hotel to pending
      const resetHotel = {
        ...tripDetails.hotel,
        status: "pending",
      };

      // 3. Update trip details with reset values
      const updatedTripDetails = {
        ...tripDetails,
        flights: resetFlights,
        hotel: resetHotel,
      };

      // 4. Save to state and localStorage
      setTripDetails(updatedTripDetails);
      localStorage.setItem(
        `trip_${tripId}`,
        JSON.stringify(updatedTripDetails)
      );

      // 5. Reset all activities with prices to pending
      const resetActivities = {};
      Object.keys(dayActivities).forEach((day) => {
        resetActivities[day] = dayActivities[day].map((activity) => {
          if (activity.price > 0) {
            return { ...activity, status: "pending" };
          }
          return activity;
        });
      });

      // 6. Save activities to state and localStorage
      setDayActivities(resetActivities);
      localStorage.setItem(
        `activities_${tripId}`,
        JSON.stringify(resetActivities)
      );

      // 7. Reset trip confirmation status
      setIsTripConfirmed(false);

      // 8. NEW CODE: Update the trip status in savedTrips from "upcoming" to "planning"
      try {
        const savedTripsStr = localStorage.getItem("savedTrips");
        if (savedTripsStr) {
          const savedTrips = JSON.parse(savedTripsStr);

          // Find and update the trip with matching ID
          const updatedSavedTrips = savedTrips.map((trip) => {
            if (trip.id.toString() === tripId) {
              return {
                ...trip,
                status: "planning", // Change status from "upcoming" to "planning"
              };
            }
            return trip;
          });

          // Save updated trips back to localStorage
          localStorage.setItem("savedTrips", JSON.stringify(updatedSavedTrips));
          console.log("Trip status reset to 'planning'");
        }
      } catch (error) {
        console.error("Error updating saved trips:", error);
      }
    }
  };

  // State for day activities
  const [dayActivities, setDayActivities] = useState({
    1: [
      {
        id: "existing-1",
        title: "Check-in at VIA INN PRIME AKASAKA",
        time: "15:00 - 16:00",
        description: "Check in and rest after flight",
        status: "confirmed",
        rating: 4.2,
      },
    ],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  });

  useEffect(() => {
    // Calculate pending amounts and count
    let total = 0;
    let count = 0;

    // Required bookings that need confirmation
    let flightsConfirmed = true;
    let hotelConfirmed = true;
    let paidActivitiesConfirmed = true;

    // Check flights - ALL flights must be confirmed
    tripDetails.flights.forEach((flight) => {
      if (flight.status === "pending") {
        total += flight.price;
        count++;
        flightsConfirmed = false;
      }
    });

    // Check hotel
    if (tripDetails.hotel.status === "pending") {
      total += tripDetails.hotel.price;
      count++;
      hotelConfirmed = false;
    }

    // Check activities across all days (only paid activities need confirmation)
    let hasPaidActivities = false;

    Object.values(dayActivities).forEach((activities) => {
      activities.forEach((activity) => {
        if (activity.price > 0) {
          hasPaidActivities = true;
          if (activity.status === "pending") {
            total += activity.price;
            count++;
            paidActivitiesConfirmed = false;
          }
        }
      });
    });

    // If there are no paid activities, consider activities as confirmed
    if (!hasPaidActivities) {
      paidActivitiesConfirmed = true;
    }

    setTotalPendingAmount(total);
    setPendingItemsCount(count);

    // Only set trip as confirmed if ALL required bookings are confirmed
    setIsTripConfirmed(
      flightsConfirmed && hotelConfirmed && paidActivitiesConfirmed
    );
  }, [tripDetails, dayActivities]);

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

  // Recommended activities
  const [recommendations, setRecommendations] = useState([
    {
      id: "rec-1",
      title: "TeamLab Borderless",
      description: "Digital art museum with immersive experiences",
      image: "/teamlab.jpg",
      price: 35,
      duration: "2-3 hours",
      time: "10:00 - 13:00",
      rating: 4.7,
    },
    {
      id: "rec-2",
      title: "Sanrio Puroland Tokyo",
      description: "Indoor theme park featuring Hello Kitty and friends",
      image: "/sanrio.jpg",
      price: 45,
      duration: "4-5 hours",
      time: "10:00 - 15:00",
      rating: 4.5,
    },
    {
      id: "rec-3",
      title: "Mt Fuji One Day Trip",
      description: "Day trip to Japan's iconic mountain",
      image: "/mtfuji.jpg",
      price: 125,
      duration: "Full day",
      time: "08:00 - 18:00",
      rating: 4.6,
    },
    {
      id: "rec-4",
      title: "TeamLab Planets",
      description: "Another digital art installation by TeamLab",
      image: "/teamlab-planets.jpg",
      price: 35,
      duration: "2-3 hours",
      time: "13:00 - 16:00",
      rating: 4.7,
    },
    {
      id: "rec-5",
      title: "Tokyo Tower",
      description: "Iconic Tokyo landmark with observation decks",
      image: "/tokyo-tower.jpg",
      price: 25,
      duration: "2-3 hours",
      time: "11:00 - 14:00",
      rating: 4.5,
    },
    {
      id: "rec-6",
      title: "Tsukiji Fish Market",
      description: "Famous fish market with delicious food stalls",
      image: "/tsukiji.jpg",
      price: 0,
      duration: "3-4 hours",
      time: "06:00 - 10:00",
      rating: 4.6,
    },
    {
      id: "rec-7",
      title: "Tokyo Disneyland",
      description: 'Enjoy the "happiest place on Earth" for a full day',
      image: "/tokyo-disneyland.jpg",
      duration: "11 hours",
      time: "09:00 - 20:00",
      price: 110,
      rating: 4.5,
    },
    {
      id: "rec-8",
      title: "Shibuya Sky",
      description: "Observation deck with an excellent view of Tokyo",
      image: "/shibuya-sky.jpg",
      duration: "2.5 hours",
      time: "15:00 - 17:30",
      price: 100,
      rating: 5,
    },
    {
      id: "rec-9",
      title: "Meiji Jingu Tour",
      description: "Dedicated to Emperor Meiji and Empress Shoken",
      image: "/meiji-jingu.jpg",
      duration: "4.5 hours",
      time: "09:30 - 14:00",
      price: 100,
      rating: 3.8,
    },
    {
      id: "rec-10",
      title: "Tokyo Imperial Palace",
      description: "Visit the primary residence of the Emperor of Japan",
      image: "/tokyo-palace.jpg",
      price: 0,
      time: "09:00 - 11:30",
      rating: 4,
    },
    {
      id: "rec-11",
      title: "Shopping at Shibuya",
      description: "Visit the famous crossing and enjoy shopping",
      image: "/shibuya.jpg",
      price: 0,
      time: "14:00 - 17:00",
      rating: 4.7,
    },
  ]);

  const [addedActivities, setAddedActivities] = useState([
    {
      id: "added-1",
      title: "Sensoji Temple",
      description: "Tokyo's oldest temple with iconic red lantern",
      image: "/sensoji-detail.jpg",
      price: 0,
      duration: "2 hours",
      rating: 4.8,
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

        const updatedTripDetails = {
          ...prev,
          flights: updatedFlights,
        };

        // Save to localStorage
        localStorage.setItem(
          `trip_${tripId}`,
          JSON.stringify(updatedTripDetails)
        );

        return updatedTripDetails;
      });
    } else if (itemType === "hotel") {
      // Update hotel status
      setTripDetails((prev) => {
        const updatedTripDetails = {
          ...prev,
          hotel: {
            ...prev.hotel,
            status: "confirmed",
          },
        };

        // Save to localStorage
        localStorage.setItem(
          `trip_${tripId}`,
          JSON.stringify(updatedTripDetails)
        );

        return updatedTripDetails;
      });
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

          // Save to localStorage
          localStorage.setItem(
            `activities_${tripId}`,
            JSON.stringify(updatedActivities)
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

        // Save to localStorage after update
        localStorage.setItem(
          `activities_${tripId}`,
          JSON.stringify(updatedActivities)
        );

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

        // Save to localStorage after update
        localStorage.setItem(
          `activities_${tripId}`,
          JSON.stringify(updatedActivities)
        );

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

      // Save to localStorage after update
      localStorage.setItem(
        `activities_${tripId}`,
        JSON.stringify(updatedActivities)
      );

      return updatedActivities;
    });
  };

  // Handle remove activity from a day
  const handleRemoveActivity = (activityId, day) => {
    setDayActivities((prev) => {
      const updatedActivities = {
        ...prev,
        [day]: prev[day].filter((activity) => activity.id !== activityId),
      };

      // Save to localStorage after update
      localStorage.setItem(
        `activities_${tripId}`,
        JSON.stringify(updatedActivities)
      );

      return updatedActivities;
    });
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
            <h1>
              Tokyo 2025
              {isTripConfirmed && (
                <span className={styles.tripConfirmedStatus}>
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
                </span>
              )}
            </h1>
            <div className={styles.tripTags}>
              <span className={styles.tag}>Free & Easy</span>
              <span className={styles.tag}>Family</span>
            </div>
          </div>
          <div className={styles.tripActions}>
            <button
              className={styles.resetBtn}
              onClick={handleResetAllPurchases}
            >
              Reset Purchases
            </button>
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
                    <div className={styles.airlineLogo}>
                      <Image
                        src="/singapore-airlines-logo.png"
                        alt="Singapore Airlines"
                        width={40}
                        height={40}
                        className={styles.logoImage}
                      />
                    </div>
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
                  </div>
                </div>

                {/* Return Flight */}
                <div className={styles.flight}>
                  <div className={styles.flightDate}>28 Feb 2025</div>
                  <div className={styles.flightDetails}>
                    <div className={styles.airlineLogo}>
                      <Image
                        src="/singapore-airlines-logo.png"
                        alt="Singapore Airlines"
                        width={40}
                        height={40}
                        className={styles.logoImage}
                      />
                    </div>
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
                </div>
              </div>

              {/* Flight checkout button - positioned at the bottom similar to hotel */}
              {tripDetails.flights[0].status === "pending" ||
              tripDetails.flights[1].status === "pending" ? (
                <button
                  className={styles.checkoutBtn}
                  onClick={() =>
                    handleOpenPayment(tripDetails.flights[0], "flight")
                  }
                >
                  Checkout ${tripDetails.flights[0].price}
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
                  notes={dayNotes[day]}
                  onEditNotes={handleEditNotes}
                  isEditingNotes={editingNotesForDay === day}
                  onSaveNotes={handleSaveNotes}
                  onCancelEdit={handleCancelEdit}
                />
              )
            )}
          </div>

          {/* Right Section - Recommendations */}
          <div className={styles.recommendationsSection}>
            {/* WTS Recommendations Container */}
            <div className={styles.sectionContainer}>
              <div className={styles.recommendationsContainer}>
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

            {/* Added Activities - As a separate container */}
            <div className={styles.sectionContainer}>
              <div className={styles.addedActivitiesContainer}>
                <div className={styles.addedActivitiesHeader}>
                  <h2>Added Activities</h2>
                </div>
                <div className={styles.recommendationsList}>
                  {addedActivities.map((activity, index) => (
                    <div key={index} className={styles.recommendationCard}>
                      <DraggableActivity
                        activity={activity}
                        index={index}
                        origin="recommendations"
                        onAddToDay={handleAddToDay}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Summary Button */}
            {pendingItemsCount > 0 && (
              <div className={styles.paymentSummarySection}>
                <div className={styles.pendingSummary}>
                  <div className={styles.pendingInfo}>
                    <div className={styles.pendingCount}>
                      {pendingItemsCount} items pending
                    </div>
                    <div className={styles.pendingAmount}>
                      ${totalPendingAmount.toFixed(2)}
                    </div>
                  </div>
                  <Link
                    href={`/payment?tripId=${tripId}`}
                    className={styles.paymentSummaryButton}
                  >
                    Make Payment
                  </Link>
                </div>
              </div>
            )}
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
