import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { createTypedColumnHelper, DataTable } from "@/components/custom/table";
import { fetchSubAdmins, type SubAdmin } from "@/api/query";
import type { ColumnDef } from "@tanstack/react-table";
import { CopyTruncate } from "@/components/custom/copy-truncate";

const columnHelper = createTypedColumnHelper<SubAdmin>();

const SubAdminListPage: React.FC = () => {
  const columns = useMemo(
    (): ColumnDef<SubAdmin, any>[] => [
      columnHelper.accessor("adminId", {
        header: "ID",
        cell: ({ getValue }) => (
          <CopyTruncate value={getValue()} trimLength={6} />
        ),
      }),
      columnHelper.accessor("fullName", {
        header: "Full Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("phoneNumber", {
        header: "Phone",
        cell: (info) => `${info.row.original.countryCode} ${info.getValue()}`,
      }),
      columnHelper.accessor("country", {
        header: "Country",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => <Badge variant="destructive">{info.getValue()}</Badge>,
      }),
      columnHelper.accessor("referralCode", {
        header: "Referral Code",
        cell: (info) => info.getValue(),
      }),
    ],
    [],
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sub-Admin List</h1>
      <DataTable<SubAdmin>
        columns={columns}
        queryKey="sub-admins"
        fetchFn={fetchSubAdmins}
        searchPlaceholder="Search sub-admins..."
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </div>
  );
};

export default SubAdminListPage;
