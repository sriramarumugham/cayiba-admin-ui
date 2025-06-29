import { useBlockAdvertisement } from "@/api/mutations";
import { E_STATUS, useGetAdvertisement } from "@/api/query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Eye, Info, MapPin, Package, User } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

// Image carousel component

// Image carousel component
const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Filter out empty strings and invalid URLs
  const validImages = images?.filter((img) => img && img.trim() !== "") || [];

  // If no valid images, show fallback
  if (validImages.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
        <Package className="h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg font-medium">No Image Available</p>
        <p className="text-gray-400 text-sm">Product image will appear here</p>
      </div>
    );
  }

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const ImageWithFallback = ({
    src,
    alt,
    className,
    index,
  }: {
    src: string;
    alt: string;
    className: string;
    index: number;
  }) => {
    if (imageErrors[index]) {
      return (
        <div
          className={`${className} bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300`}
        >
          <Package className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-xs text-gray-500">Image not found</span>
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => handleImageError(index)}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <ImageWithFallback
          src={validImages[currentImage]}
          alt={`Product image ${currentImage + 1}`}
          className="w-full h-96 object-cover rounded-lg"
          index={currentImage}
        />
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            {currentImage + 1} / {validImages.length}
          </div>
        )}
      </div>
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                currentImage === index ? "border-blue-500" : "border-gray-200"
              }`}
            >
              <ImageWithFallback
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                index={index}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const StatusBadge = ({ status }: { status: E_STATUS }) => {
  const statusConfig = {
    [E_STATUS.ACTIVE]: {
      color: "bg-green-100 text-green-800",
      label: "Active",
    },
    [E_STATUS.BLOCKED]: { color: "bg-red-100 text-red-800", label: "Blocked" },
    [E_STATUS.DELETED]: {
      color: "bg-gray-100 text-gray-800",
      label: "Deleted",
    },
  };

  const config = statusConfig[status];

  return <Badge className={config.color}>{config.label}</Badge>;
};

export const AdvertisementDetails = ({
  advertisementId,
}: {
  advertisementId: string;
}) => {
  const { data, isLoading, error } = useGetAdvertisement(advertisementId);
  const blockAdvertisementMutation = useBlockAdvertisement();

  const handleBlockAdvertisement = () => {
    blockAdvertisementMutation.mutate(advertisementId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-96 w-full" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-20" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Alert className="border-red-200">
          <AlertDescription>
            Failed to load advertisement details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Alert>
          <AlertDescription>Advertisement not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const advertisement = data.data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          <ImageCarousel images={advertisement.images} />
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {advertisement.productName}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="h-4 w-4" />
                <span>{advertisement.views} views</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <StatusBadge status={advertisement.status} />
              {advertisement.status !== E_STATUS.BLOCKED && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBlockAdvertisement}
                  disabled={blockAdvertisementMutation.isPending}
                >
                  {blockAdvertisementMutation.isPending
                    ? "Blocking..."
                    : "Block Advertisement"}
                </Button>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">
              {advertisement.price || "N/A"}
            </span>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {advertisement.productDescription}
              </p>
            </CardContent>
          </Card>

          {/* Product Details */}
          {advertisement.productDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{advertisement.productDetails}</p>
              </CardContent>
            </Card>
          )}

          {/* Location & Category Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-gray-600">
                        {advertisement.city}, {advertisement.zip}
                      </p>
                      <p className="text-xs text-gray-500">
                        {advertisement.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Category</p>
                      <p className="text-sm text-gray-600">
                        {advertisement.categoryName}
                      </p>
                      {advertisement.subcategoryName && (
                        <p className="text-xs text-gray-500">
                          {advertisement.subcategoryName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Posted By</p>
                      <p className="text-sm text-gray-600">
                        {advertisement.uploadedBy.fullName || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Availability</p>
                      <p className="text-sm text-gray-600">
                        {advertisement.inventoryDetails}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    Created:{" "}
                    {new Date(advertisement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    Updated:{" "}
                    {new Date(advertisement.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const AdvertismentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Alert className="border-red-200">
          <AlertDescription>
            Advertisement ID not found in URL.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return <AdvertisementDetails advertisementId={id} />;
};
