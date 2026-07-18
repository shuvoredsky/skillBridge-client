"use client";

import { useWishlist } from "@/context/WishlistContext";
import { Card, Row, Col, Button, Empty, Avatar, Rate, Tag, Spin } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  BookOutlined,
  ClockCircleOutlined,
  HeartFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/getImageUrl";

export default function WishlistPage() {
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
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
            className="bg-brand-green hover:bg-brand-green-hover border-0 text-white"
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
                  You haven't saved any tutors to your wishlist yet.
                </p>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => router.push("/tutors")}
                  className="bg-brand-green hover:bg-brand-green-hover border-0 text-white"
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
                <Card
                  hoverable
                  className="h-full shadow-md hover:shadow-xl dark:bg-slate-900 dark:border-slate-800 transition-all duration-300 relative"
                  onClick={() => router.push(`/tutors/${tutor.id}`)}
                >
                  {/* Save Tutor Heart Button (Unsave on click) */}
                  <div
                    className="absolute top-4 right-4 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(tutor.id);
                    }}
                  >
                    <Button
                      type="text"
                      shape="circle"
                      className="bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm flex items-center justify-center border-0 text-lg transition-transform duration-200 hover:scale-110"
                      icon={<HeartFilled className="text-brand-red text-xl" />}
                    />
                  </div>

                  <div className="text-center mb-4">
                    <Avatar
                      size={80}
                      src={getImageUrl(tutor.profilePhoto || tutor.user?.image)}
                      icon={<UserOutlined />}
                      className="bg-gradient-to-br from-brand-green to-emerald-600"
                    />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3 mb-1">
                      {tutor.user?.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      <Rate
                        disabled
                        value={tutor.rating}
                        allowHalf
                        className="text-sm"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({tutor.totalReviews})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <DollarOutlined className="text-brand-green" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${tutor.hourlyRate}/hr
                      </span>
                    </div>

                    {tutor.experience && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                        <ClockCircleOutlined className="text-brand-green" />
                        <span>{tutor.experience}</span>
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tutor.subjects?.slice(0, 3).map((subject) => (
                          <Tag key={subject} color="success" className="font-medium">
                            {subject}
                          </Tag>
                        ))}
                        {tutor.subjects?.length > 3 && (
                          <Tag className="dark:bg-slate-800 dark:text-gray-300">
                            +{tutor.subjects.length - 3} more
                          </Tag>
                        )}
                      </div>
                    </div>

                    {tutor.bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {tutor.bio}
                      </p>
                    )}
                  </div>

                  <Button
                    type="primary"
                    block
                    className="mt-4 bg-brand-green hover:bg-brand-green-hover border-0 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tutors/${tutor.id}`);
                    }}
                  >
                    View Profile
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}
