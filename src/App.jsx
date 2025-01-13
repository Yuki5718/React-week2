import { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  //登入表單狀態
  const [formData, setFormData] = useState({
    "username": "",
    "password": ""
  });
  //取得登入表單內容
  const handleInputAccount = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    })
  };

  //授權狀態，預設false
  const [isAuth, setIsAuth] = useState(false);
  //產品資料狀態
  const [products, setProducts] = useState([]);
  //產品詳細內容狀態
  const [tempProduct, setTempProduct] = useState(null);
  //取得後台產品資料
  const getAuthAndProducts = () => {
    axios.get(`${API_BASE}/api/${API_PATH}/admin/products`)
      .then((res) => {
        setProducts(res.data.products)
        //授權狀態，寫入true
        setIsAuth(true);
      })
      .catch((err) => console.error(err))
  }

  //發送登入請求
  const submitLogin = (e) => {
    e.preventDefault();

    axios.post(`${API_BASE}/admin/signin`, formData)
      .then((res) => {
        //解構 取得token , expired
        const { token, expired } = res.data;
        //寫入cookie
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;

        // 取得產品資料、授權
        getAuthAndProducts();
      })
      .catch((err) => console.error(err))
  };
  //從cookie取token
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
    "$1",
  );
  //將token放入axios.headers
  axios.defaults.headers.common['Authorization'] = token;
  //確認是否登入
  const checkIsLogined = () => {
    axios.post(`${API_BASE}/api/user/check`)
      .then((res) => { alert("您已經登入") })
      .catch((err) => console.error(err))
  }


  return (
    <>{isAuth ? (
      <div className="container mt-5 mb-3">
        <div className="row">
          <div className="col">
            <h2 className="fw-bolder">產品列表</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">查看細節</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                    <td><button type="button" className="btn btn-primary" onClick={() => setTempProduct(product)}>查看細節</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="button-group">
              <button type="button" className="btn btn-success me-2" onClick={checkIsLogined}>確認是否登入</button>
              <button type="button" className="btn btn-warning me-2" onClick={getAuthAndProducts}>取得資料</button>
              <button type="button" className="btn btn-danger" onClick={() => setTempProduct(null)}>重置細節</button>
            </div>
          </div>
          <div className="col">
            <h2 className="fw-bolder">單一產品細節</h2>
            {tempProduct ? (
              <div className="card">
                <img src={tempProduct.imageUrl} className="card-img-top" alt={tempProduct.title} />
                <div className="card-body">
                  <h5 className="card-title fw-bolder d-flex">{tempProduct.title}<span className="badge bg-primary ms-1">{tempProduct.category}</span></h5>
                  <p className="card-text fw-bolder">商品描述：<br /><span className="fw-normal">{tempProduct.content}</span></p>
                  <p className="card-text fw-bolder">商品內容：<br /><span className="fw-normal">{tempProduct.description}</span></p>
                  <p className="card-text fw-bolder">價格：<br />
                    <del><small className="fw-normal">${tempProduct.origin_price}</small></del>
                    <big>${tempProduct.price}</big><small>/{tempProduct.unit}</small>
                  </p>
                  <h5 className="card-title fw-bolder">更多圖片</h5>
                  {tempProduct.imagesUrl.map((url, index) => (
                    <img src={url} key={index} className="images rounded-3 me-3" alt="更多圖片" />
                  ))}
                </div>
              </div>
            ) : (
              <p>請選擇一個產品</p>
            )}

          </div>
        </div>
      </div>
    ) : (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-4">
            <h1 className="text-center mb-3">請先登入</h1>
            <form onSubmit={submitLogin} className="d-flex flex-column">
              <div className="mb-3">
                <label htmlFor="Email" className="form-label">Email address</label>
                <input name="username" type="email" className="form-control" id="Email" placeholder="Email address" onChange={handleInputAccount} />
              </div>
              <div className="mb-3">
                <label htmlFor="Password" className="form-label">Password</label>
                <input name="password" type="password" className="form-control" id="Password" placeholder="Password" onChange={handleInputAccount} />
              </div>
              <button className="btn btn-primary">登入</button>
            </form>
          </div>
        </div>
      </div>)}</>
  )
}

export default App
