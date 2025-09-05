import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { CartItem, Product } from "@shared/schema";

type CartItemWithProduct = CartItem & { product: Product };

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onCartClick?: () => void;
}

export default function Header({ searchQuery = "", onSearchChange, onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const { data: cartItems } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <a href="/" className="text-2xl font-bold text-primary" data-testid="link-logo">
              <i className="fas fa-tshirt mr-2"></i>FashionStore
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors" data-testid="link-home">
              Trang Chủ
            </a>
            <a href="/products" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-products">
              Sản Phẩm
            </a>
            {user?.role === 'admin' && (
              <a href="/admin" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-admin">
                Quản Trị
              </a>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden lg:flex">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-64 pr-10"
                  data-testid="input-search"
                />
                <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
              </div>
            </div>

            {/* Cart */}
            {isAuthenticated && onCartClick && (
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
                onClick={onCartClick}
                data-testid="button-cart"
              >
                <i className="fas fa-shopping-cart text-xl"></i>
                {cartItemCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs h-5 w-5 flex items-center justify-center p-0"
                    data-testid="badge-cart-count"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2" data-testid="button-user-menu">
                      <img 
                        src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=32&h=32"} 
                        alt="User avatar"
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                      <span className="hidden md:block">{user?.firstName}</span>
                      <i className="fas fa-chevron-down text-xs"></i>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <a href="/" data-testid="menu-profile">
                        <i className="fas fa-user mr-2"></i>
                        Trang Cá Nhân
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/orders" data-testid="menu-orders">
                        <i className="fas fa-list mr-2"></i>
                        Đơn Hàng Của Tôi
                      </a>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <a href="/admin" data-testid="menu-admin">
                          <i className="fas fa-cog mr-2"></i>
                          Quản Trị
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <a href="/api/logout" data-testid="menu-logout">
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Đăng Xuất
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild data-testid="button-login">
                  <a href="/api/login">
                    <i className="fas fa-user mr-2"></i>
                    Đăng Nhập
                  </a>
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="space-y-2">
              <a href="/" className="block py-2 text-foreground hover:text-primary transition-colors">
                Trang Chủ
              </a>
              <a href="/products" className="block py-2 text-muted-foreground hover:text-primary transition-colors">
                Sản Phẩm
              </a>
              {user?.role === 'admin' && (
                <a href="/admin" className="block py-2 text-muted-foreground hover:text-primary transition-colors">
                  Quản Trị
                </a>
              )}
            </nav>
            <div className="mt-4 lg:hidden">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
