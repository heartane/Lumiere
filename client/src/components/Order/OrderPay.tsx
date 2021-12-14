/* eslint-disable */
import { useComma, useName, useOrderNumber } from 'util/functions';
import instance from 'util/axios';
import dotenv from 'dotenv';
import { useNavigate } from 'react-router-dom';
import {
  OrderDeliver,
  OrdererUserInfo,
  OrderDelierDetail,
  OrderPrice,
  OrderProducts,
  RequestPayParams,
  RequestPayResponse,
} from 'util/type';
import {
  OrderContentContainer,
  ContentWrap,
  CountWrap,
  DescriptionWrap,
  ClickBtn,
  PayTitle,
  ClickBtnSpan,
} from './styled';

type PriceProps = {
  priceState: OrderPrice;
  clientPrice: number;
  shippingState: OrderDeliver;
  ordererInfoState: OrdererUserInfo;
  deliveryReqState: OrderDelierDetail;
  productState: OrderProducts[];
  orderProduct: string[];
};

dotenv.config();

declare global {
  interface Window {
    IMP: any;
  }
}

export const OrderPay = ({
  priceState,
  clientPrice,
  shippingState,
  ordererInfoState,
  deliveryReqState,
  productState,
  orderProduct,
}: PriceProps) => {
  const history = useNavigate();

  const OrderPaymentHandler = () => {
    // IAMPORT 핸들러
    const hanldePayment = () => {
      // 가맹점 식별코드 이용하여 IMP객체 초기화
      const IMP = window.IMP; // 생략 가능
      IMP.init(process.env.REACT_APP_IMPORT);

      // 결제 금액
      const amount: number = priceState.totalPrice + priceState.shippingPrice;
      if (!amount) {
        alert('결제 금액을 확인해주세요');
        return;
      }

      // req 함수 data 설정
      const data: RequestPayParams = {
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: useOrderNumber(),
        name: useName(productState),
        amount: amount,
        buyer_name: ordererInfoState.name,
        buyer_tel: ordererInfoState.phoneNum,
        buyer_email: ordererInfoState.email,
        m_redirect_url: 'http:localhost:3000',
        app_scheme: 'http:localhost:3000',
      };

      const callback = (response: RequestPayResponse) => {
        const {
          success,
          merchant_uid,
          error_msg,
          imp_uid,
          error_code,
          paid_amount,
          name,
          pg_tid,
          buyer_name,
          buyer_email,
          buyer_tel,
          paid_at,
          receipt_url,
        } = response;

        if (success) {
          // 주문에 성공했으니 서버에 주문 정보 전달
          const orderItem = productState.map((el) => {
            return {
              product: el._id,
              image: el.image,
              title: el.title,
              artist: el.artist.name,
              size: `${el.info.size}(${el.info.canvas}호)`,
              price: el.price,
            };
          });
          if (
            priceState.totalPrice + priceState.shippingPrice ===
            response.paid_amount
          ) {
            instance
              .post('/orders', {
                orderItems: orderItem,
                result: {
                  id: response.merchant_uid,
                  imp_uid: response.imp_uid,
                },
                deliveryInfo: shippingState,
                deliveryDetails: deliveryReqState,
                ordererInfo: ordererInfoState,
                shippingPrice: priceState.shippingPrice,
                totalPrice: priceState.totalPrice + priceState.shippingPrice,
              })
              .then((res) => {
                const localInfo = localStorage.getItem('cartItems');
                const newArr = JSON.parse(localInfo || '[]').filter(
                  (el: string) => {
                    return !orderProduct.includes(el);
                  },
                );
                localStorage.setItem('cartItems', JSON.stringify(newArr));
                history('/paymentfinished');
              })
              .catch((err) => {
                // 이럴 경우에는 환불해줘야됨 꼭 구현해야 하는것
                window.location.assign('/error');
                console.log(err.response);
              });
          } else {
            alert('결제금액이 이상합니다.');
            window.location.assign('/error');
          }
        } else {
          // 실패한 경우
          alert('주문을 취소 하셨습니다');
        }
      };

      IMP.request_pay(data, callback);
    };

    // 품절여부 확인
    instance
      .get('/products/cart-items', { params: { productId: orderProduct } })
      .then((res) => {
        const newArr = res.data.filter((el: OrderProducts) => {
          return el.inStock;
        });
        if (newArr.length !== res.data.length) {
          // 품절 상품이 있는경우
          alert('품절 상품이 있습니다 품절상품 제외하고 다시 주문해주세요');
          window.history.back();
        } else {
          // 결제 요청금액 확인
          instance
            .get('/products/total-price', {
              params: { productId: orderProduct },
            })
            .then((res) => {
              if (res.data.totalPrice && priceState.totalPrice && clientPrice) {
                // 품절상품도 없고 결제 금액도 맞는 상태
                hanldePayment();
              } else {
                // 재고는 있지만 결제금액 불일치
                window.location.assign('/error');
              }
            })
            .catch(() => {
              window.location.assign('/error');
            });
        }
      })
      .catch(() => {
        window.location.assign('/error');
      });
  };

  return (
    <OrderContentContainer mobile="mobile">
      <ContentWrap>
        <PayTitle>결제 예정금액</PayTitle>
        <CountWrap>
          <DescriptionWrap>
            <dt>주문금액</dt>
            <dd>{`${useComma(priceState.totalPrice)} 원`}</dd>
          </DescriptionWrap>
          <DescriptionWrap>
            <dt>배송비</dt>
            <dd>{`${useComma(priceState.shippingPrice)} 원`}</dd>
          </DescriptionWrap>
          <DescriptionWrap>
            <dt>총 결제 예정금액</dt>
            <dd>{`${useComma(
              priceState.totalPrice + priceState.shippingPrice,
            )} 원`}</dd>
          </DescriptionWrap>
        </CountWrap>
        <ClickBtn type="button" onClick={OrderPaymentHandler}>
          <ClickBtnSpan>{`${useComma(
            priceState.totalPrice + priceState.shippingPrice,
          )}원`}</ClickBtnSpan>
          결제하기
        </ClickBtn>
      </ContentWrap>
    </OrderContentContainer>
  );
};
