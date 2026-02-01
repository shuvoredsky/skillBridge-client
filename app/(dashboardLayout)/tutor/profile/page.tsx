"use client";

import { useEffect, useState } from "react";
import { tutorService } from "../../../../src/services/tutor.service";
import { Save, User, DollarSign, BookOpen, Briefcase } from "lucide-react";

interface TutorProfile {
  bio: string;
  subjects: string[];
  hourlyRate: number;
  experience: string;
  education: string;
}

export default function TutorProfilePage() {
  const [profile, setProfile] = useState<TutorProfile>({
    bio: "",
    subjects: [],
    hourlyRate: 0,
    experience: "",
    education: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await tutorService.getMyProfile();
      if (response.data) {
        setProfile({
          bio: response.data.bio || "",
          subjects: response.data.subjects || [],
          hourlyRate: response.data.hourlyRate || 0,
          experience: response.data.experience || "",
          education: response.data.education || "",
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await tutorService.updateProfile(profile);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !profile.subjects.includes(newSubject.trim())) {
      setProfile({
        ...profile,
        subjects: [...profile.subjects, newSubject.trim()],
      });
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setProfile({
      ...profile,
      subjects: profile.subjects.filter((s) => s !== subject),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
        <p className="text-slate-600 mt-1">
          Update your teaching information
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <User size={18} />
            Bio
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell students about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <BookOpen size={18} />
            Subjects
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddSubject()}
              placeholder="Add a subject"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddSubject}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.subjects.map((subject) => (
              <span
                key={subject}
                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
              >
                {subject}
                <button
                  onClick={() => handleRemoveSubject(subject)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <DollarSign size={18} />
            Hourly Rate ($)
          </label>
          <input
            type="number"
            value={profile.hourlyRate}
            onChange={(e) =>
              setProfile({ ...profile, hourlyRate: Number(e.target.value) })
            }
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Briefcase size={18} />
            Experience
          </label>
          <input
            type="text"
            value={profile.experience}
            onChange={(e) =>
              setProfile({ ...profile, experience: e.target.value })
            }
            placeholder="e.g., 5 years teaching experience"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <BookOpen size={18} />
            Education
          </label>
          <input
            type="text"
            value={profile.education}
            onChange={(e) =>
              setProfile({ ...profile, education: e.target.value })
            }
            placeholder="e.g., Master's in Computer Science"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            "Saving..."
          ) : (
            <>
              <Save size={20} />
              Save Profile
            </>
          )}
        </button>
      </div>
    </div>
  );
}