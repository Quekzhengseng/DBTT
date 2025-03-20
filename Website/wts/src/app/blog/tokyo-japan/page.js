// app/blog/tokyo-japan/page.js
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToTripModal from "../../../components/AddToTripModal";
import styles from "./blog.module.css";

export default function TokyoBlogPage() {
  const [likeCount, setLikeCount] = useState(53);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [expandedDay, setExpandedDay] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showAddToTripModal, setShowAddToTripModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const toggleDay = (day) => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  const handleAddToTrip = (activity) => {
    setSelectedActivity(activity);
    setShowAddToTripModal(true);
  };

  const handleModalClose = (result) => {
    setShowAddToTripModal(false);

    if (result && result.success) {
      setSuccessMessage(`Added to "${result.tripName}" successfully!`);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  return (
    <div className={styles.blogContainer}>
      {/* Header with Back Button */}
      <div className={styles.blogHeader}>
        <Link href="/" className={styles.backButton}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Banner */}
      <div className={styles.banner}>
        <Image
          src="/tokyo-banner.jpg"
          alt="Tokyo, Japan"
          width={1200}
          height={300}
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay}>
          <h1>Tokyo, Japan</h1>
        </div>
      </div>

      {/* Author Info */}
      <div className={styles.authorInfo}>
        <div className={styles.authorProfile}>
          <Image
            src="/author-mary.jpg"
            alt="Mary"
            width={40}
            height={40}
            className={styles.authorAvatar}
          />
          <div className={styles.authorDetails}>
            <h3>Mary</h3>
            <p>18 March 2025</p>
          </div>
        </div>
        <div className={styles.postActions}>
          <button
            className={`${styles.followButton} ${
              isFollowing ? styles.following : ""
            }`}
            onClick={toggleFollow}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
          <div className={styles.interactionButtons}>
            <button
              className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
              onClick={handleLike}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isLiked ? "red" : "none"}
                stroke={isLiked ? "red" : "currentColor"}
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>{likeCount}</span>
            </button>
            <button className={styles.shareButton}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Trip Thoughts */}
      <div className={styles.thoughtsSection}>
        <h2 className={styles.thoughtsTitle}>Thoughts</h2>
        <p className={styles.thoughtsText}>
          We were planning a 7-day trip to Tokyo to explore the city. Due to a
          family issue back home, we needed to pull back our itinerary so that
          it was about half the time.
        </p>
        <p className={styles.thoughtsText}>
          Our goal was to hit a tour spot every day – and we managed it on three
          of the days. Overall, it was a great introduction to the country – we
          will absolutely go back!
        </p>
      </div>

      {/* Photo Gallery */}
      <div className={styles.section}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleDay("photos")}
        >
          <h2 className={styles.sectionTitle}>
            <svg
              className={`${styles.arrowIcon} ${
                expandedDay === "photos" ? styles.expanded : ""
              }`}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            Photos
          </h2>
        </div>

        {expandedDay === "photos" && (
          <div className={styles.photoGallery}>
            <div className={styles.photo}>
              <Image
                src="/tokyo-banner.jpg"
                alt="Tokyo Tower at Sunrise"
                width={200}
                height={150}
              />
            </div>
            <div className={styles.photo}>
              <Image
                src="/tokyo-subway.jpg"
                alt="Tokyo Subway"
                width={200}
                height={150}
              />
            </div>
            <div className={styles.photo}>
              <Image
                src="/shibuya.jpg"
                alt="Shibuya Crossing"
                width={200}
                height={150}
              />
            </div>
            <div className={styles.photo}>
              <Image
                src="/asakusa-temple.jpg"
                alt="Asakusa Temple"
                width={200}
                height={150}
              />
            </div>
            {/* <button className={styles.nextPhotosButton}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button> */}
          </div>
        )}
      </div>

      {/* Day 1 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleDay(1)}>
          <h2 className={styles.sectionTitle}>
            <svg
              className={`${styles.arrowIcon} ${
                expandedDay === 1 ? styles.expanded : ""
              }`}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            Day 1
          </h2>
        </div>

        {expandedDay === 1 && (
          <div className={styles.dayContent}>
            <p className={styles.dayItinerary}>
              Arrived, Tokyo Tower, Shinjuku, Meiji Shrine
            </p>

            <div className={styles.activityCard}>
              <div className={styles.activityMarker}>1</div>
              <div className={styles.activityContent}>
                <div className={styles.activityHeader}>
                  <h3>Tokyo Tower</h3>
                  <button
                    className={styles.addToTripButton}
                    onClick={() =>
                      handleAddToTrip({
                        id: "tokyo-tower",
                        title: "Tokyo Tower",
                        price: "¥1,800",
                        image: "/tokyo-tower-detail.jpg",
                        time: "9:00 - 11:00",
                        duration: "2 hours",
                      })
                    }
                  >
                    Add to trip
                  </button>
                </div>
                <div className={styles.activityRating}>
                  <div className={styles.stars}>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.emptyStar}>★</span>
                  </div>
                  <span className={styles.reviewCount}>(77,896)</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.openStatus}>Open 9-11</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.tourDuration}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    2 hours
                  </span>
                </div>

                <p className={styles.activityDescription}>
                  Tokyo Tower, the iconic landmark of Tokyo, offers visitors the
                  chance to enjoy breathtaking panoramic views of the city from
                  its observation decks at 150m and 250m above ground.
                </p>

                <p className={styles.activityTip}>
                  We only came at 5pm and the crowd was not that bad. Highly
                  recommend!
                </p>

                <div className={styles.activityImage}>
                  <Image
                    src="/tokyo-tower-detail.jpg"
                    alt="Tokyo Tower"
                    width={120}
                    height={80}
                  />
                </div>

                <div className={styles.activityPrice}>
                  <span className={styles.priceTag}>WTS ACTIVITY</span>
                  <span className={styles.price}>¥1,800</span>
                </div>
              </div>
            </div>

            <div className={styles.activityCard}>
              <div className={styles.activityMarker}>2</div>
              <div className={styles.activityContent}>
                <div className={styles.activityHeader}>
                  <h3>Meiji Shrine Tour</h3>
                  <button
                    className={styles.addToTripButton}
                    onClick={() =>
                      handleAddToTrip({
                        id: "meiji-shrine",
                        title: "Meiji Shrine Tour",
                        price: "¥3,500",
                        image: "/meiji-shrine-detail.jpg",
                        time: "9:00 - 12:00",
                        duration: "3 hours",
                      })
                    }
                  >
                    Add to trip
                  </button>
                </div>
                <div className={styles.activityRating}>
                  <div className={styles.stars}>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                  </div>
                  <span className={styles.reviewCount}>(58,023)</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.openStatus}>Open 5-6</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.tourDuration}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    3 hours
                  </span>
                </div>

                <p className={styles.activityDescription}>
                  The Meiji Shrine, dedicated to Emperor Meiji and Empress
                  Shoken, is set in a lush forest area in the heart of Tokyo.
                  Explore the serene grounds and learn about Japanese Shinto
                  traditions.
                </p>

                <p className={styles.activityTip}>
                  Ticket was booked via WTS, quite convenient! I made top!
                </p>

                <div className={styles.activityPrice}>
                  <span className={styles.priceTag}>WTS ACTIVITY</span>
                  <span className={styles.price}>¥3,500</span>
                </div>

                <div className={styles.activityImage}>
                  <Image
                    src="/meiji-shrine-detail.jpg"
                    alt="Meiji Shrine"
                    width={120}
                    height={80}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Day 2 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleDay(2)}>
          <h2 className={styles.sectionTitle}>
            <svg
              className={`${styles.arrowIcon} ${
                expandedDay === 2 ? styles.expanded : ""
              }`}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            Day 2
          </h2>
        </div>

        {expandedDay === 2 && (
          <div className={styles.dayContent}>
            <p className={styles.dayItinerary}>
              Tsukiji Fish Market, TeamLab Borderless, Shopping in Ginza
            </p>

            <div className={styles.activityCard}>
              <div className={styles.activityMarker}>1</div>
              <div className={styles.activityContent}>
                <div className={styles.activityHeader}>
                  <h3>TeamLab Borderless</h3>
                  <button
                    className={styles.addToTripButton}
                    onClick={() =>
                      handleAddToTrip({
                        id: "teamlab-borderless",
                        title: "TeamLab Borderless",
                        price: "¥3,200",
                        image: "/teamlab.jpg",
                        time: "10:00 - 14:00",
                        duration: "3-4 hours",
                      })
                    }
                  >
                    Add to trip
                  </button>
                </div>
                <div className={styles.activityRating}>
                  <div className={styles.stars}>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                  </div>
                  <span className={styles.reviewCount}>(124,532)</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.openStatus}>Open 10-7</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.tourDuration}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    3-4 hours
                  </span>
                </div>

                <p className={styles.activityDescription}>
                  TeamLab Borderless is a world of artworks without boundaries,
                  a museum without a map created by art collective teamLab.
                  Wander, explore, and discover in this immersive digital art
                  space.
                </p>

                <p className={styles.activityTip}>
                  Book tickets early! This place gets extremely crowded. Morning
                  is usually less busy.
                </p>

                <div className={styles.activityPrice}>
                  <span className={styles.priceTag}>WTS ACTIVITY</span>
                  <span className={styles.price}>¥3,200</span>
                </div>

                <div className={styles.activityImage}>
                  <Image
                    src="/teamlab.jpg"
                    alt="TeamLab Borderless"
                    width={120}
                    height={80}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Day 3 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleDay(3)}>
          <h2 className={styles.sectionTitle}>
            <svg
              className={`${styles.arrowIcon} ${
                expandedDay === 3 ? styles.expanded : ""
              }`}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            Day 3
          </h2>
        </div>

        {expandedDay === 3 && (
          <div className={styles.dayContent}>
            <p className={styles.dayItinerary}>
              Sensoji Temple, Shopping in Akihabara, Dinner in Shinjuku
            </p>

            <div className={styles.activityCard}>
              <div className={styles.activityMarker}>1</div>
              <div className={styles.activityContent}>
                <div className={styles.activityHeader}>
                  <h3>Sensoji Temple</h3>
                  <button
                    className={styles.addToTripButton}
                    onClick={() =>
                      handleAddToTrip({
                        id: "sensoji-temple",
                        title: "Sensoji Temple",
                        price: "Free",
                        image: "/sensoji-detail.jpg",
                        time: "6:00 - 8:00",
                        duration: "2 hours",
                      })
                    }
                  >
                    Add to trip
                  </button>
                </div>
                <div className={styles.activityRating}>
                  <div className={styles.stars}>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                    <span className={styles.filledStar}>★</span>
                  </div>
                  <span className={styles.reviewCount}>(89,761)</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.openStatus}>Open 6-5</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.tourDuration}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    2 hours
                  </span>
                </div>

                <p className={styles.activityDescription}>
                  Sensoji is Tokyo's oldest temple, and one of its most
                  significant. Visit the iconic Thunder Gate, shop along
                  Nakamise Street, and explore the beautiful main hall and
                  five-story pagoda.
                </p>

                <p className={styles.activityTip}>
                  Leave comfort zone to explore for dinner nearby after visiting
                  the temple!
                </p>

                <div className={styles.activityPrice}>
                  <span className={styles.priceTag}>WTS ACTIVITY</span>
                  <span className={styles.price}>Free</span>
                </div>

                <div className={styles.activityImage}>
                  <Image
                    src="/sensoji-detail.jpg"
                    alt="Sensoji Temple"
                    width={120}
                    height={80}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className={styles.commentsSection}>
        <h2 className={styles.sectionTitle}>Comments</h2>
        <button className={styles.addCommentButton}>Add Comment</button>
      </div>
      {/* Success Message */}
      {successMessage && (
        <div className={styles.successMessage}>
          <svg
            width="20"
            height="20"
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
          {successMessage}
        </div>
      )}

      {/* Add to Trip Modal */}
      <AddToTripModal
        isOpen={showAddToTripModal}
        onClose={handleModalClose}
        activity={selectedActivity}
      />
    </div>
  );
}
