import AdminApp from './admin/AdminApp'
import About from './components/About'
import AuctionItem from './components/AuctionItem'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoutes'
import Signup from './components/Signup'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuctionList from './pages/Auctions'
import BidForm from './pages/BidForm'
import CreateAuctionItem from './pages/CreateAuctionItem'
import EditAuctionItem from './pages/EditAuctionItem'
import FullRegistration from './pages/FullRegistration'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/users/Profile'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Unauthorized from './components/Unauthorized'
import Logout from './pages/Logout'
import Auctions from './admin/pages/Auctions'
import { ToastContainer } from 'react-toastify'
import Users from './admin/pages/Users'
import Notification from './admin/pages/Notification'
import UserDetail from './admin/components/UserDetail'
import Footer from './pages/Footer'
import AuctionDetail from './admin/components/AuctionDetail'
import NotFoundPage from './components/NotFoundPage'
import UserAuction from './pages/users/UserAuction'
import Bids from './pages/users/Bids'
import Victory from './pages/users/Victory'
import ComplaintForm from './pages/ComplaintForm'
import Compliant from './admin/pages/Compliant'
import UserNotification from './pages/users/UserNotification'
import Images from './components/Images'
import ProfileEdit from './pages/users/EditProfile'
import BidCpo from './pages/BidCpo'
import Payment from './components/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import AddBalance from './components/AddBalance'


function App() {
	const { user } = useAuth()
	return (
		<>
			
			{/*  */}
			{/* ${roles[0] === 'Admin' ? 'flex' : ''} */}
			<div className={`min-h-screen mx-auto bg-cyan-50`}>
				{user?.role === 'User' ? <ComplaintForm /> : <></>}
				<NavBar />

				<Routes>

					{/* PUBLIC ROUTES */}
						<Route path="/" element={<Home />} />
						<Route path="/auctions" element={<AuctionList />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/login" element={<Login />} />
						<Route path="/logout" element={<Logout />} />
						<Route path="/about" element={<About />} />
						<Route path="/unauthorized" element={<Unauthorized />} />
						<Route path="*" element={<NotFoundPage />} />

						{/* USER ROUTES */}
						<Route element={<ProtectedRoute allowedRole={['User']} />}>
							<Route path="/profile" element={<Profile />} />
							<Route path="/profileEdit" element={<ProfileEdit />} />
							<Route path="/userAuction" element={<UserAuction />} />
							<Route path="/bids" element={<Bids />} />
							<Route path="/victory" element= {<Victory/>} />
							<Route path="/auction/:id" element={<AuctionItem />} />
							<Route path="/bidCpo/:id" element={<BidCpo />} />
							<Route path="/auction/create" element={<CreateAuctionItem />} />
							<Route path="/auction/edit/:id" element={<EditAuctionItem />} />
							<Route path="/auction/bid/:id" element={<BidForm />} />
							<Route path="/fullRegistration" element={<FullRegistration />} />
							<Route path='/userNotification' element={<UserNotification />} />
							<Route path='/images' element={<Images />} />
							<Route path='/payment/:id' element={<Payment/>} />
							<Route path='/paymentsuccess/:tx_ref' element={<PaymentSuccess/>} />
							<Route path='/add-balance' element={<AddBalance/>} />
						</Route>
 
						{/* ADMIN ROUTES */}
						<Route path='/admin' element={<ProtectedRoute allowedRole={['Admin']} />} >
							<Route index element={<AdminApp />} />
							<Route path='users' element={<Users />} />
							<Route path='auction' element={<Auctions />} />
							<Route path='notification' element={<Notification />} />
							<Route path='userDetail/:id' element={<UserDetail />} />
							<Route path='auctionDetail/:id' element={<AuctionDetail />} />
							<Route path="complaints" element={<Compliant />} />
						</Route>
						
						
				</Routes>
				{user?.role === 'Admin' ?<></>:<Footer/>}
				<ToastContainer/>
			</div>
		</>
	)
}

export default App
