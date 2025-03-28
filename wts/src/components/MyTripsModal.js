// components/MyTripsModal.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './MyTripsModal.module.css';

const MyTripsModal = ({ isOpen, onClose, trips, onSaveTrip, onCancelTrip, newTripData }) => {
  const [editedTrips, setEditedTrips] = useState([]);
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
  const [editMode, setEditMode] = useState(null);
  
  // Initialize with a copy of the trips and add the new trip if provided
  useEffect(() => {
    if (trips) {
      let updatedTrips = [...trips];
      
      // Add new trip if it exists
      if (newTripData) {
        const newId = trips.length > 0 ? Math.max(...trips.map(trip => trip.id)) + 1 : 1;
        const newTrip = {
          ...newTripData,
          id: newId
        };
        updatedTrips = [...updatedTrips, newTrip];
        
        // Select the new trip for possible renaming
        setSelectedTripIndex(updatedTrips.length - 1);
      }
      
      setEditedTrips(updatedTrips);
    }
  }, [trips, newTripData]);
  
  const saveTripsToLocalStorage = (trips) => {
    try {
      localStorage.setItem('savedTrips', JSON.stringify(trips));
    } catch (error) {
      console.error('Error saving trips to localStorage:', error);
    }
  };
  
  const handleTripNameChange = (index, newName) => {
    const updatedTrips = [...editedTrips];
    updatedTrips[index] = {
      ...updatedTrips[index],
      destination: newName
    };
    setEditedTrips(updatedTrips);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>MY TRIPS</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.tripsList}>
          {editedTrips.map((trip, index) => (
            <div 
              key={index} 
              className={`${styles.tripCard} ${selectedTripIndex === index ? styles.selected : ''}`}
              onClick={() => {
                setSelectedTripIndex(index);
                setEditMode(null);
              }}
            >
              <div className={styles.tripInfo}>
                {editMode === index ? (
                  <input
                    type="text"
                    className={styles.tripNameInput}
                    value={trip.destination}
                    onChange={(e) => handleTripNameChange(index, e.target.value)}
                    autoFocus
                    onBlur={() => setEditMode(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setEditMode(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <h3 
                    className={styles.tripDestination}
                    onDoubleClick={() => {
                      setSelectedTripIndex(index);
                      setEditMode(index);
                    }}
                  >
                    {trip.destination}
                  </h3>
                )}
                <p className={styles.tripDates}>{trip.dates}</p>
              </div>
              <div className={styles.tripImageContainer}>
                <Image 
                  src={trip.image} 
                  alt={trip.destination} 
                  width={100} 
                  height={70} 
                  className={styles.tripImage}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.modalActions}>
          {selectedTripIndex !== null && (
            <button 
              className={styles.renameButton}
              onClick={() => setEditMode(selectedTripIndex)}
            >
              Rename
            </button>
          )}
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelButton} 
            onClick={() => {
              if (selectedTripIndex !== null) {
                onCancelTrip(selectedTripIndex);
                // Update our local state
                const updatedTrips = [...editedTrips];
                updatedTrips.splice(selectedTripIndex, 1);
                setEditedTrips(updatedTrips);
                setSelectedTripIndex(null);
              }
            }}
            disabled={selectedTripIndex === null}
          >
            Cancel
          </button>
          <button 
            className={styles.saveButton}
            onClick={() => {
              // Save to parent component
              onSaveTrip(editedTrips);
              // Save to localStorage for homepage to access
              saveTripsToLocalStorage(editedTrips);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyTripsModal;
