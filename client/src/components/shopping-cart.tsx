import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { CartItem, Product } from "@shared/schema";

type CartItemWithProduct = CartItem & { product: Product };

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return await apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
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
        description: "Không thể cập nhật giỏ hàng.",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Đã xóa khỏi giỏ hàng",
        description: "Sản phẩm đã được xóa khỏi giỏ hàng.",
      });
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
        description: "Không thể xóa sản phẩm khỏi giỏ hàng.",
        variant: "destructive",
      });
    },
  });

  const handleQuantityChange = (item: CartItemWithProduct, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCartMutation.mutate(item.id);
    } else {
      updateCartMutation.mutate({ id: item.id, quantity: newQuantity });
    }
  };

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        description: "Thêm sản phẩm vào giỏ hàng trước khi thanh toán.",
        variant: "destructive",
      });
      return;
    }
    onClose();
    setLocation("/checkout");
  };

  const total = cartItems?.reduce((sum, item) => {
    return sum + (parseFloat(item.product.price) * item.quantity);
  }, 0) || 0;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      {/* Cart Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-card border-l border-border shadow-2xl transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-testid="cart-sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold">Giỏ Hàng</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={onClose}
              data-testid="button-close-cart"
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-muted-foreground">Đang tải...</div>
              </div>
            ) : !cartItems || cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold mb-2">Giỏ hàng trống</h3>
                <p className="text-muted-foreground">Thêm sản phẩm để bắt đầu mua sắm</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center space-x-4 border-b border-border pb-4"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <img 
                      src={item.product.imageUrls?.[0] || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg" 
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.color && `Màu ${item.color}`}
                        {item.color && item.size && ", "}
                        {item.size && `Size ${item.size}`}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-6 h-6 p-0"
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={updateCartMutation.isPending}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <i className="fas fa-minus text-xs"></i>
                          </Button>
                          <span className="text-sm w-8 text-center" data-testid={`text-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-6 h-6 p-0"
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={updateCartMutation.isPending}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <i className="fas fa-plus text-xs"></i>
                          </Button>
                        </div>
                        <span className="font-semibold text-primary" data-testid={`text-item-price-${item.id}`}>
                          {(parseFloat(item.product.price) * item.quantity).toLocaleString()}₫
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => removeFromCartMutation.mutate(item.id)}
                      disabled={removeFromCartMutation.isPending}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems && cartItems.length > 0 && (
            <div className="border-t border-border p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-primary" data-testid="text-cart-total">
                    {total.toLocaleString()}₫
                  </span>
                </div>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 font-semibold"
                  onClick={handleCheckout}
                  data-testid="button-checkout"
                >
                  Tiến Hành Thanh Toán
                </Button>
                <Button 
                  variant="outline"
                  className="w-full py-3 font-semibold"
                  onClick={onClose}
                  data-testid="button-continue-shopping"
                >
                  Tiếp Tục Mua Sắm
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
