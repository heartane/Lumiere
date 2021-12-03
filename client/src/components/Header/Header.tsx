import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { IsSigninState } from 'States/IsLoginState';
import instance from 'util/axios';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { HiMenuAlt1 } from 'react-icons/hi';
import { BiSearch, BiHeart } from 'react-icons/bi';
import { AiOutlineShoppingCart, AiOutlinePoweroff } from 'react-icons/ai';
import { RiUserLine } from 'react-icons/ri';
import {
  HeaderContainer,
  HambugerBtn,
  MainMenu,
  LogoBox,
  IconBox,
  HeaderInfoBox,
} from './styled';
import { UserInfoBox, NavButtonBox } from '../Nav/styled';
import Nav from '../Nav/Nav';

const Header = () => {
  const [isLogin, setIsLogin] = useRecoilState(IsSigninState);
  const [showMenu, setShowMenu] = useState(false);

  const history = useNavigate();

  const logoutHandler = () => {
    // axios 요청
    instance
      .patch(
        '/users/logout',
        { lastAccessTime: new Date() },
        { withCredentials: true },
      )
      .then((res) => {
        console.log(res);
        localStorage.removeItem('lumiereUserInfo');
        setIsLogin(false);
        history('/');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showMenuBox = () => {
    setShowMenu(!showMenu);
  };
  return (
    <HeaderContainer>
      <HambugerBtn onClick={showMenuBox}>
        <HiMenuAlt1 />
      </HambugerBtn>
      <LogoBox>
        <Link to="/">
          <img src="/images/logo.png" alt="루미에르 로고" />
        </Link>
      </LogoBox>
      {/* 모바일 Nav */}
      {showMenu && <Nav />}
      {/* 웹 Nav */}
      <MainMenu>
        <ul>
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <Link to="/artlist">작품보기</Link>
          </li>
          <li>
            <Link to="/artists">작가</Link>
          </li>
          <li>
            <Link to="/">작가 신청</Link>
          </li>
        </ul>
      </MainMenu>
      <IconBox>
        <div>
          <BiSearch />
        </div>
        <Link to="/cart">
          <AiOutlineShoppingCart />
        </Link>
        <Link to="/mypage/zzim">
          <BiHeart />
        </Link>
      </IconBox>
      {isLogin ? (
        <HeaderInfoBox>
          <UserInfoBox>
            <Link to="/mypage">
              <RiUserLine />
              <div>
                <span>최소훈</span> 님
              </div>
            </Link>
            <Link to="/" onClick={logoutHandler}>
              <AiOutlinePoweroff />
            </Link>
          </UserInfoBox>
        </HeaderInfoBox>
      ) : (
        <HeaderInfoBox>
          <NavButtonBox>
            <Link to="/signin">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </NavButtonBox>
        </HeaderInfoBox>
      )}
    </HeaderContainer>
  );
};
export default Header;
