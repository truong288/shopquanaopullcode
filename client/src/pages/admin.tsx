import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { insertProductSchema, type Product, type Order, type User, type Category } from "@shared/schema";
import { z } from "zod";
import ImageUpload from "@/components/image-upload";

type OrderWithItems = Order & { 
  items: Array<{ 
    id: string; 
    quantity: number; 
    price: string; 
    size?: string; 
    color?: string; 
    product: Product; 
  }> 
};

const productFormSchema = insertProductSchema.extend({
  imageUrls: z.string().optional(),
  sizes: z.string().optional(),
  colors: z.string().optional(),
}).transform((data) => ({
  ...data,
  description: data.description || "",
  originalPrice: data.originalPrice || "",
  categoryId: data.categoryId || "",
  stock: data.stock || 0,
  isActive: data.isActive ?? true,
  isFeatured: data.isFeatured ?? false,
}));

type ProductFormData = z.infer<typeof productFormSchema>;

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading, user } = useAuth();

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: "",
      originalPrice: "",
      categoryId: "",
      imageUrls: "",
      sizes: "",
      colors: "",
      stock: 0,
      isActive: true,
      isFeatured: false,
    },
  });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Access Denied",
        description: "Admin access required. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/admin/dashboard"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: orders } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const handleViewOrderDetail = async (orderId: string) => {
    try {
      const response = await apiRequest("GET", `/api/orders/${orderId}`);
      const orderDetail = await response.json();
      setSelectedOrder(orderDetail);
      setShowOrderDetail(true);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin đơn hàng",
        variant: "destructive",
      });
    }
  };

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return await apiRequest("PUT", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công",
        description: "Trạng thái đơn hàng đã được cập nhật.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
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
        description: "Không thể cập nhật trạng thái đơn hàng.",
        variant: "destructive",
      });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: ProductFormData) => {
      // Validate required fields first
      if (!productData.price || productData.price.trim() === "") {
        throw new Error("Giá bán là bắt buộc");
      }
      
      // Convert form data to product format with proper validation
      const product = {
        ...productData,
        imageUrls: productImages.length > 0 ? productImages : [],
        sizes: productData.sizes ? productData.sizes.split(',').map(size => size.trim()) : [],
        colors: productData.colors ? productData.colors.split(',').map(color => color.trim()) : [],
        price: productData.price.toString(),
        originalPrice: productData.originalPrice && productData.originalPrice.trim() !== "" ? productData.originalPrice : undefined,
        stock: productData.stock || 0,
        categoryId: productData.categoryId && productData.categoryId.trim() !== "" ? productData.categoryId : undefined,
      };
      
      console.log("Sending product data:", product);
      return await apiRequest("POST", "/api/products", product);
    },
    onSuccess: () => {
      toast({
        title: "Tạo thành công",
        description: "Sản phẩm đã được tạo.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/featured"] });
      setIsProductModalOpen(false);
      productForm.reset();
      setProductImages([]);
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
        description: "Không thể tạo sản phẩm.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      toast({
        title: "Xóa thành công",
        description: "Sản phẩm đã được xóa.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
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
        description: "Không thể xóa sản phẩm.",
        variant: "destructive",
      });
    },
  });

  const onSubmitProduct = (data: ProductFormData) => {
    // Generate slug from name if not provided
    if (!data.slug) {
      data.slug = data.name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
    }
    createProductMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="flex h-screen bg-secondary/20">
      {/* Admin Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              activeTab === "dashboard" 
                ? "text-foreground bg-primary/10 border-r-2 border-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            data-testid="nav-dashboard"
          >
            <i className="fas fa-tachometer-alt mr-3"></i>
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              activeTab === "products" 
                ? "text-foreground bg-primary/10 border-r-2 border-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            data-testid="nav-products"
          >
            <i className="fas fa-box mr-3"></i>
            Quản Lý Sản Phẩm
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              activeTab === "orders" 
                ? "text-foreground bg-primary/10 border-r-2 border-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            data-testid="nav-orders"
          >
            <i className="fas fa-shopping-bag mr-3"></i>
            Quản Lý Đơn Hàng
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              activeTab === "customers" 
                ? "text-foreground bg-primary/10 border-r-2 border-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            data-testid="nav-customers"
          >
            <i className="fas fa-users mr-3"></i>
            Quản Lý Khách Hàng
          </button>
        </nav>
      </div>

      {/* Admin Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-3xl font-bold mb-8">Dashboard Tổng Quan</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Tổng Đơn Hàng</p>
                        <p className="text-2xl font-bold" data-testid="text-total-orders">
                          {dashboardStats?.totalOrders || 0}
                        </p>
                      </div>
                      <div className="bg-accent/10 p-3 rounded-full">
                        <i className="fas fa-shopping-bag text-accent text-xl"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Doanh Thu</p>
                        <p className="text-2xl font-bold" data-testid="text-total-revenue">
                          {dashboardStats?.totalRevenue?.toLocaleString() || 0}₫
                        </p>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-full">
                        <i className="fas fa-chart-line text-primary text-xl"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Khách Hàng</p>
                        <p className="text-2xl font-bold" data-testid="text-total-customers">
                          {dashboardStats?.totalCustomers || 0}
                        </p>
                      </div>
                      <div className="bg-secondary p-3 rounded-full">
                        <i className="fas fa-users text-secondary-foreground text-xl"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Sản Phẩm</p>
                        <p className="text-2xl font-bold" data-testid="text-total-products">
                          {dashboardStats?.totalProducts || 0}
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded-full">
                        <i className="fas fa-box text-muted-foreground text-xl"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Đơn Hàng Gần Đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4">ID Đơn Hàng</th>
                          <th className="text-left py-3 px-4">Khách Hàng</th>
                          <th className="text-left py-3 px-4">Tổng Tiền</th>
                          <th className="text-left py-3 px-4">Trạng Thái</th>
                          <th className="text-left py-3 px-4">Ngày</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders?.slice(0, 5).map((order) => (
                          <tr key={order.id} className="border-b border-border" data-testid={`row-order-${order.id}`}>
                            <td className="py-3 px-4 font-semibold">#{order.id.slice(0, 8)}</td>
                            <td className="py-3 px-4">{order.customerName}</td>
                            <td className="py-3 px-4 font-semibold text-primary">
                              {parseFloat(order.total).toLocaleString()}₫
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusBadgeColor(order.status)}>
                                {getStatusText(order.status)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(order.createdAt!).toLocaleDateString('vi-VN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Product Management */}
          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Quản Lý Sản Phẩm</h1>
                <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      data-testid="button-add-product"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Thêm Sản Phẩm
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <Form {...productForm}>
                      <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={productForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tên Sản Phẩm *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nhập tên sản phẩm" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={productForm.control}
                            name="slug"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Slug (URL)</FormLabel>
                                <FormControl>
                                  <Input placeholder="ten-san-pham" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={productForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mô Tả</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Mô tả chi tiết về sản phẩm"
                                  rows={3}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={productForm.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Giá Bán *</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number"
                                    placeholder="100000"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={productForm.control}
                            name="originalPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Giá Gốc</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number"
                                    placeholder="150000"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={productForm.control}
                            name="categoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Danh Mục</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categories?.map((category) => (
                                      <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={productForm.control}
                            name="stock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Số Lượng</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number"
                                    placeholder="100"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div>
                          <Label>Hình Ảnh Sản Phẩm</Label>
                          <ImageUpload 
                            images={productImages}
                            onImagesChange={setProductImages}
                            maxImages={5}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={productForm.control}
                            name="sizes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Kích Thước</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="S, M, L, XL"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={productForm.control}
                            name="colors"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Màu Sắc</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Đỏ, Xanh, Đen, Trắng"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex items-center space-x-4">
                          <FormField
                            control={productForm.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="rounded border-border"
                                  />
                                </FormControl>
                                <FormLabel className="!mt-0">Kích hoạt</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={productForm.control}
                            name="isFeatured"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="rounded border-border"
                                  />
                                </FormControl>
                                <FormLabel className="!mt-0">Sản phẩm nổi bật</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsProductModalOpen(false);
                              productForm.reset();
                              setProductImages([]);
                            }}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="submit"
                            disabled={createProductMutation.isPending}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground"
                          >
                            {createProductMutation.isPending ? "Đang tạo..." : "Tạo Sản Phẩm"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4">Hình Ảnh</th>
                          <th className="text-left py-3 px-4">Tên Sản Phẩm</th>
                          <th className="text-left py-3 px-4">Giá</th>
                          <th className="text-left py-3 px-4">Tồn Kho</th>
                          <th className="text-left py-3 px-4">Trạng Thái</th>
                          <th className="text-left py-3 px-4">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products?.map((product) => (
                          <tr key={product.id} className="border-b border-border" data-testid={`row-product-${product.id}`}>
                            <td className="py-3 px-4">
                              <img 
                                src={product.imageUrls?.[0] || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"} 
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg" 
                              />
                            </td>
                            <td className="py-3 px-4 font-semibold">{product.name}</td>
                            <td className="py-3 px-4 font-semibold text-primary">
                              {parseFloat(product.price).toLocaleString()}₫
                            </td>
                            <td className="py-3 px-4">{product.stock}</td>
                            <td className="py-3 px-4">
                              <Badge className={product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {product.isActive ? "Còn hàng" : "Hết hàng"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-2 text-primary hover:bg-primary/10"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setIsProductModalOpen(true);
                                  }}
                                  data-testid={`button-edit-product-${product.id}`}
                                >
                                  <i className="fas fa-edit"></i>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-2 text-destructive hover:bg-destructive/10"
                                  onClick={() => deleteProductMutation.mutate(product.id)}
                                  disabled={deleteProductMutation.isPending}
                                  data-testid={`button-delete-product-${product.id}`}
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Order Management */}
          {activeTab === "orders" && (
            <div>
              <h1 className="text-3xl font-bold mb-8">Quản Lý Đơn Hàng</h1>
              
              <Card>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4">ID Đơn Hàng</th>
                          <th className="text-left py-3 px-4">Khách Hàng</th>
                          <th className="text-left py-3 px-4">Tổng Tiền</th>
                          <th className="text-left py-3 px-4">Trạng Thái</th>
                          <th className="text-left py-3 px-4">Ngày Đặt</th>
                          <th className="text-left py-3 px-4">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders?.map((order) => (
                          <tr key={order.id} className="border-b border-border" data-testid={`row-order-${order.id}`}>
                            <td className="py-3 px-4 font-semibold">#{order.id.slice(0, 8)}</td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">{order.customerName}</div>
                                <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-semibold text-primary">
                              {parseFloat(order.total).toLocaleString()}₫
                            </td>
                            <td className="py-3 px-4">
                              <Select 
                                value={order.status} 
                                onValueChange={(status) => updateOrderStatusMutation.mutate({ orderId: order.id, status })}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                  <SelectItem value="processing">Đang xử lý</SelectItem>
                                  <SelectItem value="shipped">Đang giao</SelectItem>
                                  <SelectItem value="delivered">Đã giao</SelectItem>
                                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(order.createdAt!).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewOrderDetail(order.id)}
                                data-testid={`button-view-order-${order.id}`}
                              >
                                Chi tiết
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Customer Management */}
          {activeTab === "customers" && (
            <div>
              <h1 className="text-3xl font-bold mb-8">Quản Lý Khách Hàng</h1>
              
              <Card>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4">Khách Hàng</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Vai Trò</th>
                          <th className="text-left py-3 px-4">Ngày Tham Gia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users?.map((user) => (
                          <tr key={user.id} className="border-b border-border" data-testid={`row-user-${user.id}`}>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={user.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=40&h=40"} 
                                  alt={`${user.firstName} ${user.lastName}`}
                                  className="w-8 h-8 rounded-full object-cover" 
                                />
                                <div>
                                  <div className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">
                              <Badge className={user.role === 'admin' ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
                                {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(user.createdAt!).toLocaleDateString('vi-VN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <Dialog open={showOrderDetail} onOpenChange={setShowOrderDetail}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi Tiết Đơn Hàng #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Thông Tin Khách Hàng</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Họ tên:</span> {selectedOrder.customerName}</p>
                    <p><span className="font-medium">Điện thoại:</span> {selectedOrder.customerPhone}</p>
                    {selectedOrder.customerEmail && (
                      <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Thông Tin Đơn Hàng</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Ngày đặt:</span> {new Date(selectedOrder.createdAt!).toLocaleDateString('vi-VN')}</p>
                    <p><span className="font-medium">Trạng thái:</span> 
                      <Badge className="ml-2">
                        {selectedOrder.status === 'pending' && 'Chờ xác nhận'}
                        {selectedOrder.status === 'confirmed' && 'Đã xác nhận'}
                        {selectedOrder.status === 'processing' && 'Đang xử lý'}
                        {selectedOrder.status === 'shipped' && 'Đang giao'}
                        {selectedOrder.status === 'delivered' && 'Đã giao'}
                        {selectedOrder.status === 'cancelled' && 'Đã hủy'}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Phương thức:</span> {selectedOrder.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold mb-2">Địa Chỉ Giao Hàng</h3>
                <p className="text-sm">
                  {selectedOrder.shippingAddress}, {
                    selectedOrder.shippingWard === 'ward1' ? 'Phường 1' :
                    selectedOrder.shippingWard === 'ward2' ? 'Phường 2' :
                    selectedOrder.shippingWard === 'ward3' ? 'Phường 3' :
                    selectedOrder.shippingWard
                  }, {
                    selectedOrder.shippingDistrict === 'district1' ? 'Quận 1' :
                    selectedOrder.shippingDistrict === 'district2' ? 'Quận 2' :
                    selectedOrder.shippingDistrict === 'district3' ? 'Quận 3' :
                    selectedOrder.shippingDistrict
                  }, {
                    selectedOrder.shippingProvince === 'hcm' ? 'TP. Hồ Chí Minh' :
                    selectedOrder.shippingProvince === 'hanoi' ? 'Hà Nội' :
                    selectedOrder.shippingProvince === 'danang' ? 'Đà Nẵng' :
                    selectedOrder.shippingProvince
                  }
                </p>
                {selectedOrder.notes && (
                  <p className="text-sm mt-1"><span className="font-medium">Ghi chú:</span> {selectedOrder.notes}</p>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-2">Sản Phẩm Đặt Mua</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <img 
                        src={
                          typeof item.product.imageUrls === 'string' 
                            ? item.product.imageUrls.split(',')[0] 
                            : Array.isArray(item.product.imageUrls) 
                              ? item.product.imageUrls[0] 
                              : "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
                        } 
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <div className="text-sm text-muted-foreground">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span className="ml-2">Màu: {item.color}</span>}
                        </div>
                        <div className="text-sm">
                          <span>Số lượng: {item.quantity}</span>
                          <span className="ml-3 font-medium">{parseFloat(item.price).toLocaleString()}₫</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {(parseFloat(item.price) * item.quantity).toLocaleString()}₫
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{parseFloat(selectedOrder.subtotal).toLocaleString()}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí giao hàng:</span>
                    <span>{parseFloat(selectedOrder.shippingFee).toLocaleString()}₫</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t pt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{parseFloat(selectedOrder.total).toLocaleString()}₫</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
