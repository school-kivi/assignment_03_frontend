"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Edit, Upload } from "lucide-react";
import Link from "next/link";
import { Profile } from "@/types";
import {
  updateProfile,
  deleteProfile,
  uploadProfilesCSV,
} from "@/lib/api/profiles";
import { getFullName } from "@/lib/utils/profiles";
import { useProfiles } from "@/lib/hooks/useProfiles";
import { useHoverPopup } from "@/lib/hooks/useHoverPopup";

export default function StudentAccounts() {
  const { profiles, refetch } = useProfiles();
  const {
    hoveredItem: hoveredProfile,
    handleItemMouseEnter,
    handleItemMouseLeave,
    handlePopupMouseEnter,
    handlePopupMouseLeave,
  } = useHoverPopup(profiles);

  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadingCSV, setUploadingCSV] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    person_number: "",
    address: "",
  });

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData({
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      person_number: profile.person_number,
      address: profile.address,
    });
    setIsDialogOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    setLoading(true);
    setError(null);

    try {
      await updateProfile(editingProfile.id, formData);
      setSuccess("Profile updated successfully!");
      setIsDialogOpen(false);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (profileId: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;

    try {
      await deleteProfile(profileId);
      setSuccess("Profile deleted successfully!");
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) return;

    setUploadingCSV(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await uploadProfilesCSV(csvFile);
      setSuccess(
        `CSV imported successfully! ${result.imported} profiles added.${
          result.failed > 0 ? ` ${result.failed} rows failed.` : ""
        }`
      );
      setCsvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUploadingCSV(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Student Accounts</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* CSV Import Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Import Students from CSV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="csv-file">CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  CSV must have columns: user_id, first_name, last_name, phone,
                  person_number, is_admin, address
                </p>
              </div>
              <Button
                onClick={handleCSVUpload}
                disabled={!csvFile || uploadingCSV}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadingCSV ? "Uploading..." : "Upload CSV"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Profiles Table */}
        <Card ref={cardRef} className="overflow-visible">
          <CardHeader>
            <CardTitle>All Student Profiles ({profiles.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-visible">
            <div className="relative overflow-visible">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Person Number</TableHead>
                    <TableHead>Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow
                      key={profile.id}
                      className="relative"
                      onMouseEnter={() => handleItemMouseEnter(profile.id)}
                      onMouseLeave={handleItemMouseLeave}
                    >
                      <TableCell>{getFullName(profile)}</TableCell>
                      <TableCell>{profile.email || ""}</TableCell>
                      <TableCell>{profile.phone}</TableCell>
                      <TableCell>{profile.person_number}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {profile.address}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Popup rendered completely outside table structure */}
        {hoveredProfile && (
          <div
            className="fixed z-[9999] pointer-events-auto"
            style={{
              left: cardRef.current
                ? `${cardRef.current.getBoundingClientRect().right + 20}px`
                : "calc(100% - 1rem)",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onMouseEnter={handlePopupMouseEnter}
            onMouseLeave={handlePopupMouseLeave}
          >
            <div className="bg-background shadow-md rounded-lg p-4 border min-w-[300px]">
              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-lg">
                  {getFullName(hoveredProfile)}
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Mail:</span>{" "}
                    {hoveredProfile.email || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Pers. nr.:</span>{" "}
                    {hoveredProfile.person_number}
                  </p>
                  <p>
                    <span className="font-medium">Tel. nr.:</span>{" "}
                    {hoveredProfile.phone}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {hoveredProfile.address}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(hoveredProfile)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(hoveredProfile.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update student profile information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="person_number">Person Number</Label>
                <Input
                  id="person_number"
                  value={formData.person_number}
                  onChange={(e) =>
                    setFormData({ ...formData, person_number: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
