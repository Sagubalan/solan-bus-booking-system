import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import BusList from './pages/BusList'
import SeatSelection from './pages/SeatSelection'
import PassengerDetails from './pages/PassengerDetails'
import BookingConfirmation from './pages/BookingConfirmation'
import MyBookings from './pages/MyBookings'
import Payment from './pages/Payment'

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Inter, sans-serif',
            borderRadius: '8px',
            border: '1px solid rgba(201,168,76,0.2)',
          },
          success: { iconTheme: { primary: '#c9a84c', secondary: '#fff' } },
        }}
      />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                     element={<Home />} />
          <Route path="/buses"                element={<BusList />} />
          <Route path="/seats"                element={<SeatSelection />} />
          <Route path="/passenger"            element={<PassengerDetails />} />
          <Route path="/payment"              element={<Payment />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/my-bookings"          element={<MyBookings />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
