// app/blog/tokyo-japan/page.js
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToTripModal from "../../../components/AddToTripModal";
import styles from "./blog.module.css";
import style from "../../page.module.css";

export default function TokyoBlogPage() {
  const [likeCount, setLikeCount] = useState(53);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [expandedDay, setExpandedDay] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showAddToTripModal, setShowAddToTripModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const toggleMap = () => {
    setIsMapOpen(!isMapOpen);

    // When opening the map, prevent scrolling on the body
    if (!isMapOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

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
    <div>
      {/* Header */}
      <header className={style.header}>
        <Link href="/">
          <div className={style.logo}>
            <Image
              src="/wts-logo.png"
              alt="WTS Travel Logo"
              width={200}
              height={40}
            />
          </div>
        </Link>
        <nav className={style.nav}>
          <Link href="/plan-trip" className={style.navLink}>
            Plan a trip
          </Link>
          <Link href="/tours" className={style.navLink}>
            Tours
          </Link>
          <Link href="/promotions" className={style.navLink}>
            Promotions
          </Link>
          <Link href="/about" className={style.navLink}>
            About Us
          </Link>
        </nav>
        <div className={style.searchContainer}>
          <input
            type="text"
            placeholder="Explore by destination"
            className={style.searchInput}
          />
          <button className={style.searchButton}>
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
        <div className={style.profileIcon}>
          <Image
            src="/profile-avatar.png"
            alt="Profile"
            width={32}
            height={32}
            className={style.avatar}
          />
        </div>
      </header>
      <div className={style.container}>
        <div className={styles.blogContainer}>
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

          {/* Show Map Button */}
          <div className={styles.mapButtonContainer}>
            <button className={styles.showMapButton} onClick={toggleMap}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Show Map
            </button>
          </div>

          {/* Add the Map Overlay at the bottom of your component */}
          <MapOverlay isOpen={isMapOpen} onClose={toggleMap} />

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
                  className={`${styles.likeButton} ${
                    isLiked ? styles.liked : ""
                  }`}
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
              We were planning a 7-day trip to Tokyo to explore the city. Due to
              a family issue back home, we needed to pull back our itinerary so
              that it was about half the time.
            </p>
            <p className={styles.thoughtsText}>
              Our goal was to hit a tour spot every day – and we managed it on
              three of the days. Overall, it was a great introduction to the
              country – we will absolutely go back!
            </p>
          </div>

          {/* Photo Gallery */}
          <div className={styles.section}>
            <div
              className={styles.sectionHeader}
              onClick={() => toggleDay("photos")}
            >
              <h2 className={styles.sectionTitle}>&nbsp;Photos</h2>
            </div>
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
            </div>
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
                      Tokyo Tower, the iconic landmark of Tokyo, offers visitors
                      the chance to enjoy breathtaking panoramic views of the
                      city from its observation decks at 150m and 250m above
                      ground.
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
                      Shoken, is set in a lush forest area in the heart of
                      Tokyo. Explore the serene grounds and learn about Japanese
                      Shinto traditions.
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
                      TeamLab Borderless is a world of artworks without
                      boundaries, a museum without a map created by art
                      collective teamLab. Wander, explore, and discover in this
                      immersive digital art space.
                    </p>

                    <p className={styles.activityTip}>
                      Book tickets early! This place gets extremely crowded.
                      Morning is usually less busy.
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
                      Leave comfort zone to explore for dinner nearby after
                      visiting the temple!
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

          {/* Comments Section */}
          <div className={styles.commentsSection}>
            <h2 className={styles.sectionTitle}>Comments</h2>

            {/* Comment Input Box */}
            <div className={styles.commentInputContainer}>
              <Image
                src="/profile-avatar.png"
                alt="Your Avatar"
                width={40}
                height={40}
                className={styles.commentAvatar}
              />
              <div className={styles.commentInputWrapper}>
                <textarea
                  className={styles.commentInput}
                  placeholder="Share your thoughts about this trip..."
                />
                <div className={styles.commentActions}>
                  <button className={styles.attachButton}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42975 14.0991 2.00048 15.16 2.00048C16.2209 2.00048 17.2394 2.42975 17.99 3.18C18.7403 3.93063 19.1695 4.94905 19.1695 6.01C19.1695 7.07095 18.7403 8.08938 17.99 8.84L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20473 17.0347 5.99391 16.5257 5.99391 15.995C5.99391 15.4643 6.20473 14.9553 6.58 14.58L15.07 6.1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className={styles.postCommentButton}>Post</button>
                </div>
              </div>
            </div>

            {/* Existing Comments */}
            <div className={styles.commentsList}>
              {/* Comment 1 */}
              <div className={styles.commentItem}>
                <Image
                  src="/author-john.jpg"
                  alt="John"
                  width={40}
                  height={40}
                  className={styles.commentAvatar}
                />
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commenterName}>John</span>
                    <span className={styles.commentDate}>2 days ago</span>
                  </div>
                  <p className={styles.commentText}>
                    Make sure to check out the teamLab Borderless digital art
                    museum in Tokyo! It's an incredible immersive experience
                    that shouldn't be missed. Book tickets in advance as they
                    sell out quickly.
                  </p>
                  <div className={styles.commentActions}>
                    <button className={styles.likeButton}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>12</span>
                    </button>
                    <button className={styles.replyButton}>Reply</button>
                  </div>
                </div>
              </div>

              {/* Comment 2 */}
              <div className={styles.commentItem}>
                <Image
                  src="/author-mary.jpg"
                  alt="Mary"
                  width={40}
                  height={40}
                  className={styles.commentAvatar}
                />
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commenterName}>Mary</span>
                    <span className={styles.commentDate}>5 days ago</span>
                  </div>
                  <p className={styles.commentText}>
                    If you're visiting in February, be prepared for cold
                    weather! I'd recommend packing layers and a good jacket. The
                    hot springs (onsen) are especially wonderful during winter.
                    Also, don't miss trying different flavors of Kit Kat - Japan
                    has some unique ones you can't find elsewhere!
                  </p>
                  <div className={styles.commentActions}>
                    <button className={styles.likeButton}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>8</span>
                    </button>
                    <button className={styles.replyButton}>Reply</button>
                  </div>
                </div>
              </div>

              {/* Comment 3 */}
              <div className={styles.commentItem}>
                <Image
                  src="/profile-avatar.png"
                  alt="Travel Expert"
                  width={40}
                  height={40}
                  className={styles.commentAvatar}
                />
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commenterName}>Travel Expert</span>
                    <span className={styles.staffBadge}>Staff</span>
                    <span className={styles.commentDate}>1 week ago</span>
                  </div>
                  <p className={styles.commentText}>
                    For your Tokyo trip, consider getting a PASMO or Suica card
                    for easy access to public transportation. It saves time and
                    is more convenient than buying individual tickets. Also,
                    Tokyo DisneySea is unique to Japan and offers a different
                    experience from Disneyland. If you have time, I highly
                    recommend visiting both!
                  </p>
                  <div className={styles.commentActions}>
                    <button className={styles.likeButton}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>23</span>
                    </button>
                    <button className={styles.replyButton}>Reply</button>
                  </div>
                </div>
              </div>
            </div>

            <button className={styles.loadMoreButton}>
              Load More Comments
            </button>
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
      </div>
    </div>
  );
}

const MapOverlay = ({ isOpen, onClose }) => {
  return (
    <div className={`${styles.mapOverlay} ${isOpen ? styles.open : ""}`}>
      <button className={styles.closeMapButton} onClick={onClose}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className={styles.mapHeader}>
        <h2>Explore Tokyo</h2>
        <div className={styles.mapSearch}>
          <input type="text" placeholder="Search locations..." />
          <button>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.mapContainer}>
        <Image
          src="/tokyo-map.jpg"
          alt="Tokyo Map"
          width={800}
          height={600}
          className={styles.mapImage}
        />

        {/* Map Controls */}
        <div className={styles.mapControls}>
          <button className={styles.zoomButton}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button>
          <button className={styles.zoomButton}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button>
          <button className={styles.locationButton}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <point cx="12" cy="12" r="3"></point>
            </svg>
          </button>
        </div>

        {/* Map Layers Toggle */}
        <div className={styles.mapLayers}>
          <button className={`${styles.layerButton} ${styles.active}`}>
            Map
          </button>
          <button className={styles.layerButton}>Satellite</button>
          <button className={styles.layerButton}>Transit</button>
        </div>
      </div>

      {/* Point of Interest Cards */}
      <div className={styles.poiContainer}>
        <h3>Points of Interest</h3>
        <div className={styles.poiCards}>
          <div className={styles.poiCard}>
            <div className={styles.poiIcon}>🏯</div>
            <div className={styles.poiInfo}>
              <h4>Tokyo Tower</h4>
              <p>2.3 km away • 15 min walk</p>
            </div>
          </div>

          <div className={styles.poiCard}>
            <div className={styles.poiIcon}>🌸</div>
            <div className={styles.poiInfo}>
              <h4>Meiji Shrine</h4>
              <p>3.1 km away • 25 min walk</p>
            </div>
          </div>

          <div className={styles.poiCard}>
            <div className={styles.poiIcon}>🎭</div>
            <div className={styles.poiInfo}>
              <h4>Sensoji Temple</h4>
              <p>5.6 km away • 35 min by train</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
