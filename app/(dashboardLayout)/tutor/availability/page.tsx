"use client";

import { useEffect, useState } from "react";
import { availabilityService } from "@/services/availability.service";
import { Plus, Trash2, Clock } from "lucide-react";

interface TimeSlot {
  id?: string;
  day: string;
  startTime: string;
  endTime: string;
}

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function TutorAvailabilityPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSlot, setNewSlot] = useState<TimeSlot>({
    day: "MONDAY",
    startTime: "09:00",
    endTime: "10:00",
  });

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const response = await availabilityService.getMyAvailability();
      if (response.data) {
        setSlots(response.data);
      }
    } catch (error) {
      console.error("Failed to load availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async () => {
    setSaving(true);
    try {
      await availabilityService.createSlot(newSlot);
      await loadAvailability();
      setNewSlot({
        day: "MONDAY",
        startTime: "09:00",
        endTime: "10:00",
      });
    } catch (error) {
      console.error("Failed to add slot:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await availabilityService.deleteSlot(id);
      await loadAvailability();
    } catch (error) {
      console.error("Failed to delete slot:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  const groupedSlots = DAYS.map((day) => ({
    day,
    slots: slots.filter((s) => s.day === day),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Manage Your Schedule
        </h1>
        <p className="text-slate-600 mt-1">
          Set your available time slots for students
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock size={24} />
          Add New Time Slot
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={newSlot.day}
            onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={newSlot.startTime}
            onChange={(e) =>
              setNewSlot({ ...newSlot, startTime: e.target.value })
            }
            className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="time"
            value={newSlot.endTime}
            onChange={(e) =>
              setNewSlot({ ...newSlot, endTime: e.target.value })
            }
            className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddSlot}
            disabled={saving}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              "Adding..."
            ) : (
              <>
                <Plus size={20} />
                Add Slot
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {groupedSlots.map((group) => (
          <div
            key={group.day}
            className="bg-white rounded-2xl p-6 border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {group.day}
            </h3>
            {group.slots.length === 0 ? (
              <p className="text-slate-500 text-center py-4">
                No slots available
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-blue-600" />
                      <span className="font-medium text-slate-900">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteSlot(slot.id!)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}