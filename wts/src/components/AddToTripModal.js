// components/AddToTripModal.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./AddToTripModal.module.css";

const AddToTripModal = ({ isOpen, onClose, activity }) => {
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
  // Mock existing trips data
  const [userTrips, setUserTrips] = useState([
    {
      id: 1,
      title: "Bangkok",
      dates: "5 November - 15 November 2025",
      image: "/bangkok-trip.jpg",
      destination: "Bangkok, Thailand",
      activities: [],
    },
    {
      id: 3,
      title: "Tokyo 2025",
      dates: "23 Feb - 28 Feb 2025",
      // image: "/tokyo-trip.jpg",
      image: "/tokyo-free3.jpg",
      destination: "Tokyo, Japan",
      activities: [],
    },
  ]);

  // Handle add to selected trip
  const handleAddToTrip = () => {
    if (selectedTripIndex !== null) {
      // In a real app, you would update your database here
      console.log(
        `Adding ${activity.title} to trip: ${userTrips[selectedTripIndex].title}`
      );

      // Show success message
      const updatedTrips = [...userTrips];
      updatedTrips[selectedTripIndex] = {
        ...updatedTrips[selectedTripIndex],
        activities: [
          ...(updatedTrips[selectedTripIndex].activities || []),
          activity,
        ],
      };

      setUserTrips(updatedTrips);

      // Close modal after adding
      setTimeout(() => {
        onClose({
          success: true,
          tripName: userTrips[selectedTripIndex].title,
        });
      }, 400);
    }
  };

  if (!isOpen || !activity) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Add to Trip</h3>
          <button
            className={styles.closeButton}
            onClick={() => onClose({ success: false })}
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.activityPreview}>
            <div className={styles.activityImageContainer}>
              {activity.image && (
                <Image
                  src={activity.image}
                  alt={activity.title}
                  width={80}
                  height={60}
                  className={styles.activityImage}
                />
              )}
            </div>
            <div className={styles.activityInfo}>
              <h4>{activity.title}</h4>
              <p className={styles.activityPrice}>{activity.price}</p>
            </div>
          </div>

          <h4 className={styles.selectTripLabel}>Select a trip:</h4>

          <div className={styles.tripsList}>
            {userTrips.map((trip, index) => (
              <div
                key={trip.id}
                className={`${styles.tripCard} ${
                  selectedTripIndex === index ? styles.selected : ""
                }`}
                onClick={() => setSelectedTripIndex(index)}
              >
                <div className={styles.tripImageContainer}>
                  <Image
                    src={trip.image}
                    alt={trip.title}
                    width={60}
                    height={45}
                    className={styles.tripImage}
                  />
                </div>
                <div className={styles.tripInfo}>
                  <h5 className={styles.tripTitle}>{trip.title}</h5>
                  <p className={styles.tripDates}>{trip.dates}</p>
                  <p className={styles.tripDestination}>{trip.destination}</p>
                </div>
                <div className={styles.selectionIndicator}>
                  {selectedTripIndex === index && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" fill="#1e56a0" />
                      <path
                        d="M8 12L11 15L16 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.modalFooter}>
            <Link href="/plan-trip" className={styles.createNewButton}>
              Create New Trip
            </Link>
            <button
              className={styles.addButton}
              disabled={selectedTripIndex === null}
              onClick={handleAddToTrip}
            >
              Add to Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToTripModal;
