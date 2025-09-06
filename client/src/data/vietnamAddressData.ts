
export interface Ward {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
  wards: Ward[];
}

export interface Province {
  code: string;
  name: string;
  districts: District[];
}

export const vietnamAddressData: Province[] = [
  // Thành phố trực thuộc Trung ương
  {
    code: "ha-noi",
    name: "Hà Nội",
    districts: [
      {
        code: "quan-hoan-kiem",
        name: "Quận Hoàn Kiếm",
        wards: [
          { code: "phuong-hang-bac", name: "Phường Hàng Bạc" },
          { code: "phuong-hang-bo", name: "Phường Hàng Bồ" },
          { code: "phuong-hang-gai", name: "Phường Hàng Gai" },
          { code: "phuong-hang-dao", name: "Phường Hàng Đào" },
        ]
      },
      {
        code: "quan-ba-dinh",
        name: "Quận Ba Đình",
        wards: [
          { code: "phuong-cong-vi", name: "Phường Cống Vị" },
          { code: "phuong-dien-bien", name: "Phường Điện Biên" },
          { code: "phuong-doi-can", name: "Phường Đội Cấn" },
          { code: "phuong-kim-ma", name: "Phường Kim Mã" },
        ]
      },
      {
        code: "quan-dong-da",
        name: "Quận Đống Đa",
        wards: [
          { code: "phuong-cat-linh", name: "Phường Cát Linh" },
          { code: "phuong-van-mieu", name: "Phường Văn Miếu" },
          { code: "phuong-quoc-tu-giam", name: "Phường Quốc Tử Giám" },
          { code: "phuong-lang-thuong", name: "Phường Láng Thượng" },
        ]
      }
    ]
  },
  {
    code: "ho-chi-minh",
    name: "Hồ Chí Minh",
    districts: [
      {
        code: "quan-1",
        name: "Quận 1",
        wards: [
          { code: "phuong-ben-nghe", name: "Phường Bến Nghé" },
          { code: "phuong-ben-thanh", name: "Phường Bến Thành" },
          { code: "phuong-cau-kho", name: "Phường Cầu Kho" },
          { code: "phuong-co-giang", name: "Phường Cô Giang" },
        ]
      },
      {
        code: "quan-3", 
        name: "Quận 3",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-4", name: "Phường 4" },
        ]
      },
      {
        code: "quan-7",
        name: "Quận 7", 
        wards: [
          { code: "phuong-tan-hung", name: "Phường Tân Hưng" },
          { code: "phuong-tan-kieng", name: "Phường Tân Kiểng" },
          { code: "phuong-tan-phong", name: "Phường Tân Phong" },
          { code: "phuong-tan-phu", name: "Phường Tân Phú" },
        ]
      }
    ]
  },
  {
    code: "hai-phong",
    name: "Hải Phòng",
    districts: [
      {
        code: "quan-hong-bang",
        name: "Quận Hồng Bàng", 
        wards: [
          { code: "phuong-hang-kenh", name: "Phường Hạng Kênh" },
          { code: "phuong-so-dau", name: "Phường Sở Dầu" },
          { code: "phuong-thuong-ly", name: "Phường Thượng Lý" },
        ]
      },
      {
        code: "quan-le-chan",
        name: "Quận Lê Chân",
        wards: [
          { code: "phuong-cat-dai", name: "Phường Cát Dài" },
          { code: "phuong-an-bien", name: "Phường An Biên" },
          { code: "phuong-lam-son", name: "Phường Lam Sơn" },
        ]
      }
    ]
  },
  {
    code: "da-nang",
    name: "Đà Nẵng",
    districts: [
      {
        code: "quan-hai-chau", 
        name: "Quận Hải Châu",
        wards: [
          { code: "phuong-hai-chau-1", name: "Phường Hải Châu 1" },
          { code: "phuong-hai-chau-2", name: "Phường Hải Châu 2" },
          { code: "phuong-binh-hien", name: "Phường Bình Hiên" },
        ]
      },
      {
        code: "quan-thanh-khe",
        name: "Quận Thanh Khê",
        wards: [
          { code: "phuong-thac-gian", name: "Phường Thạc Gián" },
          { code: "phuong-tam-thuan", name: "Phường Tam Thuận" },
          { code: "phuong-thanh-khe-dong", name: "Phường Thanh Khê Đông" },
        ]
      }
    ]
  },
  {
    code: "can-tho",
    name: "Cần Thơ",
    districts: [
      {
        code: "quan-ninh-kieu",
        name: "Quận Ninh Kiều",
        wards: [
          { code: "phuong-an-cu", name: "Phường An Cư" },
          { code: "phuong-an-hoa", name: "Phường An Hòa" },
          { code: "phuong-cai-khe", name: "Phường Cái Khế" },
        ]
      },
      {
        code: "quan-cai-rang",
        name: "Quận Cái Răng",
        wards: [
          { code: "phuong-ba-lang", name: "Phường Ba Láng" },
          { code: "phuong-hung-phu", name: "Phường Hưng Phú" },
          { code: "phuong-thoi-binh", name: "Phường Thới Bình" },
        ]
      }
    ]
  },
  // Các tỉnh
  {
    code: "an-giang",
    name: "An Giang",
    districts: [
      {
        code: "long-xuyen",
        name: "Thành phố Long Xuyên",
        wards: [
          { code: "phuong-dong-xuyen", name: "Phường Đông Xuyên" },
          { code: "phuong-my-binh", name: "Phường Mỹ Bình" },
          { code: "phuong-my-long", name: "Phường Mỹ Long" },
        ]
      },
      {
        code: "chau-doc",
        name: "Thành phố Châu Đốc",
        wards: [
          { code: "phuong-chau-phu-a", name: "Phường Châu Phú A" },
          { code: "phuong-chau-phu-b", name: "Phường Châu Phú B" },
          { code: "phuong-nui-sam", name: "Phường Núi Sam" },
        ]
      }
    ]
  },
  {
    code: "ba-ria-vung-tau",
    name: "Bà Rịa - Vũng Tàu",
    districts: [
      {
        code: "vung-tau",
        name: "Thành phố Vũng Tàu",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-thang-tam", name: "Phường Thắng Tam" },
        ]
      },
      {
        code: "ba-ria",
        name: "Thành phố Bà Rịa",
        wards: [
          { code: "phuong-phuoc-hiep", name: "Phường Phước Hiệp" },
          { code: "phuong-phuoc-hung", name: "Phường Phước Hưng" },
          { code: "phuong-phuoc-trung", name: "Phường Phước Trung" },
        ]
      }
    ]
  },
  {
    code: "bac-giang",
    name: "Bắc Giang",
    districts: [
      {
        code: "bac-giang",
        name: "Thành phố Bắc Giang",
        wards: [
          { code: "phuong-le-loi", name: "Phường Lê Lợi" },
          { code: "phuong-tran-nguyen-han", name: "Phường Trần Nguyên Hãn" },
          { code: "phuong-hoang-van-thu", name: "Phường Hoàng Văn Thụ" },
        ]
      },
      {
        code: "yen-the",
        name: "Huyện Yên Thế",
        wards: [
          { code: "xa-bo-da", name: "Xã Bố Đa" },
          { code: "xa-canh-nau", name: "Xã Cảnh Nậu" },
          { code: "xa-luc-nam", name: "Xã Lục Nam" },
        ]
      }
    ]
  },
  {
    code: "bac-kan",
    name: "Bắc Kạn",
    districts: [
      {
        code: "bac-kan",
        name: "Thành phố Bắc Kạn",
        wards: [
          { code: "phuong-duc-xuan", name: "Phường Đức Xuân" },
          { code: "phuong-ngoc-khoi", name: "Phường Ngọc Khôi" },
          { code: "phuong-suoi-gia", name: "Phường Suối Gia" },
        ]
      },
      {
        code: "pác-nam",
        name: "Huyện Pác Nặm",
        wards: [
          { code: "xa-cao-tri", name: "Xã Cao Trí" },
          { code: "xa-nghia-nhat", name: "Xã Nghĩa Nhật" },
          { code: "xa-ban-thi", name: "Xã Bản Thi" },
        ]
      }
    ]
  },
  {
    code: "bac-lieu",
    name: "Bạc Liêu",
    districts: [
      {
        code: "bac-lieu",
        name: "Thành phố Bạc Liêu",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-5", name: "Phường 5" },
        ]
      },
      {
        code: "gia-rai",
        name: "Huyện Giá Rai",
        wards: [
          { code: "xa-gia-rai", name: "Xã Giá Rai" },
          { code: "xa-to-hieu", name: "Xã Tô Hiệu" },
          { code: "xa-hoa-binh", name: "Xã Hòa Bình" },
        ]
      }
    ]
  },
  {
    code: "bac-ninh",
    name: "Bắc Ninh",
    districts: [
      {
        code: "bac-ninh",
        name: "Thành phố Bắc Ninh",
        wards: [
          { code: "phuong-dai-phuc", name: "Phường Đại Phúc" },
          { code: "phuong-han-quoc", name: "Phường Hàn Quốc" },
          { code: "phuong-ninh-xa", name: "Phường Ninh Xá" },
        ]
      },
      {
        code: "que-vo",
        name: "Huyện Quế Võ",
        wards: [
          { code: "xa-phung-xa", name: "Xã Phùng Xá" },
          { code: "xa-que-vo", name: "Xã Quế Võ" },
          { code: "xa-an-binh", name: "Xã An Bình" },
        ]
      }
    ]
  },
  {
    code: "ben-tre",
    name: "Bến Tre",
    districts: [
      {
        code: "ben-tre",
        name: "Thành phố Bến Tre",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-4", name: "Phường 4" },
        ]
      },
      {
        code: "chau-thanh",
        name: "Huyện Châu Thành",
        wards: [
          { code: "xa-giao-long", name: "Xã Giao Long" },
          { code: "xa-an-hoa", name: "Xã An Hóa" },
          { code: "xa-an-hiep", name: "Xã An Hiệp" },
        ]
      }
    ]
  },
  {
    code: "binh-dinh",
    name: "Bình Định",
    districts: [
      {
        code: "quy-nhon",
        name: "Thành phố Quy Nhon",
        wards: [
          { code: "phuong-le-hong-phong", name: "Phường Lê Hồng Phong" },
          { code: "phuong-le-loi", name: "Phường Lê Lợi" },
          { code: "phuong-ly-thuong-kiet", name: "Phường Lý Thường Kiệt" },
        ]
      },
      {
        code: "an-nhon",
        name: "Huyện An Nhơn",
        wards: [
          { code: "xa-nhon-binh", name: "Xã Nhơn Bình" },
          { code: "xa-nhon-hoa", name: "Xã Nhơn Hòa" },
          { code: "xa-nhon-loc", name: "Xã Nhơn Lộc" },
        ]
      }
    ]
  },
  {
    code: "binh-duong",
    name: "Bình Dương",
    districts: [
      {
        code: "thu-dau-mot",
        name: "Thành phố Thủ Dầu Một",
        wards: [
          { code: "phuong-hiep-thanh", name: "Phường Hiệp Thành" },
          { code: "phuong-phu-cuong", name: "Phường Phú Cường" },
          { code: "phuong-phu-hoa", name: "Phường Phú Hòa" },
        ]
      },
      {
        code: "ben-cat",
        name: "Huyện Bến Cát",
        wards: [
          { code: "xa-an-dien", name: "Xã An Điền" },
          { code: "xa-an-tay", name: "Xã An Tây" },
          { code: "xa-my-phuoc", name: "Xã Mỹ Phước" },
        ]
      }
    ]
  },
  {
    code: "binh-phuoc",
    name: "Bình Phước",
    districts: [
      {
        code: "dong-xoai",
        name: "Thành phố Đồng Xoài",
        wards: [
          { code: "phuong-dong-binh", name: "Phường Đông Bình" },
          { code: "phuong-tan-binh", name: "Phường Tân Bình" },
          { code: "phuong-tan-dong", name: "Phường Tân Đông" },
          { code: "phuong-tan-thinh", name: "Phường Tân Thịnh" },
        ]
      },
      {
        code: "binh-long",
        name: "Huyện Bình Long",
        wards: [
          { code: "xa-binh-tien", name: "Xã Bình Tiến" },
          { code: "xa-thanh-lam", name: "Xã Thanh Lâm" },
          { code: "xa-loc-thinh", name: "Xã Lộc Thịnh" },
        ]
      }
    ]
  },
  {
    code: "binh-thuan",
    name: "Bình Thuận",
    districts: [
      {
        code: "phan-thiet",
        name: "Thành phố Phan Thiết",
        wards: [
          { code: "phuong-duc-nghia", name: "Phường Đức Nghĩa" },
          { code: "phuong-duc-thang", name: "Phường Đức Thắng" },
          { code: "phuong-ham-tien", name: "Phường Hàm Tiến" },
        ]
      },
      {
        code: "ham-thuan-bac",
        name: "Huyện Hàm Thuận Bắc",
        wards: [
          { code: "xa-ma-lam", name: "Xã Ma Lâm" },
          { code: "xa-duc-hanh", name: "Xã Đức Hạnh" },
          { code: "xa-duc-phong", name: "Xã Đức Phong" },
        ]
      }
    ]
  },
  {
    code: "ca-mau",
    name: "Cà Mau",
    districts: [
      {
        code: "ca-mau",
        name: "Thành phố Cà Mau",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-4", name: "Phường 4" },
          { code: "phuong-5", name: "Phường 5" },
        ]
      },
      {
        code: "cai-nuoc",
        name: "Huyện Cái Nước",
        wards: [
          { code: "xa-hung-my", name: "Xã Hưng Mỹ" },
          { code: "xa-luong-the-tran", name: "Xã Lương Thế Trân" },
          { code: "xa-tan-hung", name: "Xã Tân Hưng" },
        ]
      }
    ]
  },
  {
    code: "cao-bang",
    name: "Cao Bằng",
    districts: [
      {
        code: "cao-bang",
        name: "Thành phố Cao Bằng",
        wards: [
          { code: "phuong-hop-giang", name: "Phường Hợp Giang" },
          { code: "phuong-de-nhat", name: "Phường Đề Nhất" },
          { code: "phuong-song-bang", name: "Phường Sông Bằng" },
        ]
      },
      {
        code: "bao-lac",
        name: "Huyện Bảo Lạc",
        wards: [
          { code: "xa-bao-lac", name: "Xã Bảo Lạc" },
          { code: "xa-phan-thanh", name: "Xã Phan Thanh" },
          { code: "xa-coc-xa", name: "Xã Cốc Xa" },
        ]
      }
    ]
  },
  {
    code: "dak-lak",
    name: "Đắk Lắk",
    districts: [
      {
        code: "buon-ma-thuot",
        name: "Thành phố Buôn Ma Thuột",
        wards: [
          { code: "phuong-thong-nhat", name: "Phường Thống Nhất" },
          { code: "phuong-thang-loi", name: "Phường Thắng Lợi" },
          { code: "phuong-tan-an", name: "Phường Tân An" },
        ]
      },
      {
        code: "buon-don",
        name: "Huyện Buôn Đôn",
        wards: [
          { code: "xa-krong-no", name: "Xã Krông Nô" },
          { code: "xa-ea-wer", name: "Xã Ea Wer" },
          { code: "xa-cuor-dang", name: "Xã Cuor Đăng" },
        ]
      }
    ]
  },
  {
    code: "dak-nong",
    name: "Đắk Nông",
    districts: [
      {
        code: "gia-nghia",
        name: "Thành phố Gia Nghĩa",
        wards: [
          { code: "phuong-nghia-dan", name: "Phường Nghĩa Đàn" },
          { code: "phuong-nghia-phu", name: "Phường Nghĩa Phú" },
          { code: "phuong-nghia-tru", name: "Phường Nghĩa Trụ" },
        ]
      },
      {
        code: "cu-jut",
        name: "Huyện Cư Jút",
        wards: [
          { code: "xa-ea-tul", name: "Xã Ea Tul" },
          { code: "xa-dak-wil", name: "Xã Đắk Wil" },
          { code: "xa-cu-knia", name: "Xã Cư Knia" },
        ]
      }
    ]
  },
  {
    code: "dien-bien",
    name: "Điện Biên",
    districts: [
      {
        code: "dien-bien-phu",
        name: "Thành phố Điện Biên Phủ",
        wards: [
          { code: "phuong-him-lam", name: "Phường Him Lam" },
          { code: "phuong-muong-thanh", name: "Phường Mường Thanh" },
          { code: "phuong-noong-bua", name: "Phường Noong Bua" },
        ]
      },
      {
        code: "dien-bien",
        name: "Huyện Điện Biên",
        wards: [
          { code: "xa-muong-phang", name: "Xã Mường Phăng" },
          { code: "xa-noong-luong", name: "Xã Noong Luống" },
          { code: "xa-na-tau", name: "Xã Na Tau" },
        ]
      }
    ]
  },
  {
    code: "dong-nai",
    name: "Đồng Nai",
    districts: [
      {
        code: "bien-hoa",
        name: "Thành phố Biên Hòa",
        wards: [
          { code: "phuong-an-binh", name: "Phường An Bình" },
          { code: "phuong-an-hoa", name: "Phường An Hòa" },
          { code: "phuong-buu-hoa", name: "Phường Bửu Hòa" },
        ]
      },
      {
        code: "long-thanh",
        name: "Huyện Long Thành",
        wards: [
          { code: "xa-an-phuoc", name: "Xã An Phước" },
          { code: "xa-bau-can", name: "Xã Bàu Cạn" },
          { code: "xa-cam-duong", name: "Xã Cẩm Dương" },
        ]
      }
    ]
  },
  {
    code: "dong-thap",
    name: "Đồng Tháp",
    districts: [
      {
        code: "cao-lanh",
        name: "Thành phố Cao Lãnh",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-4", name: "Phường 4" },
        ]
      },
      {
        code: "cao-lanh-huyen",
        name: "Huyện Cao Lãnh",
        wards: [
          { code: "xa-my-tho", name: "Xã Mỹ Thọ" },
          { code: "xa-ba-sao", name: "Xã Ba Sao" },
          { code: "xa-hoa-an", name: "Xã Hòa An" },
        ]
      }
    ]
  },
  {
    code: "gia-lai",
    name: "Gia Lai",
    districts: [
      {
        code: "pleiku",
        name: "Thành phố Pleiku",
        wards: [
          { code: "phuong-dien-hong", name: "Phường Diên Hồng" },
          { code: "phuong-he-thong", name: "Phường Hế Thống" },
          { code: "phuong-phu-dong", name: "Phường Phù Đổng" },
        ]
      },
      {
        code: "chu-se",
        name: "Huyện Chư Sê",
        wards: [
          { code: "xa-chu-se", name: "Xã Chư Sê" },
          { code: "xa-bar-trang", name: "Xã Bar Trang" },
          { code: "xa-dak-po", name: "Xã Đắk Pơ" },
        ]
      }
    ]
  },
  {
    code: "ha-giang",
    name: "Hà Giang",
    districts: [
      {
        code: "ha-giang",
        name: "Thành phố Hà Giang",
        wards: [
          { code: "phuong-nguyen-trai", name: "Phường Nguyễn Trãi" },
          { code: "phuong-tran-phu", name: "Phường Trần Phú" },
          { code: "phuong-minh-khai", name: "Phường Minh Khai" },
        ]
      },
      {
        code: "dong-van",
        name: "Huyện Đồng Văn",
        wards: [
          { code: "xa-dong-van", name: "Xã Đồng Văn" },
          { code: "xa-lung-cu", name: "Xã Lũng Cú" },
          { code: "xa-sa-phin", name: "Xã Sà Phìn" },
        ]
      }
    ]
  },
  {
    code: "ha-nam",
    name: "Hà Nam",
    districts: [
      {
        code: "phu-ly",
        name: "Thành phố Phủ Lý",
        wards: [
          { code: "phuong-le-loi", name: "Phường Lê Lợi" },
          { code: "phuong-tien-tien", name: "Phường Tiền Tiến" },
          { code: "phuong-hai-ba-trung", name: "Phường Hai Bà Trưng" },
        ]
      },
      {
        code: "duy-tien",
        name: "Huyện Duy Tiên",
        wards: [
          { code: "xa-chau-giang", name: "Xã Châu Giang" },
          { code: "xa-duy-minh", name: "Xã Duy Minh" },
          { code: "xa-moc-nam", name: "Xã Mộc Nam" },
        ]
      }
    ]
  },
  {
    code: "ha-tinh",
    name: "Hà Tĩnh",
    districts: [
      {
        code: "ha-tinh",
        name: "Thành phố Hà Tĩnh",
        wards: [
          { code: "phuong-bac-ha", name: "Phường Bắc Hà" },
          { code: "phuong-nam-ha", name: "Phường Nam Hà" },
          { code: "phuong-tran-phu", name: "Phường Trần Phú" },
        ]
      },
      {
        code: "hong-linh",
        name: "Huyện Hồng Lĩnh",
        wards: [
          { code: "xa-duc-lang", name: "Xã Đức Lạng" },
          { code: "xa-hong-linh", name: "Xã Hồng Lĩnh" },
          { code: "xa-duc-hoa", name: "Xã Đức Hòa" },
        ]
      }
    ]
  },
  {
    code: "hau-giang",
    name: "Hậu Giang",
    districts: [
      {
        code: "vi-thanh",
        name: "Thành phố Vị Thanh",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-5", name: "Phường 5" },
        ]
      },
      {
        code: "chau-thanh-a",
        name: "Huyện Châu Thành A",
        wards: [
          { code: "xa-mot-ngan", name: "Xã Một Ngàn" },
          { code: "xa-tan-hiep", name: "Xã Tân Hiệp" },
          { code: "xa-tan-an", name: "Xã Tân An" },
        ]
      }
    ]
  },
  {
    code: "hoa-binh",
    name: "Hòa Bình",
    districts: [
      {
        code: "hoa-binh",
        name: "Thành phố Hòa Bình",
        wards: [
          { code: "phuong-tran-hung-dao", name: "Phường Trần Hưng Đạo" },
          { code: "phuong-thong-nhat", name: "Phường Thống Nhất" },
          { code: "phuong-phuong-lam", name: "Phường Phương Lâm" },
        ]
      },
      {
        code: "mai-chau",
        name: "Huyện Mai Châu",
        wards: [
          { code: "xa-mai-chau", name: "Xã Mai Châu" },
          { code: "xa-pa-co", name: "Xã Pà Cò" },
          { code: "xa-chieng-chau", name: "Xã Chiềng Châu" },
        ]
      }
    ]
  },
  {
    code: "hung-yen",
    name: "Hưng Yên",
    districts: [
      {
        code: "hung-yen",
        name: "Thành phố Hưng Yên",
        wards: [
          { code: "phuong-an-tao", name: "Phường An Tảo" },
          { code: "phuong-hien-nam", name: "Phường Hiến Nam" },
          { code: "phuong-le-loi", name: "Phường Lê Lợi" },
        ]
      },
      {
        code: "van-lam",
        name: "Huyện Văn Lâm",
        wards: [
          { code: "xa-met", name: "Xã Mết" },
          { code: "xa-chu-minh", name: "Xã Chũ Minh" },
          { code: "xa-van-lam", name: "Xã Văn Lâm" },
        ]
      }
    ]
  },
  {
    code: "khanh-hoa",
    name: "Khánh Hòa",
    districts: [
      {
        code: "nha-trang",
        name: "Thành phố Nha Trang",
        wards: [
          { code: "phuong-loc-tho", name: "Phường Lộc Thọ" },
          { code: "phuong-nguyen-an-ninh", name: "Phường Nguyễn An Ninh" },
          { code: "phuong-phuoc-hai", name: "Phường Phước Hải" },
        ]
      },
      {
        code: "cam-ranh",
        name: "Thành phố Cam Ranh",
        wards: [
          { code: "phuong-cam-hai-dong", name: "Phường Cam Hải Đông" },
          { code: "phuong-cam-hai-tay", name: "Phường Cam Hải Tây" },
          { code: "phuong-cam-nghia", name: "Phường Cam Nghĩa" },
        ]
      }
    ]
  },
  {
    code: "kien-giang",
    name: "Kiên Giang",
    districts: [
      {
        code: "rach-gia",
        name: "Thành phố Rạch Giá",
        wards: [
          { code: "phuong-an-hoa", name: "Phường An Hòa" },
          { code: "phuong-an-lac", name: "Phường An Lạc" },
          { code: "phuong-vinh-thanh-van", name: "Phường Vĩnh Thanh Vân" },
        ]
      },
      {
        code: "phu-quoc",
        name: "Thành phố Phú Quốc",
        wards: [
          { code: "phuong-an-thoi", name: "Phường An Thới" },
          { code: "phuong-duong-dong", name: "Phường Dương Đông" },
          { code: "phuong-cua-can", name: "Phường Cửa Cạn" },
        ]
      }
    ]
  },
  {
    code: "kon-tum",
    name: "Kon Tum",
    districts: [
      {
        code: "kon-tum",
        name: "Thành phố Kon Tum",
        wards: [
          { code: "phuong-duy-tan", name: "Phường Duy Tân" },
          { code: "phuong-quang-trung", name: "Phường Quang Trung" },
          { code: "phuong-thong-nhat", name: "Phường Thống Nhất" },
        ]
      },
      {
        code: "dak-glei",
        name: "Huyện Đắk Glei",
        wards: [
          { code: "xa-dak-glei", name: "Xã Đắk Glei" },
          { code: "xa-dak-man", name: "Xã Đắk Man" },
          { code: "xa-dak-nhoong", name: "Xã Đắk Nhoong" },
        ]
      }
    ]
  },
  {
    code: "lai-chau",
    name: "Lai Châu",
    districts: [
      {
        code: "lai-chau",
        name: "Thành phố Lai Châu",
        wards: [
          { code: "phuong-dong-phong", name: "Phường Đông Phong" },
          { code: "phuong-tan-phong", name: "Phường Tân Phong" },
          { code: "phuong-quynh-hoa", name: "Phường Quynh Hoa" },
        ]
      },
      {
        code: "muong-te",
        name: "Huyện Mường Tè",
        wards: [
          { code: "xa-muong-te", name: "Xã Mường Tè" },
          { code: "xa-ka-lăng", name: "Xã Ka Lăng" },
          { code: "xa-nậm-khăn", name: "Xã Nậm Khăn" },
        ]
      }
    ]
  },
  {
    code: "lam-dong",
    name: "Lâm Đồng",
    districts: [
      {
        code: "da-lat",
        name: "Thành phố Đà Lạt",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-4", name: "Phường 4" },
        ]
      },
      {
        code: "bao-loc",
        name: "Thành phố Bảo Lộc",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-loc-phat", name: "Phường Lộc Phát" },
        ]
      }
    ]
  },
  {
    code: "lang-son",
    name: "Lạng Sơn",
    districts: [
      {
        code: "lang-son",
        name: "Thành phố Lạng Sơn",
        wards: [
          { code: "phuong-chi-lang", name: "Phường Chi Lăng" },
          { code: "phuong-dong-kinh", name: "Phường Đông Kinh" },
          { code: "phuong-tam-thanh", name: "Phường Tam Thanh" },
        ]
      },
      {
        code: "cao-loc",
        name: "Huyện Cao Lộc",
        wards: [
          { code: "xa-cao-loc", name: "Xã Cao Lộc" },
          { code: "xa-thach-linh", name: "Xã Thạch Lĩnh" },
          { code: "xa-xuan-long", name: "Xã Xuân Long" },
        ]
      }
    ]
  },
  {
    code: "lao-cai",
    name: "Lào Cai",
    districts: [
      {
        code: "lao-cai",
        name: "Thành phố Lào Cai",
        wards: [
          { code: "phuong-bac-lenh", name: "Phường Bắc Lệnh" },
          { code: "phuong-cam-duong", name: "Phường Cẩm Dương" },
          { code: "phuong-dong-phuong", name: "Phường Đông Phương" },
        ]
      },
      {
        code: "sa-pa",
        name: "Thị xã Sa Pa",
        wards: [
          { code: "phuong-sa-pa", name: "Phường Sa Pa" },
          { code: "phuong-ham-rong", name: "Phường Hàm Rồng" },
          { code: "xa-ta-phin", name: "Xã Tả Phìn" },
        ]
      }
    ]
  },
  {
    code: "long-an",
    name: "Long An",
    districts: [
      {
        code: "tan-an",
        name: "Thành phố Tân An",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-4", name: "Phường 4" },
        ]
      },
      {
        code: "ben-luc",
        name: "Huyện Bến Lức",
        wards: [
          { code: "xa-ben-luc", name: "Xã Bến Lức" },
          { code: "xa-thanh-lan", name: "Xã Thanh Lân" },
          { code: "xa-binh-duc", name: "Xã Bình Đức" },
        ]
      }
    ]
  },
  {
    code: "nam-dinh",
    name: "Nam Định",
    districts: [
      {
        code: "nam-dinh",
        name: "Thành phố Nam Định",
        wards: [
          { code: "phuong-cua-bac", name: "Phường Cửa Bắc" },
          { code: "phuong-cua-nam", name: "Phường Cửa Nam" },
          { code: "phuong-truong-thi", name: "Phường Trường Thi" },
        ]
      },
      {
        code: "my-loc",
        name: "Huyện Mỹ Lộc",
        wards: [
          { code: "xa-my-loc", name: "Xã Mỹ Lộc" },
          { code: "xa-my-tan", name: "Xã Mỹ Tân" },
          { code: "xa-my-thang", name: "Xã Mỹ Thắng" },
        ]
      }
    ]
  },
  {
    code: "nghe-an",
    name: "Nghệ An",
    districts: [
      {
        code: "vinh",
        name: "Thành phố Vinh",
        wards: [
          { code: "phuong-ben-thuy", name: "Phường Bến Thủy" },
          { code: "phuong-cua-nam", name: "Phường Cửa Nam" },
          { code: "phuong-dong-vinh", name: "Phường Đông Vĩnh" },
        ]
      },
      {
        code: "cua-lo",
        name: "Thị xã Cửa Lò",
        wards: [
          { code: "phuong-nghi-hai", name: "Phường Nghi Hải" },
          { code: "phuong-nghi-hoa", name: "Phường Nghi Hòa" },
          { code: "phuong-nghi-thuy", name: "Phường Nghi Thủy" },
        ]
      }
    ]
  },
  {
    code: "ninh-binh",
    name: "Ninh Bình",
    districts: [
      {
        code: "ninh-binh",
        name: "Thành phố Ninh Bình",
        wards: [
          { code: "phuong-bich-dao", name: "Phường Bích Đào" },
          { code: "phuong-nam-binh", name: "Phường Nam Bình" },
          { code: "phuong-nam-thanh", name: "Phường Nam Thành" },
        ]
      },
      {
        code: "tam-diep",
        name: "Thành phố Tam Điệp",
        wards: [
          { code: "phuong-anh-son", name: "Phường Anh Sơn" },
          { code: "phuong-bac-son", name: "Phường Bắc Sơn" },
          { code: "phuong-dong-son", name: "Phường Đông Sơn" },
        ]
      }
    ]
  },
  {
    code: "ninh-thuan",
    name: "Ninh Thuận",
    districts: [
      {
        code: "phan-rang-thap-cham",
        name: "Thành phố Phan Rang-Tháp Chàm",
        wards: [
          { code: "phuong-bac-phong", name: "Phường Bắc Phong" },
          { code: "phuong-dai-an", name: "Phường Đài An" },
          { code: "phuong-my-binh", name: "Phường Mỹ Bình" },
        ]
      },
      {
        code: "bac-ai",
        name: "Huyện Bác Ái",
        wards: [
          { code: "xa-phuoc-binh", name: "Xã Phước Bình" },
          { code: "xa-phuoc-hoa", name: "Xã Phước Hòa" },
          { code: "xa-phuoc-nam", name: "Xã Phước Nam" },
        ]
      }
    ]
  },
  {
    code: "phu-tho",
    name: "Phú Thọ",
    districts: [
      {
        code: "viet-tri",
        name: "Thành phố Việt Trì",
        wards: [
          { code: "phuong-tien-cat", name: "Phường Tiên Cát" },
          { code: "phuong-nong-trang", name: "Phường Nông Trang" },
          { code: "phuong-ben-got", name: "Phường Bến Gót" },
        ]
      },
      {
        code: "phu-tho",
        name: "Thành phố Phú Thọ",
        wards: [
          { code: "phuong-hung-vuong", name: "Phường Hùng Vương" },
          { code: "phuong-gia-cam", name: "Phường Gia Cẩm" },
          { code: "phuong-van-phuc", name: "Phường Vân Phúc" },
        ]
      }
    ]
  },
  {
    code: "phu-yen",
    name: "Phú Yên",
    districts: [
      {
        code: "tuy-hoa",
        name: "Thành phố Tuy Hòa",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-4", name: "Phường 4" },
        ]
      },
      {
        code: "dong-hoa",
        name: "Huyện Đông Hòa",
        wards: [
          { code: "xa-hoa-dong", name: "Xã Hòa Đông" },
          { code: "xa-hoa-thang", name: "Xã Hòa Thắng" },
          { code: "xa-hoa-xuan", name: "Xã Hòa Xuân" },
        ]
      }
    ]
  },
  {
    code: "quang-binh",
    name: "Quảng Bình",
    districts: [
      {
        code: "dong-hoi",
        name: "Thành phố Đồng Hới",
        wards: [
          { code: "phuong-bac-ly", name: "Phường Bắc Lý" },
          { code: "phuong-dong-my", name: "Phường Đồng Mỹ" },
          { code: "phuong-dong-phong", name: "Phường Đồng Phú" },
        ]
      },
      {
        code: "ba-don",
        name: "Thị xã Ba Đồn",
        wards: [
          { code: "phuong-ba-don", name: "Phường Ba Đồn" },
          { code: "phuong-quang-thong", name: "Phường Quảng Thông" },
          { code: "phuong-quang-trung", name: "Phường Quảng Trung" },
        ]
      }
    ]
  },
  {
    code: "quang-nam",
    name: "Quảng Nam",
    districts: [
      {
        code: "tam-ky",
        name: "Thành phố Tam Kỳ",
        wards: [
          { code: "phuong-an-my", name: "Phường An Mỹ" },
          { code: "phuong-an-phu", name: "Phường An Phú" },
          { code: "phuong-an-xuan", name: "Phường An Xuân" },
        ]
      },
      {
        code: "hoi-an",
        name: "Thành phố Hội An",
        wards: [
          { code: "phuong-cam-chau", name: "Phường Cẩm Châu" },
          { code: "phuong-cam-nam", name: "Phường Cẩm Nam" },
          { code: "phuong-minh-an", name: "Phường Minh An" },
        ]
      }
    ]
  },
  {
    code: "quang-ngai",
    name: "Quảng Ngãi",
    districts: [
      {
        code: "quang-ngai",
        name: "Thành phố Quảng Ngãi",
        wards: [
          { code: "phuong-cham-duc", name: "Phường Chấm Đức" },
          { code: "phuong-le-hong-phong", name: "Phường Lê Hồng Phong" },
          { code: "phuong-nghia-chanh", name: "Phường Nghĩa Chánh" },
        ]
      },
      {
        code: "binh-son",
        name: "Huyện Bình Sơn",
        wards: [
          { code: "xa-binh-an", name: "Xã Bình An" },
          { code: "xa-binh-chau", name: "Xã Bình Châu" },
          { code: "xa-binh-ha", name: "Xã Bình Hà" },
        ]
      }
    ]
  },
  {
    code: "quang-ninh",
    name: "Quảng Ninh",
    districts: [
      {
        code: "ha-long",
        name: "Thành phố Hạ Long",
        wards: [
          { code: "phuong-bac-son", name: "Phường Bắc Sơn" },
          { code: "phuong-cao-thang", name: "Phường Cao Thắng" },
          { code: "phuong-cao-xanh", name: "Phường Cao Xanh" },
        ]
      },
      {
        code: "cam-pha",
        name: "Thành phố Cẩm Phả",
        wards: [
          { code: "phuong-cam-dong", name: "Phường Cẩm Đông" },
          { code: "phuong-cam-son", name: "Phường Cẩm Sơn" },
          { code: "phuong-cam-tay", name: "Phường Cẩm Tây" },
        ]
      }
    ]
  },
  {
    code: "quang-tri",
    name: "Quảng Trị",
    districts: [
      {
        code: "dong-ha",
        name: "Thành phố Đông Hà",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-4", name: "Phường 4" },
        ]
      },
      {
        code: "gio-linh",
        name: "Huyện Gio Linh",
        wards: [
          { code: "xa-gio-an", name: "Xã Gio An" },
          { code: "xa-gio-hai", name: "Xã Gio Hải" },
          { code: "xa-gio-linh", name: "Xã Gio Linh" },
        ]
      }
    ]
  },
  {
    code: "soc-trang",
    name: "Sóc Trăng",
    districts: [
      {
        code: "soc-trang",
        name: "Thành phố Sóc Trăng",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-4", name: "Phường 4" },
        ]
      },
      {
        code: "vinh-chau",
        name: "Thị xã Vĩnh Châu",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "xa-lai-hoa", name: "Xã Lại Hòa" },
        ]
      }
    ]
  },
  {
    code: "son-la",
    name: "Sơn La",
    districts: [
      {
        code: "son-la",
        name: "Thành phố Sơn La",
        wards: [
          { code: "phuong-chieng-an", name: "Phường Chiềng An" },
          { code: "phuong-chieng-coi", name: "Phường Chiềng Cơi" },
          { code: "phuong-chieng-le", name: "Phường Chiềng Lề" },
        ]
      },
      {
        code: "moc-chau",
        name: "Huyện Mộc Châu",
        wards: [
          { code: "xa-moc-chau", name: "Xã Mộc Châu" },
          { code: "xa-san-khang", name: "Xã Sặn Kháng" },
          { code: "xa-nt-son", name: "Xã NT Sơn" },
        ]
      }
    ]
  },
  {
    code: "tay-ninh",
    name: "Tây Ninh",
    districts: [
      {
        code: "tay-ninh",
        name: "Thành phố Tây Ninh",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-4", name: "Phường 4" },
        ]
      },
      {
        code: "cu-chi",
        name: "Huyện Củ Chi",
        wards: [
          { code: "xa-an-nhon-tay", name: "Xã An Nhơn Tây" },
          { code: "xa-binh-my", name: "Xã Bình Mỹ" },
          { code: "xa-cu-chi", name: "Xã Củ Chi" },
        ]
      }
    ]
  },
  {
    code: "thai-binh",
    name: "Thái Bình",
    districts: [
      {
        code: "thai-binh",
        name: "Thành phố Thái Bình",
        wards: [
          { code: "phuong-de-tham", name: "Phường Đề Thám" },
          { code: "phuong-hoang-dieu", name: "Phường Hoàng Diệu" },
          { code: "phuong-ky-ba", name: "Phường Kỳ Bá" },
        ]
      },
      {
        code: "dong-hung",
        name: "Huyện Đông Hưng",
        wards: [
          { code: "xa-dong-hung", name: "Xã Đông Hưng" },
          { code: "xa-dong-cac", name: "Xã Đông Các" },
          { code: "xa-ta-thanh-oai", name: "Xã Tả Thanh Oai" },
        ]
      }
    ]
  },
  {
    code: "thai-nguyen",
    name: "Thái Nguyên",
    districts: [
      {
        code: "thai-nguyen",
        name: "Thành phố Thái Nguyên",
        wards: [
          { code: "phuong-dong-quang", name: "Phường Đồng Quang" },
          { code: "phuong-hoang-van-thu", name: "Phường Hoàng Văn Thụ" },
          { code: "phuong-phan-thinh", name: "Phường Phan Thiết" },
        ]
      },
      {
        code: "song-cong",
        name: "Thành phố Sông Công",
        wards: [
          { code: "phuong-lam-son", name: "Phường Lam Sơn" },
          { code: "phuong-que-vo", name: "Phường Quế Võ" },
          { code: "phuong-viet-bac", name: "Phường Việt Bắc" },
        ]
      }
    ]
  },
  {
    code: "thanh-hoa",
    name: "Thanh Hóa",
    districts: [
      {
        code: "thanh-hoa",
        name: "Thành phố Thanh Hóa",
        wards: [
          { code: "phuong-ba-dinh", name: "Phường Ba Đình" },
          { code: "phuong-dong-hai", name: "Phường Đông Hải" },
          { code: "phuong-dong-son", name: "Phường Đông Sơn" },
        ]
      },
      {
        code: "sam-son",
        name: "Thành phố Sầm Sơn",
        wards: [
          { code: "phuong-ba-trung", name: "Phường Ba Trưng" },
          { code: "phuong-quang-cau", name: "Phường Quảng Cầu" },
          { code: "phuong-quang-hung", name: "Phường Quảng Hùng" },
        ]
      }
    ]
  },
  {
    code: "thua-thien-hue",
    name: "Thừa Thiên Huế",
    districts: [
      {
        code: "hue",
        name: "Thành phố Huế",
        wards: [
          { code: "phuong-an-cuu", name: "Phường An Cựu" },
          { code: "phuong-an-dong", name: "Phường An Đông" },
          { code: "phuong-an-hoa", name: "Phường An Hòa" },
        ]
      },
      {
        code: "a-luoi",
        name: "Huyện A Lưới",
        wards: [
          { code: "xa-a-dot", name: "Xã A Dot" },
          { code: "xa-a-luoi", name: "Xã A Lưới" },
          { code: "xa-hong-ha", name: "Xã Hồng Hạ" },
        ]
      }
    ]
  },
  {
    code: "tien-giang",
    name: "Tiền Giang",
    districts: [
      {
        code: "my-tho",
        name: "Thành phố Mỹ Tho",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-4", name: "Phường 4" },
        ]
      },
      {
        code: "go-cong",
        name: "Thị xã Gò Công",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
        ]
      }
    ]
  },
  {
    code: "tra-vinh",
    name: "Trà Vinh",
    districts: [
      {
        code: "tra-vinh",
        name: "Thành phố Trà Vinh",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-4", name: "Phường 4" },
        ]
      },
      {
        code: "duyen-hai",
        name: "Huyện Duyên Hải",
        wards: [
          { code: "xa-dong-hai", name: "Xã Đông Hải" },
          { code: "xa-ngoc-bien", name: "Xã Ngọc Biên" },
          { code: "xa-truong-long-hoa", name: "Xã Trường Long Hòa" },
        ]
      }
    ]
  },
  {
    code: "tuyen-quang",
    name: "Tuyên Quang",
    districts: [
      {
        code: "tuyen-quang",
        name: "Thành phố Tuyên Quang",
        wards: [
          { code: "phuong-an-tuong", name: "Phường An Tường" },
          { code: "phuong-dong-mai", name: "Phường Đông Mai" },
          { code: "phuong-le-duan", name: "Phường Lê Duẩn" },
        ]
      },
      {
        code: "chiem-hoa",
        name: "Huyện Chiêm Hóa",
        wards: [
          { code: "xa-vinh-loc", name: "Xã Vĩnh Lộc" },
          { code: "xa-yen-nguyen", name: "Xã Yên Nguyên" },
          { code: "xa-yen-phu", name: "Xã Yên Phú" },
        ]
      }
    ]
  },
  {
    code: "vinh-long",
    name: "Vĩnh Long",
    districts: [
      {
        code: "vinh-long",
        name: "Thành phố Vĩnh Long",
        wards: [
          { code: "phuong-1", name: "Phường 1" },
          { code: "phuong-2", name: "Phường 2" },
          { code: "phuong-3", name: "Phường 3" },
          { code: "phuong-4", name: "Phường 4" },
        ]
      },
      {
        code: "binh-minh",
        name: "Huyện Bình Minh",
        wards: [
          { code: "xa-binh-duc", name: "Xã Bình Đức" },
          { code: "xa-cai-von", name: "Xã Cái Vồn" },
          { code: "xa-dong-binh", name: "Xã Đông Bình" },
        ]
      }
    ]
  },
  {
    code: "vinh-phuc",
    name: "Vĩnh Phúc",
    districts: [
      {
        code: "vinh-yen",
        name: "Thành phố Vĩnh Yên",
        wards: [
          { code: "phuong-dong-tam", name: "Phường Đông Tâm" },
          { code: "phuong-khai-quang", name: "Phường Khai Quang" },
          { code: "phuong-linh-dam", name: "Phường Linh Đàm" },
        ]
      },
      {
        code: "phuc-yen",
        name: "Thành phố Phúc Yên",
        wards: [
          { code: "phuong-dong-ngac", name: "Phường Đông Ngạc" },
          { code: "phuong-hung-vuong", name: "Phường Hùng Vương" },
          { code: "phuong-trung-my", name: "Phường Trung Mỹ" },
        ]
      }
    ]
  },
  {
    code: "yen-bai",
    name: "Yên Bái",
    districts: [
      {
        code: "yen-bai",
        name: "Thành phố Yên Bái",
        wards: [
          { code: "phuong-dong-tam", name: "Phường Đồng Tâm" },
          { code: "phuong-yen-ninh", name: "Phường Yên Ninh" },
          { code: "phuong-yen-thinh", name: "Phường Yên Thịnh" },
        ]
      },
      {
        code: "nghia-lo",
        name: "Thị xã Nghĩa Lộ",
        wards: [
          { code: "phuong-nghia-lo", name: "Phường Nghĩa Lộ" },
          { code: "phuong-nghia-phuc", name: "Phường Nghĩa Phúc" },
          { code: "xa-nghia-an", name: "Xã Nghĩa An" },
        ]
      }
    ]
  }
];

export const getDistrictsByProvince = (provinceCode: string): District[] => {
  const province = vietnamAddressData.find(p => p.code === provinceCode);
  return province ? province.districts : [];
};

export const getWardsByDistrict = (provinceCode: string, districtCode: string): Ward[] => {
  const province = vietnamAddressData.find(p => p.code === provinceCode);
  if (!province) return [];
  
  const district = province.districts.find(d => d.code === districtCode);
  return district ? district.wards : [];
};
