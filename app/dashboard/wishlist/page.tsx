"use client";

import { useWishlist } from "@/context/WishlistContext";
import { Card, Row, Col, Button, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import TutorCard from "@/components/shared/TutorCard";
import { SingleTutorCardSkeleton } from "@/components/shared/TutorCardSkeleton";

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
            className="bg-brand-green hover:bg-brand-green-hover border-0 text-white font-medium rounded-xl h-10 px-5"
          >
            Find More Tutors
          </Button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <Card className="shadow-sm border-0 rounded-2xl dark:bg-slate-900 dark:border-slate-800 text-center py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  You haven&apos;t saved any tutors to your wishlist yet.
                </p>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => router.push("/tutors")}
                  className="bg-brand-green hover:bg-brand-green-hover border-0 text-white font-semibold rounded-xl"
                >
                  Browse Tutors
                </Button>
              </div>
            }
          />
        </Card>
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
