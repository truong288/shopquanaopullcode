
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
      },
      {
        code: "binh-phuoc",
        name: "Bình Phước",
        wards: [
          { code: "phuong-dong-binh", name: "Phường Đông Bình" },
          { code: "phuong-tan-binh", name: "Phường Tân Bình" },
          { code: "phuong-tan-dong", name: "Phường Tân Đông" },
        ]
      }
    ]
  },
  {
    code: "hanoi",
    name: "Hà Nội", 
    districts: [
      {
        code: "quan-hoan-kiem",
        name: "Quận Hoàn Kiếm",
        wards: [
          { code: "phuong-hang-bac", name: "Phường Hàng Bạc" },
          { code: "phuong-hang-bo", name: "Phường Hàng Bồ" },
          { code: "phuong-hang-gai", name: "Phường Hàng Gai" },
        ]
      },
      {
        code: "quan-ba-dinh",
        name: "Quận Ba Đình",
        wards: [
          { code: "phuong-cong-vi", name: "Phường Cống Vị" },
          { code: "phuong-dien-bien", name: "Phường Điện Biên" },
          { code: "phuong-doi-can", name: "Phường Đội Cấn" },
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
