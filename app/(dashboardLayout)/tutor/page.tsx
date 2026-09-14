"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Statistic, Empty, Spin, Alert, Button, message } from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  UploadOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { tutorService } from  "../../../services/tutor.service";;
import { useRouter } from "next/navigation";
import type { TutorProfile, Session } from "@/types/tutor";

function DocumentUploadCard({
  label,
  type,
  uploadedDoc,
  onUpload,
  loading
}: {
  label: string;
  type: "degree" | "nid" | "certificate";
  uploadedDoc?: any;
  onUpload: (file: File, type: "degree" | "nid" | "certificate") => void;
  loading: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card size="small" className="dark:bg-slate-900/60 dark:border-slate-800 hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center text-center p-2 gap-2">
        <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 dark:text-gray-400">
          <FileImageOutlined style={{ fontSize: 24 }} />
        </div>
        <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{label}</div>
        
        {uploadedDoc ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-brand-green font-semibold flex items-center gap-1">
              <CheckCircleOutlined /> Uploaded
            </span>
            <a 
              href={uploadedDoc.url} 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs text-brand-green hover:text-brand-green-hover hover:underline font-semibold"
            >
              View Document
            </a>
          </div>
        ) : (
          <span className="text-xs text-amber-500 font-medium">Missing File</span>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
              if (!allowedTypes.includes(file.type)) {
                message.error("Only JPEG, PNG, and WebP images are allowed.");
                return;
              }
              if (file.size > 5 * 1024 * 1024) {
                message.error("Maximum file size allowed is 5MB.");
                return;
              }
              onUpload(file, type);
            }
          }}
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
        />

        <Button
          size="small"
          icon={<UploadOutlined />}
          loading={loading}
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 text-xs font-semibold h-8 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:border-brand-green hover:text-brand-green dark:hover:text-brand-green rounded-lg"
        >
          {uploadedDoc ? "Replace" : "Upload"}
        </Button>
      </div>
    </Card>
  );
}

export default function TutorDashboard() {
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUploadDocument = async (file: File, type: "degree" | "nid" | "certificate") => {
    if (!profile) return;
    setUploadingDoc(type);
    try {
      const { data, error } = await tutorService.uploadDocument(profile.id, file, type);
      if (error) {
        message.error(error);
      } else {
        message.success(`${type.toUpperCase()} uploaded successfully!`);
        // Optimistically update document in local state
        if (data) {
          const updatedDoc = (data as any).data || data;
          setProfile((prev) => {
            if (!prev) return prev;
            const existingDocs = prev.documents || [];
            const filteredDocs = existingDocs.filter(
              (d) => d.type.toLowerCase() !== type.toLowerCase()
            );
            return {
              ...prev,
              documents: [...filteredDocs, updatedDoc],
            };
          });
        }
        // Refresh dashboard state silently in the background
        await loadDashboardData(true);
      }
    } catch (err) {
      console.error(err);
      message.error(`Failed to upload ${type}`);
    } finally {
      setUploadingDoc(null);
    }
  };

  const loadDashboardData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      const [profileRes, sessionsRes] = await Promise.all([
        tutorService.getMyProfile(),
        tutorService.getMySessions(),
      ]);

      if (profileRes.data) setProfile(profileRes.data as any);
      if (sessionsRes.data) setSessions(sessionsRes.data as any);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin fullscreen size="large" tip="Loading your dashboard..." />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <Empty
          description={<span className="dark:text-gray-400">You haven't created your tutor profile yet</span>}
          style={{ padding: "40px 0" }}
        >
          <button
            onClick={() => router.push("/tutor/profile")}
            className="bg-brand-green hover:bg-brand-green-hover text-white font-medium px-6 py-2.5 rounded-lg border-0 transition-all cursor-pointer text-base"
          >
            Create Profile Now
          </button>
        </Empty>
      </Card>
    );
  }

  const confirmedSessions = sessions.filter((s) => s.status === "CONFIRMED");
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");

  const renderVerificationSection = () => {
    if (!profile) return null;

    const status = profile.verificationStatus || "PENDING";
    const docs = profile.documents || [];
    const degreeDoc = docs.find((d) => d.type === "DEGREE");
    const nidDoc = docs.find((d) => d.type === "NID");
    const certificateDoc = docs.find((d) => d.type === "CERTIFICATE");
    const allUploaded = !!(degreeDoc && nidDoc && certificateDoc);

    if (status === "APPROVED") {
      return (
        <Alert
          message={
            <span className="font-bold text-emerald-800 dark:text-emerald-300">
              Profile Verified & Active
            </span>
          }
          description={
            <span className="text-emerald-700 dark:text-emerald-400">
              Your tutor profile has been approved! You are now visible to the public and ready to receive bookings.
            </span>
          }
          type="success"
          showIcon
          className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 rounded-xl"
        />
      );
    }

    if (status === "REJECTED") {
      return (
        <Card 
          className="border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/10 shadow-sm rounded-xl overflow-hidden"
          title={
            <span className="font-bold text-red-800 dark:text-red-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
              Verification Rejected
            </span>
          }
        >
          <div className="flex flex-col gap-4">
            <p className="text-red-700 dark:text-red-400 font-medium">
              {profile.rejectionReason 
                ? `Reason for rejection: ${profile.rejectionReason}`
                : "Your profile verification was rejected by administrators. Please review your documents and upload valid copies below to re-submit for review."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <DocumentUploadCard 
                label="Degree Certificate" 
                type="degree" 
                uploadedDoc={degreeDoc} 
                onUpload={handleUploadDocument}
                loading={uploadingDoc === "degree"}
              />
              <DocumentUploadCard 
                label="National ID (NID)" 
                type="nid" 
                uploadedDoc={nidDoc} 
                onUpload={handleUploadDocument}
                loading={uploadingDoc === "nid"}
              />
              <DocumentUploadCard 
                label="Teaching Certificate" 
                type="certificate" 
                uploadedDoc={certificateDoc} 
                onUpload={handleUploadDocument}
                loading={uploadingDoc === "certificate"}
              />
            </div>
          </div>
        </Card>
      );
    }

    // Default status: PENDING
    return (
      <Card 
        className="border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/5 shadow-sm rounded-xl overflow-hidden"
        title={
          <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></span>
            {allUploaded ? "Verification Pending Review" : "Action Required: Complete Profile Verification"}
          </span>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-amber-700 dark:text-amber-400 font-medium">
            {allUploaded 
              ? "Your documents have been submitted and are currently under review. While pending approval, your profile remains hidden from the public directory and cannot be booked."
              : "Please upload your Degree Certificate, National ID (NID), and Teaching Certificate to complete your verification and submit your profile for admin approval."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <DocumentUploadCard 
              label="Degree Certificate" 
              type="degree" 
              uploadedDoc={degreeDoc} 
              onUpload={handleUploadDocument}
              loading={uploadingDoc === "degree"}
            />
            <DocumentUploadCard 
              label="National ID (NID)" 
              type="nid" 
              uploadedDoc={nidDoc} 
              onUpload={handleUploadDocument}
              loading={uploadingDoc === "nid"}
            />
            <DocumentUploadCard 
              label="Teaching Certificate" 
              type="certificate" 
              uploadedDoc={certificateDoc} 
              onUpload={handleUploadDocument}
              loading={uploadingDoc === "certificate"}
            />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's what's happening with your tutoring sessions
        </p>
      </div>

      {renderVerificationSection()}

      {profile.totalReviews === 0 && (
        <Alert
          message="Get your first review!"
          description="Complete sessions and encourage students to leave reviews to build your reputation."
          type="info"
          showIcon
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <Statistic
              title={<span className="dark:text-gray-400">Total Sessions</span>}
              value={sessions.length}
              prefix={<CalendarOutlined className="text-brand-green" />}
              styles={{ content: { color: "#10b981" } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <Statistic
              title={<span className="dark:text-gray-400">Upcoming</span>}
              value={confirmedSessions.length}
              prefix={<ClockCircleOutlined className="text-amber-500" />}
              styles={{ content: { color: "#f59e0b" } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <Statistic
              title={<span className="dark:text-gray-400">Completed</span>}
              value={completedSessions.length}
              prefix={<CheckCircleOutlined className="text-brand-green" />}
              styles={{ content: { color: "#10b981" } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <Statistic
              title={<span className="dark:text-gray-400">Rating</span>}
              value={profile.rating.toFixed(1)}
              prefix={<StarOutlined className="text-amber-500" />}
              suffix={`/ 5.0`}
              styles={{ content: { color: "#f59e0b" } }}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {profile.totalReviews} reviews
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={<span className="dark:text-white">Profile Summary</span>} extra={
            <a onClick={() => router.push("/tutor/profile")} className="text-brand-green hover:text-brand-green-hover font-semibold cursor-pointer">
              Edit
            </a>
          } className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col gap-4">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-2">Subjects</div>
                <div className="flex gap-2 flex-wrap">
                  {profile.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-brand-green dark:text-brand-green font-medium rounded-md text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">Hourly Rate</div>
                <div className="text-lg font-bold text-brand-green">
                  ${profile.hourlyRate}/hour
                </div>
              </div>

              {profile.experience && (
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">Experience</div>
                  <div className="text-gray-600 dark:text-gray-300">{profile.experience}</div>
                </div>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={<span className="dark:text-white">Quick Actions</span>} className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/tutor/availability")}
                className="w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-brand-green hover:text-brand-green dark:hover:text-brand-green transition-colors cursor-pointer text-sm font-medium"
              >
                <ClockCircleOutlined />
                <span>Manage Availability</span>
              </button>

              <button
                onClick={() => router.push("/tutor/sessions")}
                className="w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-brand-green hover:text-brand-green dark:hover:text-brand-green transition-colors cursor-pointer text-sm font-medium"
              >
                <CalendarOutlined />
                <span>View All Sessions</span>
              </button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
