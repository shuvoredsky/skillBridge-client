"use client";

import { useWishlist } from "@/context/WishlistContext";
import { Row, Col, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import TutorCard from "@/components/shared/TutorCard";
import { SingleTutorCardSkeleton } from "@/components/shared/TutorCardSkeleton";
import EmptyState from "@/components/shared/EmptyState";

export default function WishlistPage() {
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Tutors</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Keep track of the tutors you are interested in booking.
          </p>
        </div>
        <Row gutter={[16, 16]}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Col xs={24} sm={12} xl={8} key={idx}>
              <SingleTutorCardSkeleton />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Tutors</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Keep track of the tutors you are interested in booking.
          </p>
        </div>
        {wishlist.length > 0 && (
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => router.push("/tutors")}
            className="bg-brand-green hover:bg-brand-green-hover border-0 text-white font-medium rounded-xl h-10 px-5 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Find More Tutors
          </Button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <EmptyState
          icon={<Heart size={28} className="text-rose-500" />}
          title="Your Wishlist is Empty"
          description="You haven't saved any tutors to your wishlist yet. Explore our top-rated tutors and save your favorites!"
          actionLabel="Browse Tutors"
          onAction={() => router.push("/tutors")}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {wishlist.map((item) => {
            const { tutor } = item;
            if (!tutor) return null;
            return (
              <Col xs={24} sm={12} xl={8} key={tutor.id}>
                <TutorCard
                  tutor={tutor}
                  variant="wishlist"
                  showRemoveButton={true}
                  onWishlistToggle={() => toggleWishlist(tutor.id)}
                />
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}
