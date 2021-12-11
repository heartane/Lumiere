/* eslint no-underscore-dangle: 0 */
import { useEffect, useState } from 'react';
import instance from 'util/axios';
import { AdminProductsType, Product } from 'util/type';
import { v4 as uuidv4 } from 'uuid';
import { useComma } from 'util/functions';
import AdminHeader from 'components/Header/AdminHeader';
import { ModalBackDrop } from 'components/Modal/styled';
import YesNoModal from 'components/Modal/YesNoModal';
import AdminEditProduct from 'components/Modal/AdminEditProduct';
import { Table, TableWrap, AdminHeaderWrap } from './styled';

const AdminProduct = () => {
  const [productList, setProductList] = useState<AdminProductsType>({
    products: [
      {
        artist: {
          code: '',
          name: '',
          aka: '',
          record: '',
          thumbnail: '',
          joinAt: new Date(),
          countOfWorks: 0,
          isActive: false,
        },
        artCode: '',
        title: '',
        image: '',
        theme: '',
        info: {
          details: '',
          size: '',
          canvas: 0,
          createdAt: '',
        },
        price: 0,
        view: 0,
        inStock: false,
        updatedAt: new Date(),
        _id: '',
      },
    ],
    page: 0,
    pages: 0,
  });
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [clickProduct, setClickProduct] = useState<Product>({
    artist: {
      code: '',
      name: '',
      aka: '',
      record: '',
      thumbnail: '',
      joinAt: new Date(),
      countOfWorks: 0,
      isActive: false,
    },
    artCode: '',
    title: '',
    image: '',
    theme: '',
    info: {
      details: '',
      size: '',
      canvas: 0,
      createdAt: '',
    },
    price: 0,
    view: 0,
    inStock: false,
    updatedAt: new Date(),
    _id: '',
  });
  useEffect(() => {
    instance.get<AdminProductsType>('/products').then((res) => {
      setProductList(res.data);
    });
  }, []);

  const isInStock = (param: boolean) => {
    if (param) return '판매중';
    return '재고없음';
  };

  const isDeleteHandler = () => {
    setIsDelete(!isDelete);
  };

  const isEditHandler = () => {
    setIsEdit(!isEdit);
  };

  const clickProductHandler = (el: Product) => {
    setClickProduct(el);
    isEditHandler();
  };

  const deleteClickProduct = (el: Product) => {
    setClickProduct(el);
    isDeleteHandler();
  };

  const deleteProductHandler = () => {
    instance
      .delete(`/products/${clickProduct._id}`)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(clickProduct._id);
        console.log(err);
        alert('버그발생 콘솔로그 확인');
        isDeleteHandler();
      });
    // console.log(clickProduct._id);
  };

  console.log(productList);
  return (
    <AdminHeaderWrap>
      <AdminHeader />
      <h1>작품 관리</h1>
      <TableWrap>
        <Table>
          <tbody>
            <tr>
              <td>작품코드</td>
              <td>작품 이미지</td>
              <td>작품명</td>
              <td>작가</td>
              <td>작품정보</td>
              <td>금액</td>
              <td>상태</td>
              <td>관리</td>
            </tr>
          </tbody>
          {productList.products.map((el) => {
            return (
              <tbody key={uuidv4()}>
                <tr>
                  <td>{`A${el.artist.code}-${el.artCode}`}</td>
                  <td>
                    <img src={el.image} alt="작품이미지" width="200rem" />
                  </td>
                  <td>{el.title}</td>
                  <td>{`${el.artist.name}(${el.artist.aka})`}</td>
                  <td>{`${el.info.size}(${el.info.canvas}호)`}</td>
                  <td>{useComma(el.price)}원</td>
                  <td>{isInStock(el.inStock)}</td>
                  <td>
                    <div>
                      <button
                        type="button"
                        onClick={() => clickProductHandler(el)}
                      >
                        수정
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => deleteClickProduct(el)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </Table>
      </TableWrap>
      {/* Modal */}
      {isEdit && (
        <ModalBackDrop onClick={isEditHandler}>
          <AdminEditProduct NO={isEditHandler} el={clickProduct} />
        </ModalBackDrop>
      )}
      {isDelete && (
        <ModalBackDrop onClick={isDeleteHandler}>
          <YesNoModal
            NO={isDeleteHandler}
            YES={deleteProductHandler}
            MESSAGE="선택하신항목을 목록에서"
            MESSAGE2="삭제하시겠습니까?"
          />
        </ModalBackDrop>
      )}
    </AdminHeaderWrap>
  );
};
export default AdminProduct;
