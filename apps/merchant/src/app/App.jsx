import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../widgets/Layout/ui/DashboardLayout';
import Home from '../pages/Home/Home';
import Orders from '../pages/Orders/Orders';
import OrderDetails from '../pages/OrderDetails/OrderDetails';
import CreateOrder from '../pages/CreateOrder/CreateOrder';
import Products from '../pages/Products/Products';
import AddProduct from '../pages/AddProduct/AddProduct';
import CreateCategory from '../pages/CreateCategory/CreateCategory';
import Inventory from '../pages/Inventory/Inventory';
import Customers from '../pages/Customers/Customers';
import CustomerProfile from '../pages/CustomerProfile/CustomerProfile';
import Analytics from '../pages/Analytics/Analytics';
import Settings from '../pages/Settings/Settings';
import OnlineStore from '../pages/OnlineStore/OnlineStore';
import PageManager from '../pages/PageManager/PageManager';
export default function App() {
    return (<BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />}/>
          <Route path="orders" element={<Orders />}/>
          <Route path="orders/create" element={<CreateOrder />}/>
          <Route path="orders/:id" element={<OrderDetails />}/>
          <Route path="products" element={<Products />}/>
          <Route path="products/add" element={<AddProduct />}/>
          <Route path="products/categories/create" element={<CreateCategory />}/>
          <Route path="products/inventory" element={<Inventory />}/>
          <Route path="customers" element={<Customers />}/>
          <Route path="customers/:id" element={<CustomerProfile />}/>
          <Route path="analytics" element={<Analytics />}/>
          <Route path="settings" element={<Settings />}/>
          <Route path="online-store" element={<Navigate to="/admin/themes" replace/>}/>
          <Route path="admin/themes" element={<OnlineStore />}/>
          <Route path="admin/pages" element={<PageManager />}/>
        </Route>
      </Routes>
    </BrowserRouter>);
}
