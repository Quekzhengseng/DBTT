// app/search/page.js
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./search.module.css";

// Create a wrapper component that uses the search params
const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching search results
    setLoading(true);

    // Mock search results based on query
    setTimeout(() => {
      const results = getMockSearchResults(query);
      setSearchResults(results);
      setLoading(false);
    }, 500);
  }, [query]);

  // Function to generate mock search results
  const getMockSearchResults = (query) => {
    if (!query) return [];

    const mockData = [
      {
        id: 1,
        type: "package",
        title: "Japan Cherry Blossom Tour",
        description: "7 days experiencing the beautiful sakura season in Japan",
        price: 1299,
        image: "/japan-cherry-blossom.jpg",
        rating: 4.8,
        reviews: 238,
      },
      {
        id: 2,
        type: "package",
        title: "Tokyo Explorer Package",
        description: "5 days exploring the vibrant city of Tokyo",
        price: 899,
        image: "/tokyo-explorer.jpg",
        rating: 4.6,
        reviews: 185,
      },
      {
        id: 3,
        type: "hotel",
        title: "VIA INN PRIME AKASAKA",
        description: "Comfortable stay in the heart of Tokyo",
        price: 129,
        image: "/tokyo-hotel.jpg",
        rating: 4.4,
        reviews: 320,
      },
      {
        id: 4,
        type: "activity",
        title: "TeamLab Borderless Museum",
        description: "Digital art museum with immersive experiences",
        price: 35,
        image: "/teamlab.jpg",
        rating: 4.9,
        reviews: 512,
      },
      {
        id: 5,
        type: "activity",
        title: "Mt Fuji Day Trip",
        description: "Day trip to Japan's iconic mountain",
        price: 125,
        image: "/mtfuji.jpg",
        rating: 4.7,
        reviews: 296,
      },
    ];

    return mockData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className={styles.searchResultsContainer}>
      <div className={styles.searchHeader}>
        <h1>
          Search Results for:{" "}
          <span className={styles.searchQuery}>{query}</span>
        </h1>
        <p>{searchResults.length} results found</p>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading results...</p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className={styles.noResults}>
          <h2>No results found for "{query}"</h2>
          <p>
            Try adjusting your search terms or browse our popular destinations
            below.
          </p>
          <div className={styles.suggestedDestinations}>
            <Link href="/destination/japan" className={styles.destinationLink}>
              Japan
            </Link>
            <Link href="/destination/korea" className={styles.destinationLink}>
              Korea
            </Link>
            <Link
              href="/destination/thailand"
              className={styles.destinationLink}
            >
              Thailand
            </Link>
            <Link href="/destination/bali" className={styles.destinationLink}>
              Bali
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.searchResults}>
          {searchResults.map((result) => (
            <div key={result.id} className={styles.searchResultCard}>
              <div className={styles.resultImage}>
                <Image
                  src={result.image}
                  alt={result.title}
                  width={280}
                  height={180}
                  className={styles.resultThumbnail}
                />
                <div className={styles.resultType}>{result.type}</div>
              </div>
              <div className={styles.resultInfo}>
                <h2 className={styles.resultTitle}>{result.title}</h2>
                <p className={styles.resultDescription}>{result.description}</p>
                <div className={styles.resultRating}>
                  <div className={styles.stars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.floor(result.rating)
                            ? styles.starFull
                            : styles.starEmpty
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className={styles.ratingText}>
                    {result.rating} ({result.reviews} reviews)
                  </span>
                </div>
                <div className={styles.resultPrice}>
                  <span className={styles.price}>${result.price}</span>
                  {result.type === "hotel" && (
                    <span className={styles.priceUnit}>/ night</span>
                  )}
                  {result.type === "package" && (
                    <span className={styles.priceUnit}>/ person</span>
                  )}
                </div>
                <div className={styles.resultActions}>
                  <Link
                    href={`/details/${result.id}`}
                    className={styles.viewDetailsBtn}
                  >
                    View Details
                  </Link>
                  <button className={styles.addToTripBtn}>Add to Trip</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main search page component with Suspense boundary
export default function SearchPage() {
  return (
    <div className={styles.container}>
      {/* Header and other static content can go here */}
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

      {/* Wrap the component using useSearchParams in Suspense boundary */}
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            Loading search results...
          </div>
        }
      >
        <SearchContent />
      </Suspense>

      {/* Footer and other static content can go here */}
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
