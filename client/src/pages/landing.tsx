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

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: searchResults } = useQuery<Product[]>({
    queryKey: ["/api/products", { search: searchQuery }],
    enabled: searchQuery.length > 2,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      {/* Hero Section */}
      <section id="home" className="relative">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Thời Trang <span className="text-accent">Hiện Đại</span><br/>
                  Phong Cách <span className="text-primary">Độc Đáo</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Khám phá bộ sưu tập thời trang mới nhất với chất lượng cao, thiết kế tinh tế và giá cả hợp lý. Tạo nên phong cách riêng của bạn.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    data-testid="button-shop-now"
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Mua Ngay
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    data-testid="button-view-collection"
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Xem Bộ Sưu Tập
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Fashion model in trendy outfit" 
                  className="rounded-2xl shadow-2xl w-full h-auto" 
                />
                <div className="absolute -bottom-6 -left-6 bg-background border border-border rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-accent" data-testid="text-featured-count">50+</div>
                  <div className="text-sm text-muted-foreground">Sản phẩm mới</div>
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

      {/* Featured Products */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Sản Phẩm Nổi Bật</h2>
              <p className="text-muted-foreground">Những sản phẩm được yêu thích nhất</p>
            </div>
            <Button 
              variant="link" 
              className="text-primary hover:text-primary/80 font-semibold"
              data-testid="button-view-all-products"
            >
              Xem Tất Cả
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(searchQuery.length > 2 ? searchResults : featuredProducts)?.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                data-testid={`card-product-${product.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products */}
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
            >
              Xem Tất Cả
              →
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts?.slice(0, 8).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                data-testid={`card-latest-product-${product.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
