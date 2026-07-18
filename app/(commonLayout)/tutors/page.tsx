"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Slider,
  Button,
  Tag,
  Avatar,
  Rate,
  Empty,
  Spin,
  Space,
  message,
} from "antd";
import {
  SearchOutlined,
  DollarOutlined,
  BookOutlined,
  UserOutlined,
  StarOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { getImageUrl } from "@/lib/getImageUrl";
import { tutorService } from "@/services/tutor.service";

const { Option } = Select;

interface TutorProfile {
  id: string;
  bio?: string;
  subjects: string[];
  hourlyRate: number;
  experience?: string;
  education?: string;
  rating: number;
  totalReviews: number;
  profilePhoto?: string;
  profilePhotoUrl?: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export default function BrowseTutorsPage() {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState<number | undefined>();
  const router = useRouter();
  const { user } = useAuth();
  const { isSaved, toggleWishlist } = useWishlist();

  useEffect(() => {
    loadTutors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedSubject, priceRange, minRating, tutors]);

  const loadTutors = async () => {
    setLoading(true);
    try {
      const { data, error } = await tutorService.getAllTutors();
      if (data && !error) {
        setTutors(data);
        setFilteredTutors(data);
      } else if (error) {
        console.error("Failed to load tutors:", error);
      }
    } catch (error) {
      console.error("Failed to load tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tutors];

    if (searchQuery) {
      filtered = filtered.filter((tutor) =>
        tutor.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter((tutor) =>
        tutor.subjects.includes(selectedSubject),
      );
    }

    filtered = filtered.filter(
      (tutor) =>
        tutor.hourlyRate >= priceRange[0] && tutor.hourlyRate <= priceRange[1],
    );

    if (minRating) {
      filtered = filtered.filter((tutor) => tutor.rating >= minRating);
    }

    setFilteredTutors(filtered);
  };

  const getAllSubjects = () => {
    const subjects = new Set<string>();
    tutors.forEach((tutor) => {
      tutor.subjects.forEach((subject) => subjects.add(subject));
    });
    return Array.from(subjects);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedSubject(undefined);
    setPriceRange([0, 5000]);
    setMinRating(undefined);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Find Your Perfect Tutor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Browse {tutors.length} expert tutors across various subjects
            </p>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={6}>
              <Card className="sticky top-4 shadow-lg dark:bg-slate-900 dark:border-slate-800">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <SearchOutlined className="text-brand-green" />
                      Search Tutors
                    </h3>
                    <Input
                      placeholder="Search by name..."
                      size="large"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      allowClear
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <BookOutlined className="text-brand-green" />
                      Subject
                    </h3>
                    <Select
                      placeholder="Select subject"
                      size="large"
                      className="w-full"
                      value={selectedSubject}
                      onChange={setSelectedSubject}
                      allowClear
                    >
                      {getAllSubjects().map((subject) => (
                        <Option key={subject} value={subject}>
                          {subject}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <DollarOutlined className="text-brand-green" />
                      Hourly Rate
                    </h3>
                    <Slider
                      range
                      min={0}
                      max={5000}
                      value={priceRange}
                      onChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                      tooltip={{
                        formatter: (value) => `$${value}`,
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <StarOutlined className="text-brand-green" />
                      Minimum Rating
                    </h3>
                    <Select
                      placeholder="Any rating"
                      size="large"
                      className="w-full"
                      value={minRating}
                      onChange={setMinRating}
                      allowClear
                    >
                      <Option value={4.5}>4.5+ Stars</Option>
                      <Option value={4.0}>4.0+ Stars</Option>
                      <Option value={3.5}>3.5+ Stars</Option>
                      <Option value={3.0}>3.0+ Stars</Option>
                    </Select>
                  </div>

                  <Button
                    type="default"
                    block
                    size="large"
                    onClick={clearAllFilters}
                    className="dark:bg-slate-800 dark:text-white dark:border-slate-700"
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={18}>
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <Spin size="large" />
                </div>
              ) : filteredTutors.length === 0 ? (
                <Card className="dark:bg-slate-900 dark:border-slate-800">
                  <Empty
                    description={<span className="dark:text-gray-400">No tutors found matching your criteria</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </Card>
              ) : (
                <Row gutter={[16, 16]}>
                  {filteredTutors.map((tutor) => (
                    <Col xs={24} sm={12} xl={8} key={tutor.id}>
                      <Card
                        hoverable
                        className="h-full shadow-md hover:shadow-xl dark:bg-slate-900 dark:border-slate-800 transition-all duration-300 relative"
                        onClick={() => router.push(`/tutors/${tutor.id}`)}
                      >
                        {/* Save Tutor Heart Button (Bug/Feature E) */}
                        <div
                          className="absolute top-4 right-4 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user) {
                              message.warning("Please login to save tutors");
                              router.push("/login");
                              return;
                            }
                            if (user.role !== "STUDENT") {
                              message.warning("Only students can save tutors to wishlist");
                              return;
                            }
                            toggleWishlist(tutor.id);
                          }}
                        >
                          <Button
                            type="text"
                            shape="circle"
                            className="bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm flex items-center justify-center border-0 text-lg transition-transform duration-200 hover:scale-110"
                            icon={
                              isSaved(tutor.id) ? (
                                <HeartFilled className="text-brand-red text-xl" />
                              ) : (
                                <HeartOutlined className="text-gray-400 dark:text-gray-300 hover:text-brand-red text-xl" />
                              )
                            }
                          />
                        </div>

                        <div className="text-center mb-4">
                          <Avatar
                            size={80}
                            src={getImageUrl(tutor.profilePhoto || tutor.user.image)}
                            icon={<UserOutlined />}
                            className="bg-gradient-to-br from-brand-green to-emerald-600"
                          />
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3 mb-1">
                            {tutor.user.name}
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
                              {tutor.subjects.slice(0, 3).map((subject) => (
                                <Tag key={subject} color="success" className="font-medium">
                                  {subject}
                                </Tag>
                              ))}
                              {tutor.subjects.length > 3 && (
                                <Tag className="dark:bg-slate-800 dark:text-gray-300">+{tutor.subjects.length - 3} more</Tag>
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
                  ))}
                </Row>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
