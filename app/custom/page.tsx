"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Download, ShoppingCart, RotateCcw } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { AddToCart } from "@/components/add-to-cart";
import { SiteHeader } from "@/components/site-header";

export default function CustomPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 45 });
  const [imageSize, setImageSize] = useState(30);
  const [selectedColor, setSelectedColor] = useState("white");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tshirtColors = [
    {
      name: "White",
      value: "white",
      bg: "bg-white",
      border: "border-gray-300",
    },
    {
      name: "Black",
      value: "black",
      bg: "bg-gray-900",
      border: "border-gray-700",
    },
    {
      name: "Navy",
      value: "navy",
      bg: "bg-blue-900",
      border: "border-blue-800",
    },
    { name: "Red", value: "red", bg: "bg-red-600", border: "border-red-500" },
    {
      name: "Green",
      value: "green",
      bg: "bg-green-600",
      border: "border-green-500",
    },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetDesign = () => {
    setUploadedImage(null);
    setImagePosition({ x: 50, y: 45 });
    setImageSize(30);
    setSelectedColor("white");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50  transition-colors">
      <SiteHeader currentPath="/custom" />

      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Custom Designer
          </Badge>
          <Link href="/">
            <Button variant="outline" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900  mb-4">
            Design Your Custom T-Shirt
          </h1>
          <p className="text-lg text-gray-600  max-w-2xl mx-auto">
            Upload your design and see it come to life on our premium t-shirts.
            Customize colors, size, and position to create your perfect piece.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Design Controls */}
          <div className="space-y-6">
            {/* Upload Section */}
            <Card className="bg-white  border-gray-200 ">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-tight text-foreground text-gray-900  mb-4">
                  Upload Your Design
                </h3>

                {!uploadedImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600  mb-2">
                      Click to upload your design
                    </p>
                    <p className="text-sm text-gray-500 ">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="border border-gray-200  rounded-lg p-4 bg-gray-50 ">
                      <Image
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded design"
                        width={200}
                        height={200}
                        className="w-full h-32 object-contain rounded"
                      />
                    </div>
                    <Button
                      onClick={removeImage}
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* T-Shirt Color Selection */}
            <Card className="bg-white  border-gray-200 ">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-tight text-foreground text-gray-900  mb-4">
                  Choose T-Shirt Color
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {tshirtColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-12 h-12 rounded-full border-2 ${color.bg} ${
                        color.border
                      } ${
                        selectedColor === color.value
                          ? "ring-2 ring-blue-500 ring-offset-2 "
                          : ""
                      } transition-all`}
                      title={color.name}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600  mt-2">
                  Selected:{" "}
                  {tshirtColors.find((c) => c.value === selectedColor)?.name}
                </p>
              </CardContent>
            </Card>

            {/* Design Controls */}
            {uploadedImage && (
              <Card className="bg-white  border-gray-200 ">
                <CardContent className="p-6">
                  <h3 className="text-sm font-bold uppercase tracking-tight text-foreground text-gray-900  mb-4">
                    Adjust Design
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700  mb-2">
                        Size: {imageSize}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="60"
                        value={imageSize}
                        onChange={(e) => setImageSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200  rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700  mb-2">
                        Horizontal Position: {imagePosition.x}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={imagePosition.x}
                        onChange={(e) =>
                          setImagePosition((prev) => ({
                            ...prev,
                            x: Number(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-gray-200  rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700  mb-2">
                        Vertical Position: {imagePosition.y}%
                      </label>
                      <input
                        type="range"
                        min="25"
                        max="75"
                        value={imagePosition.y}
                        onChange={(e) =>
                          setImagePosition((prev) => ({
                            ...prev,
                            y: Number(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-gray-200  rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={resetDesign}
                  variant="outline"
                  className="flex-1"
                >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Design
              </Button>
              {uploadedImage && (
                <>
                  
                  <AddToCart
                    productId="custom-design"
                    name={`Custom ${selectedColor} T-Shirt`}
                    price={499}
                    image="/placeholder.svg?height=400&width=400&text=Custom+Design"
                    category="Custom"
                    defaultColor={selectedColor}
                    colors={tshirtColors.map((c) => c.name)}
                    className="flex-1 bg-gray-900 hover:bg-gray-800"
                  />
                </>
              )}
            </div>
          </div>

          {/* T-Shirt Preview */}
          <div className="lg:sticky lg:top-8">
            <Card className="bg-white  border-gray-200 ">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-tight text-foreground text-gray-900  mb-4 text-center">
                  Live Preview
                </h3>

                <div className="relative mx-auto" style={{ maxWidth: "400px" }}>
                  {/* T-Shirt Base */}
                  <div className="relative aspect-[4/5] mx-auto">
                    <div className="tshirt-icon-container relative w-full h-full flex items-center justify-center">
                      <i
                        className="fas fa-tshirt tshirt-icon"
                        style={{
                          fontSize: "320px",
                          color:
                            selectedColor === "white"
                              ? "#ffffff"
                              : selectedColor === "black"
                              ? "#1f2937"
                              : selectedColor === "navy"
                              ? "#1e3a8a"
                              : selectedColor === "red"
                              ? "#dc2626"
                              : selectedColor === "green"
                              ? "#16a34a"
                              : "#ffffff",
                          filter: `drop-shadow(0 10px 20px rgba(0,0,0,0.2)) ${
                            selectedColor === "white"
                              ? "drop-shadow(0 0 0 1px rgba(0,0,0,0.1))"
                              : ""
                          }`,
                          WebkitTextStroke:
                            selectedColor === "white" ? "1px #e5e7eb" : "none",
                        }}
                      />

                      {/* Design Area Overlay */}
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          top: "32%",
                          left: "35%",
                          width: "30%",
                          height: "25%",
                          zIndex: 10,
                        }}
                      >
                        {/* Uploaded Image Overlay */}
                        {uploadedImage && (
                          <div
                            className="absolute rounded-lg overflow-hidden"
                            style={{
                              left: `${(imagePosition.x - 50) * 2}%`,
                              top: `${(imagePosition.y - 45) * 2}%`,
                              width: `${imageSize * 1.2}%`,
                              height: `${imageSize * 0.9}%`,
                              transform: "translate(-50%, -50%)",
                              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))",
                              zIndex: 15,
                            }}
                          >
                            <Image
                              src={uploadedImage || "/placeholder.svg"}
                              alt="Custom design"
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}

                        {!uploadedImage && (
                          <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-300  rounded-lg bg-white/20 backdrop-blur-sm">
                            <div className="text-center text-gray-500 ">
                              <Upload className="w-8 h-8 mx-auto mb-1 opacity-50" />
                              <p className="text-xs">Design Area</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-6 text-center space-y-2">
                  <h4 className="font-semibold text-gray-900 ">
                    Custom Premium T-Shirt
                  </h4>
                  <p className="text-sm text-gray-600 ">
                    100% Cotton •{" "}
                    {tshirtColors.find((c) => c.value === selectedColor)?.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 ">
                    ₹499.00
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
