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
} from "antd";
import {
  SearchOutlined,
  DollarOutlined,
  BookOutlined,
  UserOutlined,
  StarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    loadTutors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedSubject, priceRange, minRating, tutors]);

  const loadTutors = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/tutors",
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setTutors(data);
      setFilteredTutors(data);
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Find Your Perfect Tutor
            </h1>
            <p className="text-lg text-gray-600">
              Browse {tutors.length} expert tutors across various subjects
            </p>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={6}>
              <Card className="sticky top-4 shadow-lg">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <SearchOutlined className="text-indigo-600" />
                      Search Tutors
                    </h3>
                    <Input
                      placeholder="Search by name..."
                      size="large"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      allowClear
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOutlined className="text-indigo-600" />
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
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <DollarOutlined className="text-indigo-600" />
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
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <StarOutlined className="text-indigo-600" />
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
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={18}>
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <Spin fullscreen size="large" />
                </div>
              ) : filteredTutors.length === 0 ? (
                <Card>
                  <Empty
                    description="No tutors found matching your criteria"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </Card>
              ) : (
                <Row gutter={[16, 16]}>
                  {filteredTutors.map((tutor) => (
                    <Col xs={24} sm={12} xl={8} key={tutor.id}>
                      <Card
                        hoverable
                        className="h-full shadow-md hover:shadow-xl transition-shadow duration-300"
                        onClick={() => router.push(`/tutors/${tutor.id}`)}
                      >
                        <div className="text-center mb-4">
                          <Avatar
                            size={80}
                            src={tutor.user.image}
                            icon={<UserOutlined />}
                            className="bg-gradient-to-br from-indigo-500 to-purple-600"
                          />
                          <h3 className="text-lg font-bold text-gray-900 mt-3 mb-1">
                            {tutor.user.name}
                          </h3>
                          <div className="flex items-center justify-center gap-2">
                            <Rate
                              disabled
                              value={tutor.rating}
                              allowHalf
                              className="text-sm"
                            />
                            <span className="text-sm text-gray-600">
                              ({tutor.totalReviews})
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarOutlined className="text-green-600" />
                            <span className="font-semibold text-gray-900">
                              ${tutor.hourlyRate}/hr
                            </span>
                          </div>

                          {tutor.experience && (
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <ClockCircleOutlined className="text-indigo-600" />
                              <span>{tutor.experience}</span>
                            </div>
                          )}

                          <div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {tutor.subjects.slice(0, 3).map((subject) => (
                                <Tag key={subject} color="blue">
                                  {subject}
                                </Tag>
                              ))}
                              {tutor.subjects.length > 3 && (
                                <Tag>+{tutor.subjects.length - 3} more</Tag>
                              )}
                            </div>
                          </div>

                          {tutor.bio && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {tutor.bio}
                            </p>
                          )}
                        </div>

                        <Button
                          type="primary"
                          block
                          className="mt-4 bg-indigo-600 hover:bg-indigo-700"
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
