import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { StarRating } from "./star-rating";
import { ReviewsList } from "./reviews-list";
import { ReviewForm } from "./review-form";
import type { Product } from "@shared/schema";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Fetch reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: [`/api/products/${product.id}/reviews`],
    enabled: isOpen && activeTab === "reviews",
  });

  // Check if user can review
  const { data: canReviewData } = useQuery({
    queryKey: [`/api/products/${product.id}/can-review`],
    enabled: isOpen && isAuthenticated && activeTab === "reviews",
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity, size, color }: {
      productId: string;
      quantity: number;
      size?: string;
      color?: string;
    }) => {
      if (!isAuthenticated) {
        window.location.href = "/api/login";
        return;
      }
      return await apiRequest("POST", "/api/cart", {
        productId,
        quantity,
        size,
        color,
      });
    },
    onSuccess: () => {
      toast({
        title: "Đã thêm vào giỏ hàng!",
        description: `${product.name} đã được thêm vào giỏ hàng.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm vào giỏ hàng.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout after adding to cart
    // This will be handled by the success callback
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString() + "₫";
  };

  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  // Use actual product images or fallback to default
  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls
    : ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"];

  // Default sizes and colors if not specified
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];
  const colors = product.colors && product.colors.length > 0 ? product.colors : ["Đỏ", "Xanh", "Đen", "Trắng"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Product Images */}
          <div className="space-y-4">
            <img 
              src={images[selectedImage]} 
              alt={product.name}
              className="w-full h-96 object-cover rounded-xl" 
              data-testid="img-product-main"
            />
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${product.name} view ${index + 1}`}
                  className={`w-full h-20 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-border'
                  }`}
                  onClick={() => setSelectedImage(index)}
                  data-testid={`img-product-thumb-${index}`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2" data-testid="text-product-name">{product.name}</h1>
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }, (_, i) => {
                      const rating = parseFloat(product.rating || "0");
                      const fullStars = Math.floor(rating);
                      const hasHalfStar = rating % 1 >= 0.5;

                      if (i < fullStars) {
                        return <i key={i} className="fas fa-star"></i>;
                      } else if (i === fullStars && hasHalfStar) {
                        return <i key={i} className="fas fa-star-half-alt"></i>;
                      } else {
                        return <i key={i} className="far fa-star"></i>;
                      }
                    })}
                  </div>
                  <span className="text-muted-foreground" data-testid="text-product-rating">
                    {product.rating} ({product.reviewCount} đánh giá)
                  </span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClose}
                data-testid="button-close-modal"
              >
                <i className="fas fa-times text-xl"></i>
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary" data-testid="text-product-price">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice!)}
                    </span>
                    <Badge className="bg-destructive text-destructive-foreground">
                      -{discountPercentage}%
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-muted-foreground" data-testid="text-product-description">
                {product.description || "Sản phẩm thời trang chất lượng cao với thiết kế hiện đại, phù hợp cho mọi dịp."}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {product.stock === 0 ? (
                <Badge variant="destructive" className="text-sm">
                  <i className="fas fa-times-circle mr-2"></i>
                  Hết hàng
                </Badge>
              ) : product.stock <= 5 ? (
                <Badge variant="secondary" className="text-sm bg-yellow-100 text-yellow-800">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Chỉ còn {product.stock} sản phẩm
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-sm bg-green-100 text-green-800">
                  <i className="fas fa-check-circle mr-2"></i>
                  Còn {product.stock} sản phẩm
                </Badge>
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold">Kích Thước:</h3>
              <div className="flex space-x-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={`px-4 py-2 font-semibold ${
                      selectedSize === size 
                        ? "bg-primary text-primary-foreground" 
                        : "border-border hover:border-primary"
                    }`}
                    onClick={() => setSelectedSize(size)}
                    data-testid={`button-size-${size}`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold">Màu Sắc:</h3>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    className={`px-4 py-2 font-semibold ${
                      selectedColor === color 
                        ? "bg-primary text-primary-foreground" 
                        : "border-border hover:border-primary"
                    }`}
                    onClick={() => setSelectedColor(color)}
                    data-testid={`button-color-${color}`}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-semibold">Số Lượng:</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-0 border-2 border-red-400 hover:bg-red-50 hover:border-red-500 transition-colors flex items-center justify-center"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-decrease-quantity"
                >
                  <span className="text-red-600 font-bold text-lg leading-none">−</span>
                </Button>
                <span className="w-16 text-center font-semibold text-lg bg-gray-100 rounded px-4 py-2 border" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-0 border-2 border-green-400 hover:bg-green-50 hover:border-green-500 transition-colors flex items-center justify-center"
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  data-testid="button-increase-quantity"
                >
                  <span className="text-green-600 font-bold text-lg leading-none">+</span>
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 font-semibold"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || product.stock === 0}
                data-testid="button-add-to-cart-modal"
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                {addToCartMutation.isPending ? "Đang thêm..." : "Thêm Vào Giỏ Hàng"}
              </Button>
              <Button 
                variant="outline"
                className="w-full py-3 font-semibold"
                onClick={handleBuyNow}
                disabled={addToCartMutation.isPending || product.stock === 0}
                data-testid="button-buy-now"
              >
                {product.stock === 0 ? "Hết hàng" : "Mua Ngay"}
              </Button>
            </div>

            {/* Tabs for Details and Reviews */}
            <div className="border-t border-border pt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Chi Tiết</TabsTrigger>
                  <TabsTrigger value="reviews" className="flex items-center gap-2">
                    Đánh Giá
                    <Badge variant="secondary" className="text-xs">
                      {product.reviewCount || 0}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  {/* Product Features */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-truck text-primary"></i>
                      <span>Giao hàng miễn phí</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-undo text-primary"></i>
                      <span>Đổi trả trong 7 ngày</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-shield-alt text-primary"></i>
                      <span>Bảo hành chính hãng</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-headset text-primary"></i>
                      <span>Hỗ trợ 24/7</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Overall Rating */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">Đánh giá sản phẩm</h3>
                      <div className="flex items-center gap-3">
                        <StarRating 
                          rating={parseFloat(product.rating || "0")} 
                          size="md" 
                          showValue={true}
                        />
                        <span className="text-sm text-muted-foreground">
                          ({product.reviewCount || 0} đánh giá)
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("reviews")}
                      data-testid="button-view-reviews"
                    >
                      Xem đánh giá
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4 mt-4 max-h-96 overflow-y-auto">
                  {/* Review Form - only show if user can review */}
                  {isAuthenticated && canReviewData?.canReview && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Viết đánh giá của bạn</h3>
                      <ReviewForm 
                        productId={product.id} 
                        onSuccess={() => {
                          // Refresh reviews and can-review status
                          queryClient.invalidateQueries({ 
                            queryKey: [`/api/products/${product.id}/reviews`] 
                          });
                          queryClient.invalidateQueries({ 
                            queryKey: [`/api/products/${product.id}/can-review`] 
                          });
                        }}
                      />
                      <Separator />
                    </div>
                  )}

                  {/* Show message if user cannot review */}
                  {isAuthenticated && canReviewData && !canReviewData.canReview && (
                    <div className="space-y-4">
                      <div className="p-4 bg-secondary/20 rounded-lg text-center">
                        <p className="text-muted-foreground">
                          {canReviewData.reason === "Already reviewed" 
                            ? "Bạn đã đánh giá sản phẩm này rồi"
                            : "Bạn cần mua sản phẩm này trước khi có thể đánh giá"
                          }
                        </p>
                      </div>
                      <Separator />
                    </div>
                  )}

                  {/* Login prompt for non-authenticated users */}
                  {!isAuthenticated && (
                    <div className="space-y-4">
                      <div className="p-4 bg-secondary/20 rounded-lg text-center">
                        <p className="text-muted-foreground mb-2">
                          Đăng nhập để viết đánh giá sản phẩm
                        </p>
                        <Button asChild variant="outline" size="sm">
                          <a href="/api/login">Đăng nhập</a>
                        </Button>
                      </div>
                      <Separator />
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Đánh giá từ khách hàng</h3>
                    <ReviewsList 
                      reviews={reviews || []} 
                      isLoading={reviewsLoading} 
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}