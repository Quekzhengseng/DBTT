// app/page.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  // Asian destinations data
  const asianDestinations = [
    { country: "Japan", city: "Tokyo" },
    { country: "Japan", city: "Osaka" },
    { country: "Japan", city: "Kyoto" },
    { country: "South Korea", city: "Seoul" },
    { country: "South Korea", city: "Busan" },
    { country: "China", city: "Beijing" },
    { country: "China", city: "Shanghai" },
    { country: "Thailand", city: "Bangkok" },
    { country: "Thailand", city: "Phuket" },
    { country: "Thailand", city: "Chiang Mai" },
    { country: "Vietnam", city: "Hanoi" },
    { country: "Vietnam", city: "Ho Chi Minh City" },
    { country: "Indonesia", city: "Bali" },
    { country: "Indonesia", city: "Jakarta" },
    { country: "Malaysia", city: "Kuala Lumpur" },
    { country: "Singapore", city: "Singapore" },
    { country: "Philippines", city: "Manila" },
    { country: "Philippines", city: "Cebu" },
    { country: "Taiwan", city: "Taipei" },
    { country: "India", city: "New Delhi" },
    { country: "India", city: "Mumbai" },
    { country: "Hong Kong", city: "Hong Kong" },
    { country: "Cambodia", city: "Phnom Penh" },
    { country: "Cambodia", city: "Siem Reap" },
  ];

  const [destinationInput, setDestinationInput] = useState("");
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState("all");

  // Date picker states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isPlanning, setIsPlanning] = useState(false);

  const startCalendarRef = useRef(null);
  const endCalendarRef = useRef(null);

  const router = useRouter();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Handle outside click to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }

      if (
        startCalendarRef.current &&
        !startCalendarRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.dateInput}`)
      ) {
        setShowStartCalendar(false);
      }

      if (
        endCalendarRef.current &&
        !endCalendarRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.dateInput}`)
      ) {
        setShowEndCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [styles.dateInput]);

  // Filter destinations based on input
  const handleDestinationInput = (e) => {
    const input = e.target.value;
    setDestinationInput(input);

    if (input.length < 1) {
      setFilteredDestinations([]);
      return;
    }

    const filtered = asianDestinations.filter(
      (dest) =>
        dest.country.toLowerCase().includes(input.toLowerCase()) ||
        dest.city.toLowerCase().includes(input.toLowerCase())
    );

    setFilteredDestinations(filtered);
    setShowDropdown(true);
  };

  // Select destination from dropdown
  const selectDestination = (destination) => {
    setDestinationInput(`${destination.city}, ${destination.country}`);
    setShowDropdown(false);
  };

  // Calendar functions
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}/${
      month < 10 ? "0" + month : month
    }/${year}`;
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysArray = [];

    // Add days from previous month
    const firstDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(
        currentYear,
        currentMonth - 1,
        prevMonthLastDay - i
      );
      daysArray.push({ date, currentMonth: false });
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(currentYear, currentMonth, i);
      daysArray.push({ date, currentMonth: true });
    }

    // Add days from next month
    const daysFromNextMonth = 42 - daysArray.length; // 6 rows x 7 days
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      daysArray.push({ date, currentMonth: false });
    }

    return daysArray;
  };

  const changeMonth = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const selectStartDate = (date) => {
    setStartDate(date);
    setShowStartCalendar(false);

    // If end date is before start date, reset it
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const selectEndDate = (date) => {
    // Only allow selecting end date after start date
    if (startDate && date >= startDate) {
      setEndDate(date);
      setShowEndCalendar(false);
    } else if (!startDate) {
      // If no start date is selected, set this as start date
      setStartDate(date);
      setShowEndCalendar(false);
      setShowStartCalendar(false);
    }
  };

  // Handle form submission
  const handleStartPlanning = () => {
    setIsPlanning(true);

    // Navigate to search page with the destination as a query parameter
    router.push(`/search?destination=${encodeURIComponent(destinationInput)}`);
  };

  // Sample saved trips (in a real app, this would be from API)
  const [savedTrips, setSavedTrips] = useState([
    {
      id: 1,
      destination: "Bangkok",
      dates: "5 November - 15 November",
      image: "/bangkok-trip.jpg",
    },
  ]);

  // Load saved trips from localStorage
  useEffect(() => {
    try {
      const savedTripsStr = localStorage.getItem("savedTrips");
      console.log(savedTripsStr);
      if (savedTripsStr) {
        const loadedTrips = JSON.parse(savedTripsStr);
        if (Array.isArray(loadedTrips) && loadedTrips.length > 0) {
          // Add status to trips if not present
          const tripsWithStatus = loadedTrips.map((trip) => {
            if (!trip.status) {
              // Simple logic to determine status based on dates
              const now = new Date();

              // Extract dates from string format "5 November - 15 November"
              const datesParts = trip.dates.split(" - ");
              const startDateStr = datesParts[0];
              const endDateStr = datesParts[1] || startDateStr;

              // Simple parsing - assumes format like "5 November"
              const startDateParts = startDateStr.split(" ");
              const endDateParts = endDateStr.split(" ");

              const startDate = new Date(
                `${startDateParts[1]} ${
                  startDateParts[0]
                }, ${new Date().getFullYear()}`
              );
              const endDate = new Date(
                `${endDateParts[1]} ${
                  endDateParts[0]
                }, ${new Date().getFullYear()}`
              );

              // Determine status
              let status = "planning";
              if (endDate < now) {
                status = "completed";
              } else if (startDate <= now && endDate >= now) {
                status = "upcoming";
              }

              return { ...trip, status };
            }
            return trip;
          });

          setSavedTrips(tripsWithStatus);

          // Save back to localStorage with status
          localStorage.setItem("savedTrips", JSON.stringify(tripsWithStatus));
          console.log(localStorage);
        }
      }
    } catch (error) {
      console.error("Error loading saved trips:", error);
    }
  }, []);
  return (
    <div>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/wts-logo.png"
            alt="WTS Travel Logo"
            width={200}
            height={40}
          />
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
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Explore by destination"
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
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
      <section className={styles.planTrip}>
        <h1 className={styles.planTripTitle}>Plan a trip!</h1>
        <div className={styles.planTripForm}>
          <div className={styles.formGroup}>
            <label htmlFor="destination">Where to?</label>
            <div className={styles.autocompleteContainer} ref={dropdownRef}>
              <input
                type="text"
                id="destination"
                placeholder="e.g. Bali, Vietnam, Korea"
                className={styles.formInput}
                onChange={handleDestinationInput}
                onFocus={() => setShowDropdown(true)}
                value={destinationInput}
              />
              {showDropdown && filteredDestinations.length > 0 && (
                <ul className={styles.dropdown}>
                  {filteredDestinations.map((dest, index) => (
                    <li
                      key={index}
                      className={styles.dropdownItem}
                      onClick={() => selectDestination(dest)}
                    >
                      <span className={styles.destinationCity}>
                        {dest.city}
                      </span>
                      <span className={styles.destinationCountry}>
                        {dest.country}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dates">Dates</label>
            <div className={styles.dateInputs}>
              <div className={styles.datePickerContainer}>
                <div
                  className={styles.dateInput}
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                >
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
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={startDate ? formatDate(startDate) : ""}
                    readOnly
                  />
                </div>
                {showStartCalendar && (
                  <div className={styles.calendar} ref={startCalendarRef}>
                    <div className={styles.calendarHeader}>
                      <button onClick={() => changeMonth(-1)}>&lt;</button>
                      <span>
                        {monthNames[currentMonth]} {currentYear}
                      </span>
                      <button onClick={() => changeMonth(1)}>&gt;</button>
                    </div>
                    <div className={styles.weekdays}>
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className={styles.weekday}>
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className={styles.days}>
                      {generateCalendarDays().map((day, index) => (
                        <div
                          key={index}
                          className={`${styles.day} ${
                            day.currentMonth ? "" : styles.otherMonth
                          } ${
                            day.date.toDateString() ===
                            new Date().toDateString()
                              ? styles.today
                              : ""
                          } ${
                            startDate &&
                            day.date.toDateString() === startDate.toDateString()
                              ? styles.selected
                              : ""
                          } ${
                            endDate &&
                            day.date > startDate &&
                            day.date < endDate
                              ? styles.inRange
                              : ""
                          }`}
                          onClick={() => selectStartDate(day.date)}
                        >
                          {day.date.getDate()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.datePickerContainer}>
                <div
                  className={styles.dateInput}
                  onClick={() => setShowEndCalendar(!showEndCalendar)}
                >
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
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="End Date"
                    value={endDate ? formatDate(endDate) : ""}
                    readOnly
                  />
                </div>
                {showEndCalendar && (
                  <div className={styles.calendar} ref={endCalendarRef}>
                    <div className={styles.calendarHeader}>
                      <button onClick={() => changeMonth(-1)}>&lt;</button>
                      <span>
                        {monthNames[currentMonth]} {currentYear}
                      </span>
                      <button onClick={() => changeMonth(1)}>&gt;</button>
                    </div>
                    <div className={styles.weekdays}>
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className={styles.weekday}>
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className={styles.days}>
                      {generateCalendarDays().map((day, index) => (
                        <div
                          key={index}
                          className={`${styles.day} ${
                            day.currentMonth ? "" : styles.otherMonth
                          } ${
                            day.date.toDateString() ===
                            new Date().toDateString()
                              ? styles.today
                              : ""
                          } ${
                            endDate &&
                            day.date.toDateString() === endDate.toDateString()
                              ? styles.selected
                              : ""
                          } ${
                            startDate &&
                            endDate &&
                            day.date > startDate &&
                            day.date < endDate
                              ? styles.inRange
                              : ""
                          }`}
                          onClick={() => selectEndDate(day.date)}
                        >
                          {day.date.getDate()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            className={styles.planButton}
            onClick={handleStartPlanning}
            disabled={!destinationInput}
          >
            {isPlanning ? "Planning..." : "Start planning!"}
          </button>
        </div>
      </section>
      <div className={styles.container}>
        {/* Main Content */}
        <main className={styles.main}>
          {/* Packages Section */}
          <h2 className={styles.sectionTitle}>Recommended For You</h2>
          <section className={styles.packagesSection}>
            <div className={styles.packageSlider}>
              <button className={styles.sliderButton + " " + styles.prevButton}>
                ‹
              </button>
              <div className={styles.packages}>
                <div className={styles.package}>
                  <div className={styles.packageImageContainer}>
                    <Image
                      src="/meiji-shrine-detail.jpg"
                      alt="Meiji Shrine"
                      width={200}
                      height={150}
                      className={styles.packageImage}
                    />
                    <div className={styles.packagePrice}>$45</div>
                  </div>
                  <div className={styles.packageInfo}>
                    <h3>Meiji Shrine</h3>
                    <p>Tokyo, Japan</p>
                    <div className={styles.packageRating}>
                      <div className={styles.stars}>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.halfStar}>★</span>
                      </div>
                      <span className={styles.ratingCount}>4.5 (128)</span>
                    </div>
                  </div>
                </div>
                <div className={styles.package}>
                  <div className={styles.packageImageContainer}>
                    <Image
                      src="/asakusa-temple.jpg"
                      alt="Asakusa Temple"
                      width={200}
                      height={150}
                      className={styles.packageImage}
                    />
                    <div className={styles.packagePrice}>$30</div>
                  </div>
                  <div className={styles.packageInfo}>
                    <h3>Asakusa Temple</h3>
                    <p>Tokyo, Japan</p>
                    <div className={styles.packageRating}>
                      <div className={styles.stars}>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.emptyStar}>★</span>
                      </div>
                      <span className={styles.ratingCount}>4.0 (96)</span>
                    </div>
                  </div>
                </div>
                <div className={styles.package}>
                  <div className={styles.packageImageContainer}>
                    <Image
                      src="/qilong-temple.jpg"
                      alt="Qilong Temple"
                      width={200}
                      height={150}
                      className={styles.packageImage}
                    />
                    <div className={styles.packagePrice}>$55</div>
                  </div>
                  <div className={styles.packageInfo}>
                    <h3>Qilong Temple</h3>
                    <p>Beijing, China</p>
                    <div className={styles.packageRating}>
                      <div className={styles.stars}>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.halfStar}>★</span>
                      </div>
                      <span className={styles.ratingCount}>4.7 (84)</span>
                    </div>
                  </div>
                </div>
                <div className={styles.package}>
                  <div className={styles.packageImageContainer}>
                    <Image
                      src="/meenakshi-temple.jpg"
                      alt="Meenakshi Temple"
                      width={200}
                      height={150}
                      className={styles.packageImage}
                    />
                    <div className={styles.packagePrice}>$65</div>
                  </div>
                  <div className={styles.packageInfo}>
                    <h3>Meenakshi Temple</h3>
                    <p>Madurai, India</p>
                    <div className={styles.packageRating}>
                      <div className={styles.stars}>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                        <span className={styles.filledStar}>★</span>
                      </div>
                      <span className={styles.ratingCount}>4.9 (112)</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className={styles.sliderButton + " " + styles.nextButton}>
                ›
              </button>
            </div>
          </section>

          {/* Two Column Section */}
          <div className={styles.twoColumnSection}>
            {/* My Trips Section */}
            <section>
              <h2 className={styles.sectionTitle}>My Trips</h2>
              <div className={styles.myTripsSection}>
                {/* Trip filter buttons */}
                <div className={styles.tripFilters}>
                  <button
                    className={`${styles.filterButton} ${
                      activeFilter === "all" ? styles.activeFilter : ""
                    }`}
                    onClick={() => setActiveFilter("all")}
                  >
                    All
                  </button>
                  <button
                    className={`${styles.filterButton} ${
                      activeFilter === "planning" ? styles.activeFilter : ""
                    }`}
                    onClick={() => setActiveFilter("planning")}
                  >
                    Planning
                  </button>
                  <button
                    className={`${styles.filterButton} ${
                      activeFilter === "upcoming" ? styles.activeFilter : ""
                    }`}
                    onClick={() => setActiveFilter("upcoming")}
                  >
                    Upcoming
                  </button>
                  <button
                    className={`${styles.filterButton} ${
                      activeFilter === "completed" ? styles.activeFilter : ""
                    }`}
                    onClick={() => setActiveFilter("completed")}
                  >
                    Completed
                  </button>
                </div>

                <div className={styles.tripsList}>
                  {savedTrips
                    .filter((trip) => {
                      if (activeFilter === "all") return true;
                      return trip.status === activeFilter;
                    })
                    .map((trip) => (
                      <div key={trip.id} className={styles.tripCardContainer}>
                        <Link
                          href={`/trip/${trip.id}`}
                          className={styles.tripCardLink}
                          style={{ textDecoration: "none" }}
                        >
                          <div className={styles.tripCard}>
                            <div className={styles.tripInfo}>
                              <h3>{trip.destination}</h3>
                              <p>{trip.dates}</p>
                              <span
                                className={`${styles.tripStatus} ${
                                  styles[trip.status || "planning"]
                                }`}
                              >
                                {(trip.status || "planning")
                                  .charAt(0)
                                  .toUpperCase() +
                                  (trip.status || "planning").slice(1)}
                              </span>
                            </div>
                            <Image
                              src={trip.image}
                              alt={trip.destination}
                              width={100}
                              height={80}
                              className={styles.tripImage}
                            />
                          </div>
                        </Link>
                        <button
                          className={styles.deleteButton}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Filter out the trip with this ID
                            const updatedTrips = savedTrips.filter(
                              (t) => t.id !== trip.id
                            );
                            // Update state
                            setSavedTrips(updatedTrips);
                            // Update localStorage
                            localStorage.setItem(
                              "savedTrips",
                              JSON.stringify(updatedTrips)
                            );
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>

                {/* Show a message when no trips match the current filter */}
                {savedTrips.filter((trip) => {
                  if (activeFilter === "all") return true;
                  return trip.status === activeFilter;
                }).length === 0 && (
                  <div className={styles.noTripsMessage}>
                    <p>
                      No {activeFilter !== "all" ? activeFilter : ""} trips
                      found.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Community Section */}
            <section>
              <h2 className={styles.sectionTitle}>Community</h2>
              <div className={styles.communitySection}>
                <div className={styles.blogContainer}>
                  <div className={styles.blogSlider}>
                    <div className={styles.blogPosts}>
                      {/* First blog post */}
                      <div className={styles.blogPost}>
                        <div className={styles.blogImageContainer}>
                          <Image
                            src="/amsterdam-blog.jpg"
                            alt="Amsterdam"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={styles.blogImage}
                            priority
                          />
                          <div className={styles.blogOverlay}>
                            <h3>A city guide to Amsterdam, The Netherlands</h3>
                          </div>
                        </div>
                        <div className={styles.blogMeta}>
                          <div className={styles.blogAuthor}>
                            <Image
                              src="/author-john.jpg"
                              alt="John"
                              width={24}
                              height={24}
                              className={styles.authorAvatar}
                            />
                            <span>John</span>
                          </div>
                          <div className={styles.likeButton}>
                            <span>123</span> ❤
                          </div>
                        </div>
                      </div>

                      {/* Second blog post */}
                      <Link
                        href="/blog/tokyo-japan"
                        style={{ textDecoration: "none" }}
                      >
                        <div className={styles.blogPost}>
                          <div className={styles.blogImageContainer}>
                            <Image
                              src="/Japan-blog.jpg"
                              alt="Japan-Tokyo"
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className={styles.blogImage}
                              priority
                            />
                            <div className={styles.blogOverlay}>
                              <h3>7 Day Trip to Tokyo, Japan</h3>
                            </div>
                          </div>
                          <div className={styles.blogMeta}>
                            <div className={styles.blogAuthor}>
                              <Image
                                src="/author-mary.jpg"
                                alt="Mary"
                                width={24}
                                height={24}
                                className={styles.authorAvatar}
                              />
                              <span>Mary</span>
                            </div>
                            <div className={styles.likeButton}>
                              <span>53</span> ❤
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className={styles.sliderControls}>
                      <button
                        className={
                          styles.sliderButton + " " + styles.nextButton
                        }
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerInfo}>
            <p>WTS Travel & Tours Pte Ltd</p>
            <p>旅行社牌照号码 Travel Agent License Number: TA02307</p>
            <p>Copyright 2023©</p>
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
            <Link href="/chat">
              <button
                className={styles.chatIcon}
                aria-label="Chat with support"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
