// app/search/page.js
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TripDetailModal from "../../components/TripDetailModal";
import styles from "./search.module.css";

// SearchContent component that uses useSearchParams
const SearchContent = () => {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination") || "";
  const [searchQuery, setSearchQuery] = useState(destination);
  const [activeTab, setActiveTab] = useState("destinations");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Sample trip data for the modal
  const tripDetails = {
    destination: "Tokyo, Japan",
    startDate: "", // Will be populated from the selected listing
    endDate: "", // Will be populated from the selected listing
    flightPrice: 859,
    hotel: {
      name: "VIA INN PRIME AKASAKA",
      location: "2-Chome-6-7 Akasaka, Minato, Akasaka 107-0052, Japan",
      image: "/tokyo-hotel.jpg",
      nights: "", // Will be calculated based on selected listing dates
      checkoutTime: "10:00am",
      amenities: ["Onsen", "Luggage Storage", "Free WiFi"],
      pax: 1,
      price: 769,
    },
  };

  // Mock data for different tabs
  const mockListings = {
    destinations: [
      {
        id: 1,
        title: "Tokyo, Japan",
        subTitle: "4D3N",
        dates: "13 Feb - 16 Feb",
        price: 899,
        image: "/tokyo-listing1.jpg",
      },
      {
        id: 2,
        title: "Tokyo, Japan",
        subTitle: "5D4N",
        dates: "15 Feb - 19 Feb",
        price: 1099,
        image: "/tokyo-listing1.jpg",
      },
      {
        id: 3,
        title: "Tokyo, Japan",
        subTitle: "6D5N",
        dates: "20 Feb - 25 Feb",
        price: 1299,
        image: "/tokyo-listing1.jpg",
      },
      {
        id: 4,
        title: "Tokyo, Japan",
        subTitle: "7D6N",
        dates: "22 Feb - 28 Feb",
        price: 1499,
        image: "/tokyo-listing1.jpg",
      },
      {
        id: 5,
        title: "Tokyo, Japan",
        subTitle: "4D3N",
        dates: "1 Mar - 4 Mar",
        price: 899,
        image: "/tokyo-listing1.jpg",
      },
      {
        id: 6,
        title: "Tokyo, Japan",
        subTitle: "5D4N",
        dates: "5 Mar - 9 Mar",
        price: 1099,
        image: "/tokyo-listing1.jpg",
      },
      {
        id: 7,
        title: "Tokyo, Japan",
        subTitle: "6D5N",
        dates: "10 Mar - 15 Mar",
        price: 1299,
        image: "/tokyo-listing1.jpg",
      },
      {
        id: 8,
        title: "Tokyo, Japan",
        subTitle: "7D6N",
        dates: "15 Mar - 21 Mar",
        price: 1499,
        image: "/tokyo-listing1.jpg",
      },
    ],
    themes: [
      {
        id: 1,
        title: "Cherry Blossom, Tokyo",
        subTitle: "5D4N",
        dates: "25 Mar - 29 Mar",
        price: 1299,
        image: "/tokyo-theme1.jpg",
      },
      {
        id: 2,
        title: "Cultural Tokyo",
        subTitle: "6D5N",
        dates: "18 Feb - 23 Feb",
        price: 1199,
        image: "/tokyo-theme1.jpg",
      },
      {
        id: 3,
        title: "Tokyo Food Tour",
        subTitle: "4D3N",
        dates: "5 Mar - 8 Mar",
        price: 999,
        image: "/tokyo-theme1.jpg",
      },
      {
        id: 4,
        title: "Tokyo Shopping",
        subTitle: "5D4N",
        dates: "12 Mar - 16 Mar",
        price: 1099,
        image: "/tokyo-theme1.jpg",
      },
      {
        id: 5,
        title: "Tokyo Anime Tour",
        subTitle: "6D5N",
        dates: "20 Mar - 25 Mar",
        price: 1299,
        image: "/tokyo-theme1.jpg",
      },
      {
        id: 6,
        title: "Mt. Fuji & Tokyo",
        subTitle: "7D6N",
        dates: "15 Feb - 21 Feb",
        price: 1499,
        image: "/tokyo-theme1.jpg",
      },
      {
        id: 7,
        title: "Tokyo Disneyland",
        subTitle: "5D4N",
        dates: "22 Feb - 26 Feb",
        price: 1199,
        image: "/tokyo-theme1.jpg",
      },
      {
        id: 8,
        title: "Tokyo Technology",
        subTitle: "4D3N",
        dates: "10 Mar - 13 Mar",
        price: 999,
        image: "/tokyo-theme1.jpg",
      },
    ],
    "free-easy": [
      {
        id: 1,
        title: "Tokyo Free & Easy",
        subTitle: "4D3N",
        dates: "13 Feb - 16 Feb",
        price: 799,
        image: "/tokyo-free1.jpg",
      },
      {
        id: 2,
        title: "Tokyo Free & Easy",
        subTitle: "5D4N",
        dates: "15 Feb - 19 Feb",
        price: 899,
        image: "/tokyo-free1.jpg",
      },
      {
        id: 3,
        title: "Tokyo Free & Easy",
        subTitle: "6D5N",
        dates: "20 Feb - 25 Feb",
        price: 999,
        image: "/tokyo-free1.jpg",
      },
      {
        id: 4,
        title: "Tokyo Free & Easy",
        subTitle: "7D6N",
        dates: "22 Feb - 28 Feb",
        price: 1099,
        image: "/tokyo-free1.jpg",
      },
      {
        id: 5,
        title: "Tokyo Free & Easy",
        subTitle: "4D3N",
        dates: "1 Mar - 4 Mar",
        price: 799,
        image: "/tokyo-free1.jpg",
      },
      {
        id: 6,
        title: "Tokyo Free & Easy",
        subTitle: "5D4N",
        dates: "5 Mar - 9 Mar",
        price: 899,
        image: "/tokyo-free1.jpg",
      },
      {
        id: 7,
        title: "Tokyo Free & Easy",
        subTitle: "6D5N",
        dates: "10 Mar - 15 Mar",
        price: 999,
        image: "/tokyo-free1.jpg",
      },
      {
        id: 8,
        title: "Tokyo Free & Easy",
        subTitle: "7D6N",
        dates: "15 Mar - 21 Mar",
        price: 1099,
        image: "/tokyo-free1.jpg",
      },
    ],
    activities: [
      {
        id: 1,
        title: "Tokyo Skytree Tour",
        subTitle: "1 Day",
        dates: "Available Daily",
        price: 99,
        image: "/tokyo-activity1.jpg",
      },
      {
        id: 2,
        title: "Tokyo Disneyland",
        subTitle: "1 Day",
        dates: "Available Daily",
        price: 149,
        image: "/tokyo-activity1.jpg",
      },
      {
        id: 3,
        title: "Mt. Fuji Day Trip",
        subTitle: "1 Day",
        dates: "Available Daily",
        price: 129,
        image: "/tokyo-activity1.jpg",
      },
      {
        id: 4,
        title: "Tsukiji Fish Market",
        subTitle: "1/2 Day",
        dates: "Available Daily",
        price: 79,
        image: "/tokyo-activity1.jpg",
      },
      {
        id: 5,
        title: "Tokyo Anime Tour",
        subTitle: "1 Day",
        dates: "Available Daily",
        price: 89,
        image: "/tokyo-activity1.jpg",
      },
      {
        id: 6,
        title: "Robot Restaurant",
        subTitle: "Evening",
        dates: "Available Daily",
        price: 119,
        image: "/tokyo-activity1.jpg",
      },
      {
        id: 7,
        title: "Samurai Experience",
        subTitle: "1/2 Day",
        dates: "Available Daily",
        price: 99,
        image: "/tokyo-activity1.jpg",
      },
      {
        id: 8,
        title: "Sumo Wrestling",
        subTitle: "1/2 Day",
        dates: "Selected Days",
        price: 109,
        image: "/tokyo-activity1.jpg",
      },
    ],
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real application, this would navigate to a new search
    // For demo purposes, we'll just keep the current view
    console.log("Searching for:", searchQuery);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleCardClick = (listing) => {
    // Extract dates from the listing (format: "DD MMM - DD MMM")
    const dateParts = listing.dates.split(" - ");
    const startDate = dateParts[0];
    const endDate = dateParts[1];

    // Calculate nights based on dates
    let nights = "";
    if (dateParts.length === 2) {
      // Parse dates to get night count
      const startParts = startDate.split(" ");
      const endParts = endDate.split(" ");

      if (startParts.length >= 1 && endParts.length >= 1) {
        const startDay = parseInt(startParts[0]);
        const endDay = parseInt(endParts[0]);
        const nights = endDay - startDay;

        if (!isNaN(nights) && nights > 0) {
          listing.nights = `${nights} ${nights === 1 ? "Night" : "Nights"}`;
        } else {
          listing.nights = "5 Nights"; // Default fallback
        }
      }
    } else {
      listing.nights = "5 Nights"; // Default fallback
    }

    // Update trip details with the selected listing's information
    setSelectedTrip({
      ...tripDetails,
      title: listing.title,
      subTitle: listing.subTitle,
      startDate: startDate,
      endDate: endDate,
      dates: listing.dates,
      image: listing.image,
      hotel: {
        ...tripDetails.hotel,
        nights: listing.nights || "5 Nights",
      },
    });

    setIsModalOpen(true);
  };

  // Pass saved trips data between components
  const handleTripCreation = (newTrip) => {
    // In a real app, this would be stored in a global state or database
    // For now, just store in localStorage to persist between page navigations
    try {
      // Get existing trips from localStorage
      const existingTripsStr = localStorage.getItem("savedTrips");
      let existingTrips = existingTripsStr ? JSON.parse(existingTripsStr) : [];

      // Generate a new ID for the trip
      const newId =
        existingTrips.length > 0
          ? Math.max(...existingTrips.map((trip) => trip.id)) + 1
          : 1;

      // Add the new trip
      const tripToSave = {
        ...newTrip,
        id: newId,
      };

      existingTrips.push(tripToSave);

      // Save back to localStorage
      localStorage.setItem("savedTrips", JSON.stringify(existingTrips));

      console.log("Trip saved to localStorage:", tripToSave);
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Search Bar */}
      <div className={styles.searchBarContainer}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="e.g. Turkey"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
          <button type="button" className={styles.filterButton}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4h16v2.5H4V4zm0 7h16v2.5H4V11zm0 7h16v2.5H4V18z"
                fill="currentColor"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div
          className={`${styles.tab} ${
            activeTab === "destinations" ? styles.activeTab : ""
          }`}
          onClick={() => switchTab("destinations")}
        >
          Destinations
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "themes" ? styles.activeTab : ""
          }`}
          onClick={() => switchTab("themes")}
        >
          Themes
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "free-easy" ? styles.activeTab : ""
          }`}
          onClick={() => switchTab("free-easy")}
        >
          Free & Easy
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "activities" ? styles.activeTab : ""
          }`}
          onClick={() => switchTab("activities")}
        >
          Activities
        </div>
      </div>

      {/* Listings Grid */}
      <div className={styles.listingsGrid}>
        {mockListings[activeTab].map((listing) => (
          <div
            key={listing.id}
            className={styles.listingCard}
            onClick={() => handleCardClick(listing)}
          >
            <div className={styles.listingImageContainer}>
              <Image
                src={listing.image}
                alt={listing.title}
                width={300}
                height={200}
                className={styles.listingImage}
              />
              <div className={styles.listingInfo}>
                <h3 className={styles.listingTitle}>{listing.title}</h3>
                <p className={styles.listingSubtitle}>{listing.subTitle}</p>
              </div>
            </div>
            <div className={styles.listingDetails}>
              <div className={styles.listingDates}>
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
                <span>{listing.dates}</span>
              </div>
              <div className={styles.listingPrice}>From ${listing.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trip Detail Modal */}
      <TripDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        tripData={selectedTrip}
        onTripCreated={handleTripCreation}
      />
    </>
  );
};

// Main search page component with suspense boundary
export default function SearchResults() {
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

      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <Image
          src="/japan-banner.jpg"
          alt="Japan Mountains"
          width={1200}
          height={300}
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>Explore with WTS</h1>
        </div>
      </div>

      {/* Wrap the component using useSearchParams in Suspense boundary */}
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading search results...</p>
          </div>
        }
      >
        <SearchContent />
      </Suspense>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInfo}>
          <p>WTS Travel & Tours Pte Ltd</p>
          <p>旅行社牌照号码 Travel Agent License Number: TA02307</p>
          <p>Copyright 2025©</p>
          <p>All rights reserved.</p>
        </div>
        <div className={styles.footerPartner}>
          <p>A subsidiary of:</p>
          <div className={styles.transportLogo}>
            <Image
              src="/woodlands-transport-logo.png"
              alt="Woodlands Transport"
              width={50}
              height={50}
            />
          </div>
        </div>
        <div className={styles.chatButton}>
          <button className={styles.chatIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
