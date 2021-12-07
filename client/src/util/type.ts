export interface Users {
  general: {
    email: string;
    token: string;
  };
  active: {
    isClosed: boolean;
    lastAccessTime: Date;
  };
  _id: string;
  name: string;
  createdAt: Date;
}

export interface Product {
  artist: Artists;
  artCode: string;
  title: string;
  image: string;
  theme: string;
  info: {
    details: string;
    size: string;
    canvas: string;
    createdAt: string;
  };
  price: number;
  count: number;
  inStock: boolean;
  updatedAt: Date;
  _id: string;
}

export interface ProductDetail {
  productDetail: {
    _id: string;
    artCode: string;
    title: string;
    image: string;
    theme: string;
    artist: {
      _id: string;
      code: string;
      name: string;
      aka: string;
      record: string;
    };
    info: {
      details: string;
      size: string;
      canvas: string;
      createdAt: string;
    };
    likes: [string];
    price: number;
    inStock: boolean;
  };
  productsByArtist: [
    {
      _id: string;
      image: string;
    },
  ];
  productsByRandom: [
    {
      _id: string;
      image: string;
    },
  ];
}

export interface Artists {
  code: string;
  name: string;
  aka: string;
  record: string;
  thumbnail: string;
  joinAt: Date;
  countOfWorks: number;
  isActive: boolean;
}

export interface Order {
  orderItems: [
    {
      image: string;
      title: string;
      artist: string;
      size: string;
      price: number;
    },
  ];
  result: {
    id: string;
    paidAt: Date;
    status: number;
    updatedAt: Date;
  };
  deliver: {
    address: string;
    receiver: string;
    request: string;
  };
  ordererInfo: {
    name: string;
    phoneNum: string;
    email: string;
    refundTerms: string;
  };
  shippingPrice: number;
  totalPrice: number;
  // deliveredAt: Date;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
}

export interface Events {
  heading: string;
  content: string;
  linkname: string;
  link: string;
  image: string;
}
