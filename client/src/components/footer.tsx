export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-tshirt text-2xl"></i>
              <span className="text-2xl font-bold">FashionStore</span>
            </div>
            <p className="text-primary-foreground/80">
              Thời trang hiện đại với chất lượng cao và giá cả hợp lý. Tạo nên phong cách riêng của bạn.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-facebook">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-instagram">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-tiktok">
                <i className="fab fa-tiktok text-xl"></i>
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-youtube">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Danh Mục</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Thời Trang Nữ</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Thời Trang Nam</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Phụ Kiện</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Giày Dép</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ Trợ</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Liên Hệ</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Hướng Dẫn Mua Hàng</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Chính Sách Đổi Trả</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Câu Hỏi Thường Gặp</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-accent"></i>
                <span className="text-primary-foreground/80">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-phone text-accent"></i>
                <span className="text-primary-foreground/80">0123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-accent"></i>
                <span className="text-primary-foreground/80">info@fashionstore.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-clock text-accent"></i>
                <span className="text-primary-foreground/80">8:00 - 22:00 (Thứ 2 - CN)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/80">
            © 2024 FashionStore. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
