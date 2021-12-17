import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from 'pages/SignInPage/SignIn';
import SignUp from 'pages/SignUpPage/SignUp';
import Landing from 'pages/LandingPage/Landing';
import ArtList from 'pages/ArtListPage/ArtList';
import ArtDetail from 'pages/ArtDetailPage/ArtDetail';
import Artists from 'pages/ArtistListPage/ArtistList';
import Cart from 'pages/CartPage/Cart';
import MyPage from 'pages/MyPage/MyPage';
import Order from 'pages/OrderPage/Order';
import OrderDetail from 'pages/OrderDetail/OrderDetail';
import PaymentFinished from 'pages/PaymentFinishedPage/PaymentFinished';
import AdminOrder from 'pages/AdminOrderPage/AdminOrder';
import AdminProduct from 'pages/AdminProductPage/AdminProduct';
import AdminUser from 'pages/AdminUserPage/AdminUser';
import AdminArtist from 'pages/AdminArtist/AdminArtist';
import AdminBanner from 'pages/AdminBannerPage/AdminBanner';
import ArtistDetail from 'pages/ArtistDetailPage/ArtistDetail';
import Error from 'pages/ErrorPage/Error';
import Callback from 'pages/CallbackPage/Callback';
import { GlobalStyle } from 'styles/global-style';
import SearchResult from 'pages/SearchResult/SearchResult';

function App() {
  useEffect(() => {
    // Kakao 공유 SDK 초기화
    window.Kakao.init(process.env.REACT_APP_KAKAO);
    window.Kakao.isInitialized();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/artlist" element={<ArtList />} />
          <Route path="/search/" element={<SearchResult />} />
          <Route path="/artdetail/:id" element={<ArtDetail />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artistdetail/:id" element={<ArtistDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/orderdetail/:id" element={<OrderDetail />} />
          <Route path="/paymentfinished" element={<PaymentFinished />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/admin/order" element={<AdminOrder />} />
          <Route path="/admin/product" element={<AdminProduct />} />
          <Route path="/admin/user" element={<AdminUser />} />
          <Route path="/admin/artist" element={<AdminArtist />} />
          <Route path="/admin/banner" element={<AdminBanner />} />
          <Route path="/error" element={<Error />} />
          <Route path="/oauth/:corp" element={<Callback />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
