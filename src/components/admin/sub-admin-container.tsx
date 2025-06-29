// src/components/create-sub-admin/create-sub-admin-container.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CreateSubAdminContainerProps {
  children: React.ReactNode;
}

export function CreateSubAdminContainer({
  children,
}: CreateSubAdminContainerProps) {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Sub-Admin</CardTitle>
          <CardDescription>
            Add a new sub-administrator to your system. They will receive admin
            privileges.
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
