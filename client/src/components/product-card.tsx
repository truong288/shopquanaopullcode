import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import ProductModal from "./product-modal";
import { StarRating } from "./star-rating";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  "data-testid"?: string;
}

export default function ProductCard({ product, "data-testid": testId }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Debug logging
  console.log("Product images for", product.name, ":", product.imageUrls);

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCartMutation.mutate({
      productId: product.id,
      quantity: 1,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString() + "₫";
  };

  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  return (
    <>
      <Card 
        className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
        data-testid={testId}
      >
        <div className="relative overflow-hidden">
          <img 
            src={
              product.imageUrls && product.imageUrls.length > 0 && product.imageUrls[0] && product.imageUrls[0].trim() !== ""
                ? product.imageUrls[0] 
                : "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
            } 
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.log("Image load error for product:", product.name, "URL:", product.imageUrls?.[0]);
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500";
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isFeatured && (
              <Badge className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-1">
                NEW
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
              onClick={handleWishlistToggle}
              data-testid={`button-wishlist-${product.id}`}
            >
              <i className={`fas fa-heart ${isWishlisted ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}></i>
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description || "Sản phẩm thời trang chất lượng cao"}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
            </div>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-lg transition-colors"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending || product.stock === 0}
              data-testid={`button-add-to-cart-${product.id}`}
            >
              <i className="fas fa-plus"></i>
            </Button>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <StarRating 
              rating={parseFloat(product.rating || "0")} 
              size="sm" 
              showValue={true}
              data-testid={`product-rating-${product.id}`}
            />
            <span className="text-muted-foreground text-xs">
              ({product.reviewCount || 0} đánh giá)
            </span>
          </div>

          {/* Stock Status */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {product.stock === 0 ? (
                <Badge variant="destructive" className="text-xs">
                  Hết hàng
                </Badge>
              ) : product.stock <= 5 ? (
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                  Còn {product.stock} sản phẩm
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  Còn hàng
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
