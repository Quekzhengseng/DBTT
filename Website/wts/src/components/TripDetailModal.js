// components/TripDetailModal.js
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import MyTripsModal from "./MyTripsModal";
import styles from "./TripDetailModal.module.css";

const TripDetailModal = ({ isOpen, onClose, tripData, onTripCreated }) => {
  const [selectedTab, setSelectedTab] = useState("flight");
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showPaxDropdown, setShowPaxDropdown] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Economy");
  const [selectedPax, setSelectedPax] = useState(1);
  const [showMyTripsModal, setShowMyTripsModal] = useState(false);
  const [newTrip, setNewTrip] = useState(null);
  const [savedTrips, setSavedTrips] = useState([
    {
      id: 1,
      destination: "New York City",
      dates: "5 June - 26 June",
      image: "/nyc-trip.jpg",
    },
    {
      id: 2,
      destination: "Bangkok",
      dates: "5 November - 15 November",
      image: "/bangkok-trip.jpg",
    },
  ]);

  const classOptions = ["Economy", "Business", "First Class"];
  const paxOptions = [1, 2, 3, 4, 5];

  const classRef = useRef(null);
  const paxRef = useRef(null);

  const handleSaveTrip = (updatedTrips) => {
    // In a real app, we'd call an API to save all trips
    setSavedTrips(updatedTrips);
    console.log("Saved all trips", updatedTrips);
  };

  const handleCancelTrip = (index) => {
    // Just for UI feedback - actual removal happens in MyTripsModal
    console.log(`Canceled trip at index ${index}`);
  };

  const handleCreateTrip = () => {
    // Create new trip data
    if (tripData) {
      const newTripData = {
        destination: tripData.destination,
        dates: `${tripData.startDate} - ${tripData.endDate}`,
        image: tripData.hotel.image,
      };

      // Save to localStorage for the homepage to access
      try {
        // Get existing trips
        const existingTripsStr = localStorage.getItem("savedTrips");
        let existingTrips = existingTripsStr
          ? JSON.parse(existingTripsStr)
          : [];

        // Generate new ID
        const newId =
          existingTrips.length > 0
            ? Math.max(...existingTrips.map((trip) => trip.id)) + 1
            : 1;

        // Create full trip object
        const fullTripData = {
          ...newTripData,
          id: newId,
        };

        // Add to existing trips
        existingTrips.push(fullTripData);

        // Save back to localStorage
        localStorage.setItem("savedTrips", JSON.stringify(existingTrips));

        // Notify any listeners (like the parent component)
        if (onTripCreated) {
          onTripCreated(fullTripData);
        }

        // For modal display
        setNewTrip(newTripData);
        setShowMyTripsModal(true);
      } catch (error) {
        console.error("Error saving trip:", error);
        // Still show the modal even if storage fails
        setNewTrip(newTripData);
        setShowMyTripsModal(true);
      }
    }
  };

  // Handle outside click to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (classRef.current && !classRef.current.contains(event.target)) {
        setShowClassDropdown(false);
      }

      if (paxRef.current && !paxRef.current.contains(event.target)) {
        setShowPaxDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen || !tripData) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{tripData.destination}</h2>
          <div className={styles.tripDates}>
            <svg
              className={styles.calendarIcon}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>
              {tripData.startDate} - {tripData.endDate}
            </span>
          </div>
          <button className={styles.bookNowBtn}>Book Now</button>
        </div>

        <div className={styles.tripDescription}>
          <p>
            Design your perfect Tokyo adventure with Free & Easy! Customize your
            itinerary giving you the freedom to explore the city at your own
            pace. Whether you're strolling through Ueno, Asakusa, indulging in
            local cuisine, or discovering cultural landmarks, your trip is
            tailored exactly to your preferences. Book today and start planning
            your personalized trip experience!
          </p>
        </div>

        <div className={styles.iconSection}>
          <div className={styles.flightIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 16.5H2C1.44772 16.5 1 16.0523 1 15.5C1 14.9477 1.44772 14.5 2 14.5H22C22.5523 14.5 23 14.9477 23 15.5C23 16.0523 22.5523 16.5 22 16.5Z"
                fill="currentColor"
              />
              <path
                d="M14.4999 16V20M9.5 16V20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M17.5 4H6.5C5.11929 4 4 5.11929 4 6.5V14.5H20V6.5C20 5.11929 18.8807 4 17.5 4Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div className={styles.hotelIcon}>
            <svg
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
          </div>
        </div>

        <div className={styles.tabsSection}>
          <div
            className={`${styles.tab} ${
              selectedTab === "flight" ? styles.activeTab : ""
            }`}
            onClick={() => setSelectedTab("flight")}
            ref={classRef}
          >
            <span>Class: {selectedClass}</span>
            <svg
              className={styles.dropdownIcon}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={(e) => {
                e.stopPropagation();
                setShowClassDropdown(!showClassDropdown);
                setShowPaxDropdown(false);
              }}
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {showClassDropdown && (
              <div className={styles.dropdown}>
                {classOptions.map((option) => (
                  <div
                    key={option}
                    className={styles.dropdownItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedClass(option);
                      setShowClassDropdown(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className={`${styles.tab} ${
              selectedTab === "pax" ? styles.activeTab : ""
            }`}
            onClick={() => setSelectedTab("pax")}
            ref={paxRef}
          >
            <span>Pax: {selectedPax}</span>
            <svg
              className={styles.dropdownIcon}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={(e) => {
                e.stopPropagation();
                setShowPaxDropdown(!showPaxDropdown);
                setShowClassDropdown(false);
              }}
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {showPaxDropdown && (
              <div className={styles.dropdown}>
                {paxOptions.map((option) => (
                  <div
                    key={option}
                    className={styles.dropdownItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPax(option);
                      setShowPaxDropdown(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.airlineSection}>
          <div className={styles.airlineHeader}>
            <h3 className={styles.airlineName}>
              <svg
                className={styles.airlineDropdown}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 16L5 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Singapore Airlines
            </h3>
          </div>

          <div className={styles.flightDetails}>
            <div className={styles.flightDate}>{tripData.startDate} 2025</div>
            <div className={styles.flightRow}>
              <div className={styles.flightTime}>
                <div className={styles.airlineLogo}>
                  <Image
                    src="/singapore-airlines-logo.png"
                    alt="Singapore Airlines"
                    width={24}
                    height={24}
                  />
                </div>
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

            <div className={styles.flightDate}>{tripData.endDate} 2025</div>
            <div className={styles.flightRow}>
              <div className={styles.flightTime}>
                <div className={styles.airlineLogo}>
                  <Image
                    src="/singapore-airlines-logo.png"
                    alt="Singapore Airlines"
                    width={24}
                    height={24}
                  />
                </div>
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

            <div className={styles.flightPrice}>
              <div className={styles.priceLabel}>
                Online Price ({selectedClass}):
              </div>
              <div className={styles.price}>
                $
                {selectedClass === "Economy"
                  ? tripData.flightPrice
                  : selectedClass === "Business"
                  ? Math.floor(tripData.flightPrice * 2.8)
                  : Math.floor(tripData.flightPrice * 4.5)}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.hotelSection}>
          <div className={styles.hotelHeader}>
            <h3 className={styles.hotelName}>{tripData.hotel.name}</h3>
            <div className={styles.hotelLocation}>
              <svg
                className={styles.locationIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{tripData.hotel.location}</span>
            </div>
          </div>

          <div className={styles.hotelContent}>
            <div className={styles.hotelImageContainer}>
              <Image
                src={tripData.hotel.image}
                alt={tripData.hotel.name}
                width={200}
                height={120}
                className={styles.hotelImage}
              />
            </div>
            <div className={styles.hotelInfo}>
              <div className={styles.stayDetails}>
                <div>
                  {tripData.hotel?.nights || "5 Nights"}, check out{" "}
                  {tripData.hotel?.checkoutTime}
                </div>
              </div>
              <div className={styles.amenities}>
                <h4>Amenities</h4>
                <ul className={styles.amenitiesList}>
                  {tripData.hotel.amenities.map((amenity, index) => (
                    <li key={index}>- {amenity}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.ratingContainer}>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={styles.star}>
                      ★
                    </span>
                  ))}
                </div>
                <div className={styles.paxInfo}>
                  <svg
                    className={styles.personIcon}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{selectedPax} pax</span>
                </div>
              </div>
              <div className={styles.hotelPrice}>
                <div className={styles.totalLabel}>Total:</div>
                <div className={styles.totalPrice}>
                  $
                  {Math.floor(
                    tripData.hotel.price *
                      (selectedPax > 1 ? 1 + (selectedPax - 1) * 0.7 : 1)
                  )}
                </div>
                <div className={styles.priceNote}>Change hotels</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
          <button
            className={styles.createTripButton}
            onClick={handleCreateTrip}
          >
            Create Trip
          </button>
        </div>
      </div>

      {/* My Trips Modal */}
      <MyTripsModal
        isOpen={showMyTripsModal}
        onClose={() => {
          setShowMyTripsModal(false);
          setNewTrip(null);
        }}
        trips={savedTrips}
        onSaveTrip={handleSaveTrip}
        onCancelTrip={handleCancelTrip}
        newTripData={newTrip}
      />
    </div>
  );
};

export default TripDetailModal;
