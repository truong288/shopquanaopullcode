export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4 lg:px-8">
        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <i className="fas fa-tshirt text-xl"></i>
              <span className="text-xl font-bold">ThoitrangStore</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Thời trang hiện đại với chất lượng cao và giá cả hợp lý. Tạo nên phong cách riêng của bạn.
            </p>
            <div className="flex space-x-3">
              <a href="https://zalo.me/thoitrangstore" target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors w-10 h-10 flex items-center justify-center" data-testid="link-zalo">
                <i className="fas fa-comment text-lg"></i>
              </a>
              <a href="https://facebook.com/thoitrangstore" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors w-10 h-10 flex items-center justify-center" data-testid="link-facebook">
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a href="https://www.tiktok.com/@thoitrangstore" target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-gray-800 text-white p-2 rounded transition-colors w-10 h-10 flex items-center justify-center" data-testid="link-tiktok">
                <i className="fab fa-tiktok text-lg"></i>
              </a>
              <a href="https://youtube.com/@thoitrangstore" target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors w-10 h-10 flex items-center justify-center" data-testid="link-youtube">
                <i className="fab fa-youtube text-lg"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Danh Mục</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">Thời Trang Nữ</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">Thời Trang Nam</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">Phụ Kiện</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">Giày Dép</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Hỗ Trợ</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">Liên Hệ</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">Hướng Dẫn Mua Hàng</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">Chính Sách Đổi Trả</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">Câu Hỏi Thường Gặp</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Liên Hệ</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <i className="fas fa-map-marker-alt text-accent text-sm"></i>
                <span className="text-primary-foreground/80 text-sm">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-phone text-accent text-sm"></i>
                <span className="text-primary-foreground/80 text-sm">023 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-envelope text-accent text-sm"></i>
                <span className="text-primary-foreground/80 text-sm">thoitrangstore@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-clock text-accent text-sm"></i>
                <span className="text-primary-foreground/80 text-sm">8:00 - 22:00 (Thứ 2 - CN)</span>
              </div>
              <div className="mt-3 space-y-1">
                <a 
                  href="https://zalo.me/0234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  data-testid="link-zalo"
                >
                  <i className="fas fa-comment text-blue-400 text-sm"></i>
                  <span className="text-sm">Zalo: 023 456 789</span>
                </a>
                <a 
                  href="https://m.me/thoitrangstore" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  data-testid="link-messenger"
                >
                  <i className="fab fa-facebook-messenger text-blue-500 text-sm"></i>
                  <span className="text-sm">Facebook Messenger</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-6 pt-4">
          <p className="text-primary-foreground/80 text-sm text-center">
            © 2025 ThoitrangStore. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
