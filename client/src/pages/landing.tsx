import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Product, Category } from "@shared/schema";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory === "all" ? "" : selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all" && selectedCategory) {
        params.append('categoryId', selectedCategory);
      }

      const url = `/api/products${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url, { credentials: "include" });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
  });

  const { data: searchResults } = useQuery<Product[]>({
    queryKey: ["/api/products", { search: searchQuery }],
    enabled: searchQuery.length > 2,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
            {/* Left Content */}
            <div className="space-y-8 relative">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="text-gray-900">Thời Trang</span><br/>
                  <span className="text-orange-500">Hiện Đại</span><br/>
                  <span className="text-gray-900">Phong Cách</span><br/>
                  <span className="text-gray-900">Độc Đáo</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  Khám phá bộ sưu tập thời trang mới nhất với chất lượng cao, thiết kế tinh tế và giá cả hợp lý. Tạo nên phong cách riêng của bạn.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-full"
                  onClick={() => window.location.href = "/products"}
                >
                  Mua Ngay
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-full"
                  onClick={() => window.location.href = "/products"}
                >
                  Xem Bộ Sưu Tập
                </Button>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="relative h-[400px] lg:h-[500px] flex justify-center items-center">
              {/* Main Fashion Image - Square format */}
              <div className="relative bg-gray-100 rounded-3xl overflow-hidden shadow-xl w-[400px] h-[400px] lg:w-[450px] lg:h-[450px]">
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=800" 
                  alt="Fashion Collection - Women's Clothing"
                  className="w-full h-full object-cover"
                />
                
                {/* Product Stats Card - Positioned at bottom left of image */}
                <div className="absolute bottom-4 left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-orange-500">50+</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">Sản phẩm mới</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Status Badge */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Có sẵn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Danh Mục Sản Phẩm</h2>
            <p className="text-muted-foreground">Khám phá các danh mục thời trang hot nhất</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.slice(0, 4).map((category) => (
              <Card 
                key={category.id} 
                className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
                data-testid={`card-category-${category.slug}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="relative">
                  <img 
                    src={category.imageUrl || "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sale Section - Always show */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-red-600">Sale</h2>
              <p className="text-muted-foreground">Sản phẩm đang được giảm giá đặc biệt</p>
            </div>
            <Button 
              variant="outline" 
              className="text-red-600 border-red-600 hover:bg-red-50 font-semibold"
              onClick={() => window.location.href = "/products"}
            >
              Xem Tất Cả
            </Button>
          </div>

          {/* Show sale products or message */}
          {featuredProducts && featuredProducts.filter(product => 
            (product as any).isOnSale || (product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price))
          ).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts
                .filter(product => 
                  (product as any).isOnSale || (product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price))
                )
                .slice(0, 8)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🏷️</div>
              <h3 className="text-xl font-semibold mb-2">Chưa Có Sản Phẩm Sale</h3>
              <p className="text-muted-foreground">
                Hãy quay lại sau để không bỏ lỡ những ưu đãi hấp dẫn
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {selectedCategory === "all" ? "Sản Phẩm Nổi Bật" : `Sản Phẩm - ${categories?.find(c => c.id === selectedCategory)?.name || "Danh Mục"}`}
              </h2>
              <p className="text-muted-foreground">
                {selectedCategory === "all" ? "Những sản phẩm được yêu thích nhất" : "Sản phẩm trong danh mục được chọn"}
              </p>
            </div>
            <Button 
              variant="link" 
              className="text-primary hover:text-primary/80 font-semibold"
              data-testid="button-view-all-products"
              onClick={() => window.location.href = "/products"}
            >
              Xem Tất Cả
            </Button>
          </div>

          {/* Display products based on category selection */}
          {selectedCategory === "all" ? (
            // Show featured products when "all" is selected
            featuredProducts && featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold mb-2">Chưa Có Sản Phẩm Nổi Bật</h3>
                <p className="text-muted-foreground">
                  Sản phẩm nổi bật sẽ được hiển thị tại đây
                </p>
              </div>
            )
          ) : (
            // Show category-specific products when a specific category is selected
            allProducts && allProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">Không Tìm Thấy Sản Phẩm</h3>
                <p className="text-muted-foreground">
                  Hiện tại chưa có sản phẩm nào trong danh mục "{categories?.find(c => c.id === selectedCategory)?.name}".
                </p>
                <Button 
                  onClick={() => setSelectedCategory("all")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Xem tất cả sản phẩm
                </Button>
              </div>
            )
          )}
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Sản Phẩm Mới Nhất</h2>
              <p className="text-muted-foreground">Khám phá những sản phẩm vừa được thêm vào</p>
            </div>
            <Button 
              variant="link" 
              className="text-primary hover:text-primary/80 font-semibold"
              data-testid="button-view-all-latest-products"
              onClick={() => window.location.href = "/products"}
            >
              Xem Tất Cả
            </Button>
          </div>

          {/* Display latest products (all products sorted by newest) */}
          {allProducts && allProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts.slice(0, 8).map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  data-testid={`card-latest-product-${product.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">Chưa Có Sản Phẩm Mới</h3>
              <p className="text-muted-foreground">
                Sản phẩm mới nhất sẽ được hiển thị tại đây
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}