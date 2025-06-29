import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { createTypedColumnHelper, DataTable } from "@/components/custom/table";
import {
  fetchAdvertisements,
  type Advertisement,
  E_STATUS,
  E_INVENTORY_STATUS,
} from "@/api/query";
import type { ColumnDef } from "@tanstack/react-table";
import { CopyTruncate } from "@/components/custom/copy-truncate";
import { useQueryClient } from "@tanstack/react-query";
import { StatusFilter } from "@/components/custom/status-tile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router";

const columnHelper = createTypedColumnHelper<Advertisement>();

const STATUS_FILTERS = [
  {
    value: "ALL",
    label: "All Ads",
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    value: E_STATUS.ACTIVE,
    label: "Active",
    color: "bg-green-50 border-green-200 text-green-700",
  },
  {
    value: E_STATUS.BLOCKED,
    label: "Blocked",
    color: "bg-red-50 border-red-200 text-red-700",
  },
  {
    value: E_STATUS.DELETED,
    label: "Deleted",
    color: "bg-gray-50 border-gray-200 text-gray-700",
  },
] as const;

const AdvertisementListPage: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState<string>("ALL");

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["advertisements"] });
  }, [activeStatus, queryClient]);

  const fetchFilteredAdvertisements = async (params: any) => {
    const apiParams = {
      ...params,
      status: activeStatus === "ALL" ? undefined : activeStatus,
    };
    return await fetchAdvertisements(apiParams);
  };

  const navigate = useNavigate();

  const columns = useMemo(
    (): ColumnDef<Advertisement, any>[] => [
      columnHelper.accessor("advertismentId", {
        header: "ID",
        cell: ({ getValue }) => (
          <CopyTruncate value={getValue() ?? "N/A"} trimLength={8} />
        ),
      }),
      columnHelper.accessor("productName", {
        header: "Product Name",
        cell: (info) => (
          <div className="max-w-[200px] truncate font-medium">
            {info.getValue() ?? "N/A"}
          </div>
        ),
      }),
      columnHelper.accessor("categoryName", {
        header: "Category",
        cell: (info) => (
          <div className="text-sm">
            <div className="font-medium">{info.getValue() ?? "N/A"}</div>
            <div className="text-gray-500">
              {info.row.original.subcategoryName ?? "N/A"}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => (
          <div className="font-semibold text-green-600">
            {info.getValue() ?? "N/A"}
          </div>
        ),
      }),
      columnHelper.accessor("views", {
        header: "Views",
        cell: (info) => (
          <div className="text-center">
            {info.getValue()?.toLocaleString() ?? "N/A"}
          </div>
        ),
      }),
      columnHelper.accessor("city", {
        header: "Location",
        cell: (info) => (
          <div className="text-sm">
            <div>{info.getValue() ?? "N/A"}</div>
            <div className="text-gray-500">
              {info.row.original.zip ?? "N/A"}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as E_STATUS;

          const getStatusVariant = (status: E_STATUS) => {
            switch (status) {
              case E_STATUS.ACTIVE:
                return "default"; // Green/primary color
              case E_STATUS.BLOCKED:
                return "destructive"; // Red color
              case E_STATUS.DELETED:
                return "secondary"; // Gray color
              default:
                return "outline"; // Default outline
            }
          };

          return (
            <Badge variant={getStatusVariant(status)}>{status ?? "N/A"}</Badge>
          );
        },
      }),

      columnHelper.accessor("inventoryDetails", {
        header: "Inventory",
        cell: (info) => {
          const inventory = info.getValue() as E_INVENTORY_STATUS;

          const getInventoryVariant = (inventory: E_INVENTORY_STATUS) => {
            switch (inventory) {
              case E_INVENTORY_STATUS.AVAILABLE:
                return "default"; // Green/primary color
              case E_INVENTORY_STATUS.SOLD:
                return "destructive"; // Red color
              case E_INVENTORY_STATUS.UNLIST:
                return "secondary"; // Gray color
              default:
                return "outline"; // Default outline
            }
          };

          return (
            <Badge variant={getInventoryVariant(inventory)}>
              {inventory ?? "N/A"}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: (info) => (
          <div className="text-sm text-gray-600">
            {info.getValue()
              ? new Date(info.getValue()).toLocaleDateString()
              : "N/A"}
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const id = row.original.advertismentId;
          return (
            <Button
              variant="outline"
              className="text-xs"
              onClick={() => navigate(`${ROUTES.ADVERTISMENT_DETATAILS}/${id}`)}
            >
              View More
            </Button>
          );
        },
      }),
    ],
    [],
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-3">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Advertisements</h1>
        <p className="text-gray-600 mt-2">
          Manage and monitor all product advertisements
        </p>
      </div>

      <StatusFilter
        filters={STATUS_FILTERS}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        title="Filter by Status"
      />

      <DataTable<Advertisement>
        columns={columns}
        queryKey="advertisements"
        fetchFn={fetchFilteredAdvertisements}
        searchPlaceholder="Search advertisements..."
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </div>
  );
};

export default AdvertisementListPage;
