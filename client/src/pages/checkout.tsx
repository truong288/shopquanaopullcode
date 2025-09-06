import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { CartItem, Product } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

type CartItemWithProduct = CartItem & { product: Product };

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();

  // Form state
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    province: "",
    district: "",
    ward: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notes, setNotes] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: cartItems, isLoading: cartLoading } = useQuery<
    CartItemWithProduct[]
  >({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Đặt hàng thành công!",
        description: "Đơn hàng của bạn đã được tạo thành công.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setLocation("/");
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
        title: "Lỗi đặt hàng",
        description: "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
            <p className="text-muted-foreground mb-4">
              Thêm sản phẩm vào giỏ hàng trước khi thanh toán
            </p>
            <Button
              onClick={() => setLocation("/")}
              data-testid="button-continue-shopping"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0,
  );
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !customerInfo.fullName ||
      !customerInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.province ||
      !shippingInfo.district ||
      !shippingInfo.ward
    ) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      order: {
        paymentMethod: paymentMethod as "cod" | "bank_transfer",
        subtotal: subtotal.toString(),
        shippingFee: shippingFee.toString(),
        total: total.toString(),
        customerName: customerInfo.fullName,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email.trim() || undefined,
        shippingAddress: shippingInfo.address,
        shippingProvince: shippingInfo.province,
        shippingDistrict: shippingInfo.district,
        shippingWard: shippingInfo.ward,
        notes: notes.trim() || undefined,
      },
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size || undefined,
        color: item.color || undefined,
      })),
    };

    createOrderMutation.mutate(orderData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Thanh Toán Đơn Hàng</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Checkout Form */}
              <div className="space-y-8">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông Tin Khách Hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Họ và tên *</Label>
                        <Input
                          id="fullName"
                          value={customerInfo.fullName}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              fullName: e.target.value,
                            })
                          }
                          placeholder="Nhập họ và tên"
                          required
                          data-testid="input-full-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Nhập số điện thoại"
                          required
                          data-testid="input-phone"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              email: e.target.value,
                            })
                          }
                          placeholder="Nhập email"
                          data-testid="input-email"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Địa Chỉ Giao Hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Địa chỉ *</Label>
                      <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            address: e.target.value,
                          })
                        }
                        placeholder="Số nhà, tên đường"
                        required
                        data-testid="input-address"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                        <Select
                          value={shippingInfo.province}
                          onValueChange={(value) =>
                            setShippingInfo({
                              ...shippingInfo,
                              province: value,
                            })
                          }
                        >
                          <SelectTrigger data-testid="select-province">
                            <SelectValue placeholder="Chọn tỉnh/thành" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hanoi">Hà Nội</SelectItem>
                            <SelectItem value="ho-chi-minh">
                              Hồ Chí Minh
                            </SelectItem>
                            <SelectItem value="hai-phong">Hải Phòng</SelectItem>
                            <SelectItem value="da-nang">Đà Nẵng</SelectItem>
                            <SelectItem value="can-tho">Cần Thơ</SelectItem>
                            <SelectItem value="an-giang">An Giang</SelectItem>
                            <SelectItem value="ba-ria-vung-tau">
                              Bà Rịa – Vũng Tàu
                            </SelectItem>
                            <SelectItem value="bac-giang">Bắc Giang</SelectItem>
                            <SelectItem value="bac-kan">Bắc Kạn</SelectItem>
                            <SelectItem value="bac-lieu">Bạc Liêu</SelectItem>
                            <SelectItem value="bac-ninh">Bắc Ninh</SelectItem>
                            <SelectItem value="ben-tre">Bến Tre</SelectItem>
                            <SelectItem value="binh-dinh">Bình Định</SelectItem>
                            <SelectItem value="binh-duong">
                              Bình Dương
                            </SelectItem>
                            <SelectItem value="binh-phuoc">
                              Bình Phước
                            </SelectItem>
                            <SelectItem value="binh-thuan">
                              Bình Thuận
                            </SelectItem>
                            <SelectItem value="ca-mau">Cà Mau</SelectItem>
                            <SelectItem value="cao-bang">Cao Bằng</SelectItem>
                            <SelectItem value="dak-lak">Đắk Lắk</SelectItem>
                            <SelectItem value="dak-nong">Đắk Nông</SelectItem>
                            <SelectItem value="dien-bien">Điện Biên</SelectItem>
                            <SelectItem value="dong-nai">Đồng Nai</SelectItem>
                            <SelectItem value="dong-thap">Đồng Tháp</SelectItem>
                            <SelectItem value="gia-lai">Gia Lai</SelectItem>
                            <SelectItem value="ha-giang">Hà Giang</SelectItem>
                            <SelectItem value="ha-nam">Hà Nam</SelectItem>
                            <SelectItem value="ha-tinh">Hà Tĩnh</SelectItem>
                            <SelectItem value="hai-duong">Hải Dương</SelectItem>
                            <SelectItem value="hau-giang">Hậu Giang</SelectItem>
                            <SelectItem value="hoa-binh">Hòa Bình</SelectItem>
                            <SelectItem value="hung-yen">Hưng Yên</SelectItem>
                            <SelectItem value="khanh-hoa">Khánh Hòa</SelectItem>
                            <SelectItem value="kien-giang">
                              Kiên Giang
                            </SelectItem>
                            <SelectItem value="kon-tum">Kon Tum</SelectItem>
                            <SelectItem value="lai-chau">Lai Châu</SelectItem>
                            <SelectItem value="lam-dong">Lâm Đồng</SelectItem>
                            <SelectItem value="lang-son">Lạng Sơn</SelectItem>
                            <SelectItem value="lao-cai">Lào Cai</SelectItem>
                            <SelectItem value="long-an">Long An</SelectItem>
                            <SelectItem value="nam-dinh">Nam Định</SelectItem>
                            <SelectItem value="nghe-an">Nghệ An</SelectItem>
                            <SelectItem value="ninh-binh">Ninh Bình</SelectItem>
                            <SelectItem value="ninh-thuan">
                              Ninh Thuận
                            </SelectItem>
                            <SelectItem value="phu-tho">Phú Thọ</SelectItem>
                            <SelectItem value="phu-yen">Phú Yên</SelectItem>
                            <SelectItem value="quang-binh">
                              Quảng Bình
                            </SelectItem>
                            <SelectItem value="quang-nam">Quảng Nam</SelectItem>
                            <SelectItem value="quang-ngai">
                              Quảng Ngãi
                            </SelectItem>
                            <SelectItem value="quang-ninh">
                              Quảng Ninh
                            </SelectItem>
                            <SelectItem value="quang-tri">Quảng Trị</SelectItem>
                            <SelectItem value="soc-trang">Sóc Trăng</SelectItem>
                            <SelectItem value="son-la">Sơn La</SelectItem>
                            <SelectItem value="tay-ninh">Tây Ninh</SelectItem>
                            <SelectItem value="thai-binh">Thái Bình</SelectItem>
                            <SelectItem value="thai-nguyen">
                              Thái Nguyên
                            </SelectItem>
                            <SelectItem value="thanh-hoa">Thanh Hóa</SelectItem>
                            <SelectItem value="thua-thien-hue">
                              Thừa Thiên Huế
                            </SelectItem>
                            <SelectItem value="tien-giang">
                              Tiền Giang
                            </SelectItem>
                            <SelectItem value="tra-vinh">Trà Vinh</SelectItem>
                            <SelectItem value="tuyen-quang">
                              Tuyên Quang
                            </SelectItem>
                            <SelectItem value="vinh-long">Vĩnh Long</SelectItem>
                            <SelectItem value="vinh-phuc">Vĩnh Phúc</SelectItem>
                            <SelectItem value="yen-bai">Yên Bái</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="district">Quận/Huyện *</Label>
                        <Select
                          value={shippingInfo.district}
                          onValueChange={(value) =>
                            setShippingInfo({
                              ...shippingInfo,
                              district: value,
                            })
                          }
                        >
                          <SelectTrigger data-testid="select-district">
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="district1">Quận 1</SelectItem>
                            <SelectItem value="district3">Quận 3</SelectItem>
                            <SelectItem value="district7">Quận 7</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="ward">Phường/Xã *</Label>
                        <Select
                          value={shippingInfo.ward}
                          onValueChange={(value) =>
                            setShippingInfo({ ...shippingInfo, ward: value })
                          }
                        >
                          <SelectTrigger data-testid="select-ward">
                            <SelectValue placeholder="Chọn phường/xã" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ward1">Phường 1</SelectItem>
                            <SelectItem value="ward2">Phường 2</SelectItem>
                            <SelectItem value="ward3">Phường 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Ghi chú</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ghi chú thêm cho đơn hàng"
                        rows={3}
                        data-testid="textarea-notes"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Phương Thức Thanh Toán</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary transition-colors">
                        <RadioGroupItem
                          value="cod"
                          id="cod"
                          data-testid="radio-cod"
                        />
                        <Label
                          htmlFor="cod"
                          className="flex items-center space-x-3 cursor-pointer flex-1"
                        >
                          <i className="fas fa-money-bill-wave text-accent text-xl"></i>
                          <div>
                            <div className="font-semibold">
                              Thanh toán khi nhận hàng (COD)
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Thanh toán bằng tiền mặt khi nhận hàng
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary transition-colors">
                        <RadioGroupItem
                          value="bank_transfer"
                          id="bank_transfer"
                          data-testid="radio-bank-transfer"
                        />
                        <Label
                          htmlFor="bank_transfer"
                          className="flex items-center space-x-3 cursor-pointer flex-1"
                        >
                          <i className="fas fa-university text-primary text-xl"></i>
                          <div>
                            <div className="font-semibold">
                              Chuyển khoản ngân hàng
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Chuyển khoản trước khi giao hàng
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4"
                          data-testid={`order-item-${item.id}`}
                        >
                          <img
                            src={
                              item.product.imageUrls?.[0] ||
                              "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"
                            }
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item.color && `Màu ${item.color}, `}
                              {item.size && `Size ${item.size}`}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span
                                className="text-sm"
                                data-testid={`text-quantity-${item.id}`}
                              >
                                x{item.quantity}
                              </span>
                              <span
                                className="font-semibold text-primary"
                                data-testid={`text-item-total-${item.id}`}
                              >
                                {(
                                  parseFloat(item.product.price) * item.quantity
                                ).toLocaleString()}
                                ₫
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Totals */}
                    <div className="space-y-3 border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span>Tạm tính:</span>
                        <span data-testid="text-subtotal">
                          {subtotal.toLocaleString()}₫
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phí vận chuyển:</span>
                        <span data-testid="text-shipping">
                          {shippingFee.toLocaleString()}₫
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
                        <span>Tổng cộng:</span>
                        <span className="text-accent" data-testid="text-total">
                          {total.toLocaleString()}₫
                        </span>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-4 text-lg mt-6"
                      disabled={createOrderMutation.isPending}
                      data-testid="button-place-order"
                    >
                      {createOrderMutation.isPending
                        ? "Đang xử lý..."
                        : "Đặt Hàng"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
