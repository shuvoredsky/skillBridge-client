"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, Spin, Result, Button } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setVerifying(false);
      setError("No verification token provided");
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setVerifying(true);
    console.log("🔍 Verifying token:", verificationToken);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://skill-bridge-server-omega.vercel.app"}/api/verification/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ token: verificationToken }),
        }
      );

      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        console.log("✅ Success:", data);
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log("❌ Error:", errorData);
        setError(errorData.message || "Verification failed. The link may have expired.");
      }
    } catch (err: any) {
      console.error("💥 Catch error:", err);
      setError("An error occurred during verification. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="w-full max-w-md shadow-2xl">
          <div className="text-center py-8">
            <Spin size="large" />
            <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
              Verifying Your Email
            </h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="w-full max-w-md shadow-2xl">
          <Result
            status="success"
            icon={<CheckCircleOutlined className="text-green-500" />}
            title={
              <h2 className="text-2xl font-bold text-gray-900">
                Email Verified Successfully!
              </h2>
            }
            subTitle="Your email has been verified. You can now log in to your account. Redirecting..."
            extra={[
              <Link href="/login" key="login">
                <Button type="primary" size="large" className="bg-indigo-600">
                  Go to Login
                </Button>
              </Link>,
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Card className="w-full max-w-md shadow-2xl">
        <Result
          status="error"
          icon={<CloseCircleOutlined className="text-red-500" />}
          title={
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
          }
          subTitle={
            <div className="space-y-2">
              <p>{error || "Unable to verify your email."}</p>
              <p className="text-sm text-gray-500">
                The verification link may have expired. Please try registering again.
              </p>
            </div>
          }
          extra={[
            <Link href="/register" key="register">
              <Button size="large">Create New Account</Button>
            </Link>,
            <Link href="/login" key="login">
              <Button type="primary" size="large" className="bg-indigo-600">
                Go to Login
              </Button>
            </Link>,
          ]}
        />
      </Card>
    </div>
  );
}