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
  Empty,
  Pagination,
  Drawer,
} from "antd";
import {
  SearchOutlined,
  DollarOutlined,
  BookOutlined,
  StarOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { tutorService } from "@/services/tutor.service";
import { adminService } from "@/services/admin.service";
import RecentlyViewedRow from "@/components/RecentlyViewedRow";
import TutorCard from "@/components/shared/TutorCard";
import { SingleTutorCardSkeleton } from "@/components/shared/TutorCardSkeleton";
import { useDebounce } from "@/hooks/useDebounce";

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
  const [filteredTutors, setFilteredTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState<number | undefined>();
  const [subjects, setSubjects] = useState<string[]>([]);

  // Mobile Filter Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Debounce search query by 350ms to eliminate unnecessary API requests on every keystroke
  const debouncedSearchQuery = useDebounce(searchQuery, 350);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(9); // 9 matches the 3-column responsive layout
  const [totalTutors, setTotalTutors] = useState(0);

  // Load categories / subjects list from database dynamically on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data, error } = await adminService.getAllCategories();
        if (data && !error) {
          setSubjects(data.map((c) => c.name));
        }
      } catch (err) {
        console.error("Failed to load subjects", err);
      }
    };
    fetchSubjects();
  }, []);

  const loadTutors = async (
    currentPage = page,
    size = pageSize,
    search = debouncedSearchQuery,
    subject = selectedSubject,
    price = priceRange,
    rating = minRating
  ) => {
    setLoading(true);
    try {
      const { data, error } = await tutorService.getAllTutors({
        search: search || undefined,
        subject: subject || undefined,
        minPrice: price[0],
        maxPrice: price[1],
        minRating: rating || undefined,
        page: currentPage,
        limit: size,
      });

      if (data && !error) {
        setFilteredTutors(data.data);
        setTotalTutors(data.meta.total);
      } else if (error) {
        console.error("Failed to load tutors:", error);
      }
    } catch (error) {
      console.error("Failed to load tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on filter changes (always reset to page 1 on filter tweak)
  useEffect(() => {
    setPage(1);
    loadTutors(1, pageSize, debouncedSearchQuery, selectedSubject, priceRange, minRating);
  }, [debouncedSearchQuery, selectedSubject, priceRange, minRating]);

  // Trigger reload on page changes
  useEffect(() => {
    loadTutors(page, pageSize, debouncedSearchQuery, selectedSubject, priceRange, minRating);
  }, [page]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedSubject(undefined);
    setPriceRange([0, 5000]);
    setMinRating(undefined);
    setPage(1);
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (selectedSubject ? 1 : 0) +
    (minRating ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0);

  const renderFilterControls = (isMobile = false) => (
    <div className="space-y-6">
      <div>
        <label htmlFor="tutors-search-input" className="font-semibold text-gray-900 dark:text-white mb-2.5 flex items-center gap-2 text-sm cursor-pointer">
          <SearchOutlined className="text-brand-green" />
          Search Tutors
        </label>
        <Input
          id="tutors-search-input"
          placeholder="Search by name..."
          size="large"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search tutors by name"
          allowClear
          className="dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-xl"
        />
      </div>

      <div>
        <label htmlFor="tutors-subject-select" className="font-semibold text-gray-900 dark:text-white mb-2.5 flex items-center gap-2 text-sm cursor-pointer">
          <BookOutlined className="text-brand-green" />
          Subject / Category
        </label>
        <Select
          id="tutors-subject-select"
          placeholder="Select subject"
          size="large"
          className="w-full"
          value={selectedSubject}
          onChange={setSelectedSubject}
          aria-label="Filter by subject or category"
          allowClear
        >
          {subjects.map((subject) => (
            <Option key={subject} value={subject}>
              {subject}
            </Option>
          ))}
        </Select>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2.5 flex items-center gap-2 text-sm">
          <DollarOutlined className="text-brand-green" />
          Hourly Rate Range
        </h3>
        <Slider
          range
          min={0}
          max={5000}
          value={priceRange}
          onChange={(value) => setPriceRange(value as [number, number])}
          aria-label="Filter by hourly rate range"
          tooltip={{
            formatter: (value) => `$${value}`,
          }}
        />
        <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-300 mt-1">
          <span>Min: ${priceRange[0]}</span>
          <span>Max: ${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <label htmlFor="tutors-rating-select" className="font-semibold text-gray-900 dark:text-white mb-2.5 flex items-center gap-2 text-sm cursor-pointer">
          <StarOutlined className="text-brand-green" />
          Minimum Rating
        </label>
        <Select
          id="tutors-rating-select"
          placeholder="Any rating"
          size="large"
          className="w-full"
          value={minRating}
          onChange={setMinRating}
          aria-label="Filter by minimum rating"
          allowClear
        >
          <Option value={4.5}>★ 4.5+ Stars</Option>
          <Option value={4.0}>★ 4.0+ Stars</Option>
          <Option value={3.5}>★ 3.5+ Stars</Option>
          <Option value={3.0}>★ 3.0+ Stars</Option>
        </Select>
      </div>

      <div className="pt-2 flex flex-col gap-2.5">
        {isMobile && (
          <Button
            type="primary"
            block
            size="large"
            onClick={() => setDrawerOpen(false)}
            className="bg-brand-green hover:bg-brand-green-hover border-0 text-white rounded-xl font-semibold"
          >
            Apply Filters
          </Button>
        )}
        <Button
          type="default"
          block
          size="large"
          onClick={clearAllFilters}
          className="dark:bg-slate-800 dark:text-white dark:border-slate-700 rounded-xl"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Find Your Perfect Tutor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Browse {totalTutors} expert tutors across various subjects
            </p>
          </div>

          <RecentlyViewedRow />

          {/* Mobile Filter Trigger Bar */}
          <div className="lg:hidden flex items-center justify-between gap-3 mb-6 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {totalTutors} Tutors
              </span>
              {activeFiltersCount > 0 && (
                <Tag color="success" className="m-0 rounded-full font-bold text-xs bg-emerald-50 text-brand-green dark:bg-emerald-950/40 border-0">
                  {activeFiltersCount} active
                </Tag>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button
                  size="small"
                  type="text"
                  onClick={clearAllFilters}
                  className="text-xs text-gray-500 hover:text-brand-red"
                >
                  Reset
                </Button>
              )}
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={() => setDrawerOpen(true)}
                className="bg-brand-green hover:bg-brand-green-hover border-0 text-white font-medium rounded-xl h-9 flex items-center gap-1.5"
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>
          </div>

          {/* Mobile Drawer */}
          <Drawer
            title={
              <div className="flex items-center justify-between pr-4">
                <span className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FilterOutlined className="text-brand-green" /> Filter Tutors
                </span>
                {activeFiltersCount > 0 && (
                  <span className="text-xs text-brand-green font-semibold">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>
            }
            placement="left"
            width={320}
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
            className="dark:bg-slate-900"
            styles={{
              body: {
                padding: "24px 20px",
                backgroundColor: "transparent",
              },
              header: {
                borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
              },
            }}
          >
            {renderFilterControls(true)}
          </Drawer>

          <Row gutter={[24, 24]}>
            {/* Desktop Filter Sidebar */}
            <Col xs={0} lg={6} className="hidden lg:block">
              <Card className="sticky top-20 shadow-sm border border-gray-100 dark:border-slate-800 rounded-2xl dark:bg-slate-900">
                {renderFilterControls(false)}
              </Card>
            </Col>

            {/* Tutors Grid Column */}
            <Col xs={24} lg={18}>
              {loading ? (
                <Row gutter={[16, 16]}>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <Col xs={24} sm={12} xl={8} key={idx}>
                      <SingleTutorCardSkeleton />
                    </Col>
                  ))}
                </Row>
              ) : filteredTutors.length === 0 ? (
                <Card className="rounded-2xl border border-gray-100 dark:border-slate-800 dark:bg-slate-900 py-16 text-center">
                  <Empty
                    description={
                      <span className="text-gray-500 dark:text-gray-400 text-base">
                        No tutors found matching your criteria
                      </span>
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button
                      type="primary"
                      onClick={clearAllFilters}
                      className="bg-brand-green hover:bg-brand-green-hover border-0 text-white rounded-xl font-medium mt-2"
                    >
                      Clear All Filters
                    </Button>
                  </Empty>
                </Card>
              ) : (
                <>
                  <Row gutter={[16, 16]}>
                    {filteredTutors.map((tutor) => (
                      <Col xs={24} sm={12} xl={8} key={tutor.id}>
                        <TutorCard tutor={tutor} />
                      </Col>
                    ))}
                  </Row>
                  <div className="flex justify-center mt-8">
                    <Pagination
                      current={page}
                      pageSize={pageSize}
                      total={totalTutors}
                      onChange={(newPage) => setPage(newPage)}
                      showSizeChanger={false}
                      className="dark:text-white"
                    />
                  </div>
                </>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

