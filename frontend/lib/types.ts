export interface Product {
  id: number;
  title: string;
  content: string;
  price: number;
  stock: number;
  category: string;
  fileName: string | null;
  createdAt: string;
}

export interface NoticeSummary {
  id: number;
  title: string;
}

export interface Notice extends NoticeSummary {
  content: string;
  createdAt: string;
  adminId: number | null;
}

export interface MainData {
  posts: Product[];
  topNotices: NoticeSummary[];
  keyword: string;
  category: string;
}

export interface LoginUser {
  id: number;
  username: string;
}

export interface UserInfo extends LoginUser {
  name: string;
  birthdate: string;
  phoneNumber: string;
  accountLocked: boolean;
}

export interface AdminMe extends LoginUser {
  role: string;
}

export interface AdminAccount extends LoginUser {
  accountLocked: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  productTitle: string;
  price: number;
  fileName: string | null;
}
