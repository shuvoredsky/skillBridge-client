"use client";

import TutorCard from "@/components/shared/TutorCard";

interface FeaturedTutorsSectionProps {
  featuredTutors: any[];
}

export default function FeaturedTutorsSection({
  featuredTutors,
}: FeaturedTutorsSectionProps) {
  if (!featuredTutors || featuredTutors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No featured tutors available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredTutors.map((tutor: any, index: number) => (
        <TutorCard
          key={tutor.id}
          tutor={tutor}
          variant="featured"
          index={index}
        />
      ))}
    </div>
  );
}
