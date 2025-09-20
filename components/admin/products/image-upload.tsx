"use client";

import { useState, useRef } from "react";
import {
  Box,
  Button,
  Grid,
  Image,
  Text,
  VStack,
  HStack,
  Icon,
  Circle,
  Flex,
} from "@chakra-ui/react";
import { FaCloudUploadAlt, FaTrash, FaImage, FaPlus } from "react-icons/fa";
import { useColorModeValue } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";

interface ImageUploadProps {
  productId?: string;
  initialImages?: string[];
  onImagesChange?: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  productId,
  initialImages = [],
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Using toaster from UI components

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const hoverBgColor = useColorModeValue("gray.100", "gray.600");

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    // Check file limits
    if (images.length + fileArray.length > maxImages) {
      toaster.create({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        type: "error",
        duration: 3000,
      });
      return;
    }

    uploadImages(fileArray);
  };

  const uploadImages = async (files: File[]) => {
    if (!productId) {
      // If no productId, just preview images locally
      const newImageUrls = files.map((file) => URL.createObjectURL(file));
      const updatedImages = [...images, ...newImageUrls];
      setImages(updatedImages);
      onImagesChange?.(updatedImages);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      formData.append("productId", productId);

      const response = await fetch("/api/admin/products/images", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const updatedImages = [...images, ...result.imageUrls];
        setImages(updatedImages);
        onImagesChange?.(updatedImages);

        toaster.create({
          title: "Images uploaded successfully",
          description: result.message,
          type: "success",
          duration: 3000,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toaster.create({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload images",
        type: "error",
        duration: 5000,
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageUrl: string, index: number) => {
    if (productId && !imageUrl.startsWith("blob:")) {
      // Delete from server
      try {
        const response = await fetch(
          `/api/admin/products/images?productId=${productId}&imageUrl=${encodeURIComponent(
            imageUrl
          )}`,
          { method: "DELETE" }
        );

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error);
        }
      } catch (error) {
        toaster.create({
          title: "Delete failed",
          description:
            error instanceof Error ? error.message : "Failed to delete image",
          type: "error",
          duration: 5000,
        });
        return;
      }
    }

    // Remove from local state
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <VStack gap={4} align="stretch">
      <Text fontSize="sm" fontWeight="medium">
        Product Images (Max {maxImages})
      </Text>

      {/* Upload Area */}
      <Box
        border="2px dashed"
        borderColor={dragActive ? "blue.400" : borderColor}
        borderRadius="lg"
        p={6}
        textAlign="center"
        bg={dragActive ? "blue.50" : bgColor}
        _hover={{ bg: hoverBgColor, borderColor: "blue.400" }}
        cursor="pointer"
        transition="all 0.2s"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <VStack gap={3}>
          <Circle size="60px" bg="blue.100" color="blue.500">
            <Icon boxSize="24px">
              <FaCloudUploadAlt />
            </Icon>
          </Circle>
          <VStack gap={1}>
            <Text fontWeight="medium">
              {uploading
                ? "Uploading..."
                : "Drop images here or click to browse"}
            </Text>
            <Text fontSize="sm" color="gray.500">
              PNG, JPG, WebP up to 5MB each
            </Text>
          </VStack>
          <Button
            leftIcon={<FaPlus />}
            size="sm"
            variant="outline"
            isLoading={uploading}
            loadingText="Uploading"
          >
            Add Images
          </Button>
        </VStack>
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Image Grid */}
      {images.length > 0 && (
        <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={4}>
          {images.map((imageUrl, index) => (
            <Box key={index} position="relative" group>
              <Box
                borderRadius="lg"
                overflow="hidden"
                border="1px solid"
                borderColor={borderColor}
                aspectRatio="1"
              >
                <Image
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  w="full"
                  h="full"
                  objectFit="cover"
                  fallback={
                    <Flex align="center" justify="center" h="full" bg={bgColor}>
                      <Icon color="gray.400" boxSize="24px">
                        <FaImage />
                      </Icon>
                    </Flex>
                  }
                />
              </Box>

              {/* Delete Button */}
              <Button
                position="absolute"
                top={2}
                right={2}
                size="sm"
                colorScheme="red"
                variant="solid"
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.2s"
                onClick={() => removeImage(imageUrl, index)}
              >
                <Icon>
                  <FaTrash />
                </Icon>
              </Button>

              {/* Main Image Indicator */}
              {index === 0 && (
                <Box
                  position="absolute"
                  bottom={2}
                  left={2}
                  bg="blue.500"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  Main
                </Box>
              )}
            </Box>
          ))}
        </Grid>
      )}

      {images.length === 0 && (
        <Box textAlign="center" py={8} color="gray.500" fontSize="sm">
          No images uploaded yet
        </Box>
      )}
    </VStack>
  );
}
