"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Lock, Globe, Mail, Shield } from "lucide-react";
import { Button, Input, Textarea, toast } from "@/components/ui/common";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiServices, ApiError } from "@/api.services";

const generalSettingsSchema = z.object({
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .max(200, "Name must not exceed 200 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone is required").max(30, "Phone must not exceed 30 characters"),
  address: z.string().max(500, "Address must not exceed 500 characters").optional().or(z.literal("")),
  mapLocationKeyframe: z.string().max(5000, "Map keyframe must not exceed 5000 characters").optional().or(z.literal("")),
});

type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;

const defaultValues: GeneralSettingsFormData = {
  organizationName: "Waah Foundation",
  email: "contact@waahfoundation.org",
  phone: "",
  address: "",
  mapLocationKeyframe: "",
};

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const passwordDefaultValues: PasswordFormData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GeneralSettingsFormData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    let cancelled = false;
    async function fetchSettings() {
      try {
        const res = await apiServices.getSettings();
        const d = res?.data;
        if (d && !cancelled) {
          reset({
            organizationName: d.organizationName ?? defaultValues.organizationName,
            email: d.email ?? defaultValues.email,
            phone: d.phone ?? defaultValues.phone,
            address: d.address ?? defaultValues.address,
            mapLocationKeyframe: d.mapLocationKeyframe ?? defaultValues.mapLocationKeyframe,
          });
        }
      } catch {
        if (!cancelled) reset(defaultValues);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchSettings();
    return () => {
      cancelled = true;
    };
  }, [reset]);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: passwordDefaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: GeneralSettingsFormData) => {
    setSaving(true);
    try {
      const res = await apiServices.updateSettings({
        organizationName: data.organizationName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        mapLocationKeyframe: data.mapLocationKeyframe,
      });
      toast.success(res?.message ?? "Settings saved");
      reset(data);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setUpdatingPassword(true);
    try {
      const res = await apiServices.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success(res?.message ?? "Password updated");
      passwordForm.reset(passwordDefaultValues);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your admin settings and preferences</p>
        </div>
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          Loading settings…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your admin settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-xl bg-white shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg bg-primary/10 p-2">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Organization Name"
                {...register("organizationName")}
                error={errors.organizationName?.message}
                className="w-full"
                type="text"
              />
              <Input
                label="Email Address"
                {...register("email")}
                error={errors.email?.message}
                className="w-full"
                type="email"
              />
              <Input
                label="Phone Number"
                {...register("phone")}
                error={errors.phone?.message}
                className="w-full"
                type="tel"
                placeholder="e.g. +91 98765 43210"
              />
              <Input
                label="Address"
                {...register("address")}
                error={errors.address?.message}
                className="w-full"
                type="text"
                placeholder="Street, City, State, PIN"
              />
              <Textarea
                label="Map location keyframe"
                {...register("mapLocationKeyframe")}
                error={errors.mapLocationKeyframe?.message}
                className="w-full"
                rows={4}
                placeholder="Paste iframe embed or location snippet for the map"
                helperText="Use the embed code from Google Maps (Share → Embed a map) or a location URL/snippet."
              />
              <Button
                type="submit"
                variant="primary"
                className="mt-4"
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>

          {/* Security Settings */}
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="rounded-xl bg-white shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg bg-primary/10 p-2">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Current Password"
                {...passwordForm.register("currentPassword")}
                error={passwordForm.formState.errors.currentPassword?.message}
                type="password"
                placeholder="Enter current password"
                className="w-full"
              />
              <Input
                label="New Password"
                {...passwordForm.register("newPassword")}
                error={passwordForm.formState.errors.newPassword?.message}
                type="password"
                placeholder="Enter new password (min 6 characters)"
                className="w-full"
              />
              <Input
                label="Confirm New Password"
                {...passwordForm.register("confirmPassword")}
                error={passwordForm.formState.errors.confirmPassword?.message}
                type="password"
                placeholder="Confirm new password"
                className="w-full"
              />
              <Button
                variant="primary"
                className="mt-4"
                type="submit"
                disabled={updatingPassword}
              >
                <Save className="mr-2 h-4 w-4" />
                {updatingPassword ? "Updating…" : "Update Password"}
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl bg-linear-to-br from-primary to-primary-hard p-6 text-white shadow-lg">
            <Settings className="h-8 w-8 mb-4" />
            <h3 className="text-lg font-bold mb-2">Settings</h3>
            <p className="text-sm text-white/90">
              Manage your organization settings, notifications, and security preferences from here.
            </p>
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Security Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Use a strong, unique password</li>
              <li>• Enable two-factor authentication</li>
              <li>• Regularly review access logs</li>
              <li>• Keep your email updated</li>
            </ul>
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Support</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Need help with settings? Contact our support team.
            </p>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
