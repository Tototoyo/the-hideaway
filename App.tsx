import React, { useState, useEffect, useMemo } from 'react';
import { StaffManagement } from './components/StaffManagement';
import { UserManagement } from './components/UserManagement';
import UtilitiesManagement from './components/UtilitiesManagement';
import RoomManagement from './components/RoomManagement';
import { ActivitiesManagement } from './components/activities/ActivitiesManagement';
import WalkInManagement from './components/WalkInManagement';
import { Login } from './components/Login';
import type { Staff, Shift, Task, UtilityRecord, Room, Absence, Activity, SpeedBoatTrip, Booking, Extra, SalaryAdvance, TaxiBoatOption, ExternalSale, PlatformPayment, WalkInGuest, AccommodationBooking, PaymentType, User } from './types';
import { Role } from './types';
import * as db from './lib/database';

type View = 'rooms' | 'staff' | 'utilities' | 'activities' | 'booking' | 'users';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  const [currentView, setCurrentView] = useState<View>('activities');
  const [currentUserRole, setCurrentUserRole] = useState<Role>(Role.Admin);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State Management
  const [users, setUsers] = useState<User[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [utilityRecords, setUtilityRecords] = useState<UtilityRecord[]>([]);
  const [utilityCategories, setUtilityCategories] = useState<string[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvance[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [speedBoatTrips, setSpeedBoatTrips] = useState<SpeedBoatTrip[]>([]);
  const [taxiBoatOptions, setTaxiBoatOptions] = useState<TaxiBoatOption[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [externalSales, setExternalSales] = useState<ExternalSale[]>([]);
  const [platformPayments, setPlatformPayments] = useState<PlatformPayment[]>([]);
  const [walkInGuests, setWalkInGuests] = useState<WalkInGuest[]>([]);
  const [accommodationBookings, setAccommodationBookings] = useState<AccommodationBooking[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);

  // Check if user is already logged in
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as Role | null;
    const savedUsername = localStorage.getItem('username');
    const savedUserId = localStorage.getItem('userId');
    
    if (savedRole && savedUsername && savedUserId) {
      setCurrentUserRole(savedRole);
      setCurrentUsername(savedUsername);
      setCurrentUserId(savedUserId);
      setIsAuthenticated(true);
    } else {
      // Load users even if not authenticated (needed for login)
      loadUsers();
      setLoading(false);
    }
  }, []);

  // Load users separately for login screen
  const loadUsers = async () => {
    try {
      const usersData = await db.fetchUsers();
      setUsers(usersData);
      
      // If no users exist, create default admin
      if (usersData.length === 0) {
        const defaultAdmin = await db.addUser({
          username: 'admin',
          password: 'admin123',
          role: Role.Admin,
          isActive: true,
        });
        setUsers([defaultAdmin]);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  // Load all data only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        usersData,
        staffData,
        shiftsData,
        tasksData,
        utilityRecordsData,
        utilityCategoriesData,
        roomsData,
        absencesData,
        salaryAdvancesData,
        activitiesData,
        speedBoatTripsData,
        taxiBoatOptionsData,
        extrasData,
        bookingsData,
        externalSalesData,
        platformPaymentsData,
        walkInGuestsData,
        accommodationBookingsData,
        paymentTypesData,
      ] = await Promise.all([
        db.fetchUsers(),
        db.fetchStaff(),
        db.fetchShifts(),
        db.fetchTasks(),
        db.fetchUtilityRecords(),
        db.fetchUtilityCategories(),
        db.fetchRooms(),
        db.fetchAbsences(),
        db.fetchSalaryAdvances(),
        db.fetchActivities(),
        db.fetchSpeedBoatTrips(),
        db.fetchTaxiBoatOptions(),
        db.fetchExtras(),
        db.fetchBookings(),
        db.fetchExternalSales(),
        db.fetchPlatformPayments(),
        db.fetchWalkInGuests(),
        db.fetchAccommodationBookings(),
        db.fetchPaymentTypes(),
      ]);

      setUsers(usersData);
      setStaff(staffData);
      setShifts(shiftsData);
      setTasks(tasksData);
      setUtilityRecords(utilityRecordsData);
      setUtilityCategories(utilityCategoriesData);
      setRooms(roomsData);
      setAbsences(absencesData);
      setSalaryAdvances(salaryAdvancesData);
      setActivities(activitiesData);
      setSpeedBoatTrips(speedBoatTripsData);
      setTaxiBoatOptions(taxiBoatOptionsData);
      setExtras(extrasData);
      setBookings(bookingsData);
      setExternalSales(externalSalesData);
      setPlatformPayments(platformPaymentsData);
      setWalkInGuests(walkInGuestsData);
      setAccommodationBookings(accommodationBookingsData);
      setPaymentTypes(paymentTypesData);

      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please refresh the page.');
      setLoading(false);
    }
  };

  // Handle Login
  const handleLogin = (role: Role, username: string, userId: string) => {
    setCurrentUserRole(role);
    setCurrentUsername(username);
    setCurrentUserId(userId);
    setIsAuthenticated(true);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setCurrentUsername('');
    setCurrentUserId('');
    setCurrentUserRole(Role.Staff);
  };

  // User Management Handlers
  const handleAddUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const newUser = await db.addUser(userData);
      setUsers(prev => [...prev, newUser]);
      alert(`User "${newUser.username}" created successfully!`);
    } catch (err) {
      console.error('Error adding user:', err);
      alert('Failed to add user. Please try again.');
    }
  };

  const handleUpdateUser = async (userData: User) => {
    try {
      const updatedUser = await db.updateUser(userData);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      alert(`User "${updatedUser.username}" updated successfully!`);
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    // Prevent deleting own account
    if (id === currentUserId) {
      alert('You cannot delete your own account!');
      return;
    }

    // Prevent deleting last admin
    const user = users.find(u => u.id === id);
    if (user?.role === Role.Admin) {
      const adminCount = users.filter(u => u.role === Role.Admin && u.isActive).length;
      if (adminCount <= 1) {
        alert('Cannot delete the last active admin user!');
        return;
      }
    }

    try {
      await db.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      alert('User deleted successfully!');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };

  // Booking Handler for Activity
  const handleBookActivity = async (activityId: string, staffId: string, numberOfPeople: number, discount: number, extras: Omit<Extra, 'id' | 'commission'>[], paymentMethod: string, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number, employeeCommission?: number) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) {
        console.error("Activity not found!");
        return;
    }

    const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
    const totalEmployeeCommission = (employeeCommission || 0) * numberOfPeople;
    
    let itemCost: number | undefined = undefined;
    if (activity.type === 'Internal') {
        const internalCost = (fuelCost || 0) + (captainCost || 0);
        if (internalCost > 0) itemCost = internalCost;
    } else {
        const externalCost = (activity.companyCost || 0) * numberOfPeople;
        if (externalCost > 0) itemCost = externalCost;
    }

    const newBooking: Omit<Booking, 'id'> = {
        itemId: activityId,
        itemType: 'activity',
        itemName: activity.name,
        staffId,
        bookingDate: bookingDate,
        customerPrice: activity.price * numberOfPeople,
        numberOfPeople,
        discount,
        extras,
        extrasTotal,
        paymentMethod,
        receiptImage,
        fuelCost,
        captainCost,
        itemCost: itemCost,
        employeeCommission: totalEmployeeCommission,
    };

    try {
      const savedBooking = await db.addBooking(newBooking);
      setBookings(prev => [...prev, savedBooking]);
      
      const staffMember = staff.find(s => s.id === staffId);
      const basePrice = activity.price * numberOfPeople;
      const finalPrice = basePrice + extrasTotal - (discount || 0);
      
      let costBreakdown = '';
      if (activity.type === 'Internal') {
          costBreakdown = `\nFuel Cost: ${fuelCost || 0} THB\nCaptain Cost: ${captainCost || 0} THB`;
      } else {
          costBreakdown = `\nCompany Cost: ${itemCost || 0} THB`;
      }

      alert(`Booking confirmed for ${activity.name} by ${staffMember?.name}!\n\nBooking Date: ${bookingDate}\n${numberOfPeople} person(s) x ${activity.price} THB = ${basePrice} THB\nExtras: ${extrasTotal} THB\nDiscount: ${discount || 0} THB\nFinal Price: ${finalPrice} THB\nPayment Method: ${paymentMethod}${costBreakdown}\nEmployee Commission: ${totalEmployeeCommission || 0} THB`);
    } catch (err) {
      console.error('Error saving booking:', err);
      alert('Failed to save booking. Please try again.');
    }
  };
  
  // Booking Handler for Speed Boat
  const handleBookSpeedBoatTrip = async (tripId: string, staffId: string, numberOfPeople: number, paymentMethod: string, bookingDate: string, receiptImage?: string, employeeCommission?: number) => {
    const trip = speedBoatTrips.find(t => t.id === tripId);
    if (!trip) {
        console.error("Speed boat trip not found!");
        return;
    }

    const totalEmployeeCommission = (employeeCommission || 0) * numberOfPeople;
    
    const newBooking: Omit<Booking, 'id'> = {
        itemId: tripId,
        itemType: 'speedboat',
        itemName: `${trip.route} (${trip.company})`,
        staffId,
        bookingDate: bookingDate,
        customerPrice: trip.price * numberOfPeople,
        numberOfPeople,
        paymentMethod,
        receiptImage,
        itemCost: trip.cost * numberOfPeople,
        employeeCommission: totalEmployeeCommission,
    };

    try {
      const savedBooking = await db.addBooking(newBooking);
      setBookings(prev => [...prev, savedBooking]);
      
      const staffMember = staff.find(s => s.id === staffId);
      const finalPrice = trip.price * numberOfPeople;
      alert(`Booking confirmed for ${trip.route} by ${staffMember?.name}!\n\nBooking Date: ${bookingDate}\n${numberOfPeople} person(s) x ${trip.price} THB = ${finalPrice} THB\nPayment Method: ${paymentMethod}\n\nEmployee Commission: ${totalEmployeeCommission || 0} THB`);
    } catch (err) {
      console.error('Error saving booking:', err);
      alert('Failed to save booking. Please try again.');
    }
  };

  // Booking Handler for Private Tour
  const handleBookPrivateTour = async (tourType: 'Half Day' | 'Full Day', price: number, numberOfPeople: number, staffId: string, paymentMethod: string, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number, employeeCommission?: number, hostelCommission?: number) => {
      const newBooking: Omit<Booking, 'id'> = {
          itemId: 'private_tour',
          itemType: 'private_tour',
          itemName: `Private Tour - ${tourType}`,
          staffId,
          bookingDate: bookingDate,
          customerPrice: price,
          numberOfPeople,
          paymentMethod,
          receiptImage,
          fuelCost,
          captainCost,
          itemCost: (fuelCost || 0) + (captainCost || 0),
          employeeCommission,
          hostelCommission,
      };

      try {
        const savedBooking = await db.addBooking(newBooking);
        setBookings(prev => [...prev, savedBooking]);
        
        const staffMember = staff.find(s => s.id === staffId);
        alert(`Private Tour booking confirmed by ${staffMember?.name}!\n\nBooking Date: ${bookingDate}\nType: ${tourType}\nFor: ${numberOfPeople} person(s)\nPrice: ${price} THB\nPayment Method: ${paymentMethod}\n\nFuel Cost: ${fuelCost || 0} THB\nCaptain Cost: ${captainCost || 0} THB\nHostel Commission: ${hostelCommission || 0} THB\nEmployee Commission: ${employeeCommission || 0} THB`);
      } catch (err) {
        console.error('Error saving booking:', err);
        alert('Failed to save booking. Please try again.');
      }
  };

  // Booking Handler for Standalone Extra
  const handleBookStandaloneExtra = async (extra: Extra, staffId: string, paymentMethod: string, bookingDate: string, receiptImage?: string, quantity: number = 1, employeeCommission?: number) => {
      const finalPrice = extra.price * quantity;
      
      let itemName = extra.name;
      if (extra.id === 'paddle_hour' && quantity > 1) {
          itemName = `${extra.name} (${quantity} hours)`;
      } else if (extra.id === 'paddle_day' && quantity > 1) {
          itemName = `${extra.name} (${quantity} days)`;
      } else if (quantity > 1) {
          itemName = `${extra.name} (x${quantity})`;
      }

      const totalEmployeeCommission = employeeCommission ? employeeCommission * quantity : undefined;

      const newBooking: Omit<Booking, 'id'> = {
          itemId: extra.id,
          itemType: 'extra',
          itemName: itemName,
          staffId,
          bookingDate: bookingDate,
          customerPrice: finalPrice,
          numberOfPeople: quantity,
          paymentMethod,
          receiptImage,
          employeeCommission: totalEmployeeCommission,
      };

      try {
        const savedBooking = await db.addBooking(newBooking);
        setBookings(prev => [...prev, savedBooking]);
        const staffMember = staff.find(s => s.id === staffId);
        
        let alertMessage = `Sold ${itemName} for ${finalPrice} THB by ${staffMember?.name} on ${bookingDate}.`;
        if (totalEmployeeCommission) {
            alertMessage += `\nEmployee Commission: ${totalEmployeeCommission} THB`;
        }
        alert(alertMessage);
      } catch (err) {
        console.error('Error saving booking:', err);
        alert('Failed to save booking. Please try again.');
      }
  };

  // Booking Handler for Taxi Boat
  const handleBookTaxiBoat = async (taxiOptionId: string, staffId: string, numberOfPeople: number, paymentMethod: string, bookingDate: string, receiptImage?: string, employeeCommission?: number) => {
      const taxiOption = taxiBoatOptions.find(t => t.id === taxiOptionId);
      if (!taxiOption) return;

      const totalEmployeeCommission = (employeeCommission || 0) * numberOfPeople;

      const newBooking: Omit<Booking, 'id'> = {
          itemId: taxiOption.id,
          itemType: 'taxi_boat',
          itemName: `Taxi Boat - ${taxiOption.name}`,
          staffId,
          bookingDate: bookingDate,
          customerPrice: taxiOption.price * numberOfPeople,
          numberOfPeople,
          paymentMethod,
          receiptImage,
          employeeCommission: totalEmployeeCommission,
      };

      try {
        const savedBooking = await db.addBooking(newBooking);
        setBookings(prev => [...prev, savedBooking]);
        const staffMember = staff.find(s => s.id === staffId);
        alert(`Taxi Boat (${taxiOption.name}) booked for ${numberOfPeople} person(s) at ${taxiOption.price * numberOfPeople} THB by ${staffMember?.name} on ${bookingDate}.\nEmployee Commission: ${totalEmployeeCommission || 0} THB`);
      } catch (err) {
        console.error('Error saving booking:', err);
        alert('Failed to save booking. Please try again.');
      }
  };

  // CRUD Handlers for Speed Boat Trips
  const handleAddSpeedBoatTrip = async (newTrip: Omit<SpeedBoatTrip, 'id'>) => {
    try {
      const savedTrip = await db.addSpeedBoatTrip(newTrip);
      setSpeedBoatTrips([...speedBoatTrips, savedTrip]);
    } catch (err) {
      console.error('Error adding speed boat trip:', err);
      alert('Failed to add speed boat trip. Please try again.');
    }
  };

  const handleUpdateSpeedBoatTrip = async (updatedTrip: SpeedBoatTrip) => {
    try {
      await db.updateSpeedBoatTrip(updatedTrip);
      setSpeedBoatTrips(speedBoatTrips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    } catch (err) {
      console.error('Error updating speed boat trip:', err);
      alert('Failed to update speed boat trip. Please try again.');
    }
  };

  const handleDeleteSpeedBoatTrip = async (tripId: string) => {
    try {
      await db.deleteSpeedBoatTrip(tripId);
      setSpeedBoatTrips(speedBoatTrips.filter(t => t.id !== tripId));
    } catch (err) {
      console.error('Error deleting speed boat trip:', err);
      alert('Failed to delete speed boat trip. Please try again.');
    }
  };

  // CRUD Handlers for Activities
  const handleAddActivity = async (newActivity: Omit<Activity, 'id'>) => {
    try {
      const savedActivity = await db.addActivity(newActivity);
      setActivities([...activities, savedActivity]);
    } catch (err) {
      console.error('Error adding activity:', err);
      alert('Failed to add activity. Please try again.');
    }
  };

  const handleUpdateActivity = async (updatedActivity: Activity) => {
    try {
      await db.updateActivity(updatedActivity);
      setActivities(activities.map(a => a.id === updatedActivity.id ? updatedActivity : a));
    } catch (err) {
      console.error('Error updating activity:', err);
      alert('Failed to update activity. Please try again.');
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await db.deleteActivity(activityId);
      setActivities(activities.filter(a => a.id !== activityId));
    } catch (err) {
      console.error('Error deleting activity:', err);
      alert('Failed to delete activity. Please try again.');
    }
  };

  // CRUD Handlers for Taxi Boat Options
  const handleAddTaxiBoatOption = async (newOption: Omit<TaxiBoatOption, 'id'>) => {
    try {
      const savedOption = await db.addTaxiBoatOption(newOption);
      setTaxiBoatOptions([...taxiBoatOptions, savedOption]);
    } catch (err) {
      console.error('Error adding taxi boat option:', err);
      alert('Failed to add taxi boat option. Please try again.');
    }
  };

  const handleUpdateTaxiBoatOption = async (updatedOption: TaxiBoatOption) => {
    try {
      await db.updateTaxiBoatOption(updatedOption);
      setTaxiBoatOptions(taxiBoatOptions.map(o => o.id === updatedOption.id ? updatedOption : o));
    } catch (err) {
      console.error('Error updating taxi boat option:', err);
      alert('Failed to update taxi boat option. Please try again.');
    }
  };

  const handleDeleteTaxiBoatOption = async (optionId: string) => {
    try {
      await db.deleteTaxiBoatOption(optionId);
      setTaxiBoatOptions(taxiBoatOptions.filter(o => o.id !== optionId));
    } catch (err) {
      console.error('Error deleting taxi boat option:', err);
      alert('Failed to delete taxi boat option. Please try again.');
    }
  };
  
  // CRUD Handlers for Extras
  const handleAddExtra = async (newExtra: Omit<Extra, 'id'>) => {
    try {
      const savedExtra = await db.addExtra(newExtra);
      setExtras([...extras, savedExtra]);
    } catch (err) {
      console.error('Error adding extra:', err);
      alert('Failed to add extra. Please try again.');
    }
  };

  const handleUpdateExtra = async (updatedExtra: Extra) => {
    try {
      await db.updateExtra(updatedExtra);
      setExtras(extras.map(e => e.id === updatedExtra.id ? updatedExtra : e));
    } catch (err) {
      console.error('Error updating extra:', err);
      alert('Failed to update extra. Please try again.');
    }
  };

  const handleDeleteExtra = async (extraId: string) => {
    try {
      await db.deleteExtra(extraId);
      setExtras(extras.filter(e => e.id !== extraId));
    } catch (err) {
      console.error('Error deleting extra:', err);
      alert('Failed to delete extra. Please try again.');
    }
  };
  
  // CRUD Handlers for Payment Types
  const handleAddPaymentType = async (newType: Omit<PaymentType, 'id'>) => {
    try {
      const savedType = await db.addPaymentType(newType);
      setPaymentTypes([...paymentTypes, savedType]);
    } catch (err) {
      console.error('Error adding payment type:', err);
      alert('Failed to add payment type. Please try again.');
    }
  };

  const handleUpdatePaymentType = async (updatedType: PaymentType) => {
    try {
      await db.updatePaymentType(updatedType);
      setPaymentTypes(paymentTypes.map(p => p.id === updatedType.id ? updatedType : p));
    } catch (err) {
      console.error('Error updating payment type:', err);
      alert('Failed to update payment type. Please try again.');
    }
  };

  const handleDeletePaymentType = async (typeId: string) => {
    try {
      await db.deletePaymentType(typeId);
      setPaymentTypes(paymentTypes.filter(p => p.id !== typeId));
    } catch (err) {
      console.error('Error deleting payment type:', err);
      alert('Failed to delete payment type. Please try again.');
    }
  };

  const handleUpdateBooking = async (updatedBooking: Booking) => {
      try {
        await db.updateBooking(updatedBooking);
        setBookings(bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
      } catch (err) {
        console.error('Error updating booking:', err);
        alert('Failed to update booking. Please try again.');
      }
  };

  const handleDeleteBooking = async (bookingId: string) => {
      try {
        await db.deleteBooking(bookingId);
        setBookings(bookings.filter(b => b.id !== bookingId));
      } catch (err) {
        console.error('Error deleting booking:', err);
        alert('Failed to delete booking. Please try again.');
      }
  };

  // CRUD Handlers for Staff
  const handleAddStaff = async (newStaff: Omit<Staff, 'id'>) => {
    try {
      const savedStaff = await db.addStaff(newStaff);
      setStaff([...staff, savedStaff]);
    } catch (err) {
      console.error('Error adding staff:', err);
      alert('Failed to add staff. Please try again.');
    }
  };

  const handleUpdateStaff = async (updatedStaff: Staff) => {
    try {
      await db.updateStaff(updatedStaff);
      setStaff(staff.map(s => s.id === updatedStaff.id ? updatedStaff : s));
    } catch (err) {
      console.error('Error updating staff:', err);
      alert('Failed to update staff. Please try again.');
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      await db.deleteStaff(staffId);
      setStaff(staff.filter(s => s.id !== staffId));
    } catch (err) {
      console.error('Error deleting staff:', err);
      alert('Failed to delete staff. Please try again.');
    }
  };

  // CRUD Handlers for Tasks
  const handleAddTask = async (newTask: Omit<Task, 'id'>) => {
    try {
      const savedTask = await db.addTask(newTask);
      setTasks([...tasks, savedTask]);
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Failed to add task. Please try again.');
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await db.updateTask(updatedTask);
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await db.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  // CRUD Handlers for Utilities
  const handleAddUtilityRecord = async (newRecord: Omit<UtilityRecord, 'id'>) => {
    try {
      const savedRecord = await db.addUtilityRecord(newRecord);
      setUtilityRecords([...utilityRecords, savedRecord]);
    } catch (err) {
      console.error('Error adding utility record:', err);
      alert('Failed to add utility record. Please try again.');
    }
  };

  const handleUpdateUtilityRecord = async (updatedRecord: UtilityRecord) => {
    try {
      await db.updateUtilityRecord(updatedRecord);
      setUtilityRecords(utilityRecords.map(u => u.id === updatedRecord.id ? updatedRecord : u));
    } catch (err) {
      console.error('Error updating utility record:', err);
      alert('Failed to update utility record. Please try again.');
    }
  };

  const handleDeleteUtilityRecord = async (recordId: string) => {
    try {
      await db.deleteUtilityRecord(recordId);
      setUtilityRecords(utilityRecords.filter(u => u.id !== recordId));
    } catch (err) {
      console.error('Error deleting utility record:', err);
      alert('Failed to delete utility record. Please try again.');
    }
  };
  
  // CRUD Handlers for Utility Categories
  const handleAddUtilityCategory = async (newCategory: string) => {
    if (newCategory && !utilityCategories.map(c => c.toLowerCase()).includes(newCategory.toLowerCase())) {
      try {
        await db.addUtilityCategory(newCategory);
        setUtilityCategories([...utilityCategories, newCategory].sort());
      } catch (err) {
        console.error('Error adding utility category:', err);
        alert('Failed to add utility category. Please try again.');
      }
    }
  };

  const handleDeleteUtilityCategory = async (categoryToDelete: string) => {
    try {
      await db.deleteUtilityCategory(categoryToDelete);
      setUtilityCategories(utilityCategories.filter(c => c !== categoryToDelete));
    } catch (err) {
      console.error('Error deleting utility category:', err);
      alert('Failed to delete utility category. Please try again.');
    }
  };

  // CRUD Handlers for Rooms
  const handleAddRoom = async (newRoom: Omit<Room, 'id'>) => {
    try {
      const savedRoom = await db.addRoom(newRoom);
      setRooms([...rooms, savedRoom]);
    } catch (err) {
      console.error('Error adding room:', err);
      alert('Failed to add room. Please try again.');
    }
  };

  const handleUpdateRoom = async (updatedRoom: Room) => {
    try {
      await db.updateRoom(updatedRoom);
      setRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    } catch (err) {
      console.error('Error updating room:', err);
      alert('Failed to update room. Please try again.');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await db.deleteRoom(roomId);
      setRooms(rooms.filter(r => r.id !== roomId));
    } catch (err) {
      console.error('Error deleting room:', err);
      alert('Failed to delete room. Please try again.');
    }
  };
  
  // CRUD Handlers for Absences
  const handleAddAbsence = async (newAbsence: Omit<Absence, 'id'>) => {
    try {
      const savedAbsence = await db.addAbsence(newAbsence);
      setAbsences([...absences, savedAbsence]);
    } catch (err) {
      console.error('Error adding absence:', err);
      alert('Failed to add absence. Please try again.');
    }
  };

  const handleUpdateAbsence = async (updatedAbsence: Absence) => {
    try {
      await db.updateAbsence(updatedAbsence);
      setAbsences(absences.map(a => a.id === updatedAbsence.id ? updatedAbsence : a));
    } catch (err) {
      console.error('Error updating absence:', err);
      alert('Failed to update absence. Please try again.');
    }
  };

  const handleDeleteAbsence = async (absenceId: string) => {
    try {
      await db.deleteAbsence(absenceId);
      setAbsences(absences.filter(a => a.id !== absenceId));
    } catch (err) {
      console.error('Error deleting absence:', err);
      alert('Failed to delete absence. Please try again.');
    }
  };

  // CRUD Handlers for Salary Advances
  const handleAddSalaryAdvance = async (newAdvance: Omit<SalaryAdvance, 'id'>) => {
    try {
      const savedAdvance = await db.addSalaryAdvance(newAdvance);
      setSalaryAdvances([...salaryAdvances, savedAdvance]);
    } catch (err) {
      console.error('Error adding salary advance:', err);
      alert('Failed to add salary advance. Please try again.');
    }
  };

  const handleUpdateSalaryAdvance = async (updatedAdvance: SalaryAdvance) => {
    try {
      await db.updateSalaryAdvance(updatedAdvance);
      setSalaryAdvances(salaryAdvances.map(a => a.id === updatedAdvance.id ? updatedAdvance : a));
    } catch (err) {
      console.error('Error updating salary advance:', err);
      alert('Failed to update salary advance. Please try again.');
    }
  };

  const handleDeleteSalaryAdvance = async (advanceId: string) => {
    try {
      await db.deleteSalaryAdvance(advanceId);
      setSalaryAdvances(salaryAdvances.filter(a => a.id !== advanceId));
    } catch (err) {
      console.error('Error deleting salary advance:', err);
      alert('Failed to delete salary advance. Please try again.');
    }
  };
  
  // CRUD Handlers for External Sales
  const handleAddExternalSale = async (newSale: Omit<ExternalSale, 'id'>) => {
    try {
      const savedSale = await db.addExternalSale(newSale);
      setExternalSales([...externalSales, savedSale]);
    } catch (err) {
      console.error('Error adding external sale:', err);
      alert('Failed to add external sale. Please try again.');
    }
  };

  const handleUpdateExternalSale = async (updatedSale: ExternalSale) => {
    try {
      await db.updateExternalSale(updatedSale);
      setExternalSales(externalSales.map(s => s.id === updatedSale.id ? updatedSale : s));
    } catch (err) {
      console.error('Error updating external sale:', err);
      alert('Failed to update external sale. Please try again.');
    }
  };

  const handleDeleteExternalSale = async (saleId: string) => {
    try {
      await db.deleteExternalSale(saleId);
      setExternalSales(externalSales.filter(s => s.id !== saleId));
    } catch (err) {
      console.error('Error deleting external sale:', err);
      alert('Failed to delete external sale. Please try again.');
    }
  };
  
  // CRUD Handlers for Platform Payments
  const handleAddPlatformPayment = async (newPayment: Omit<PlatformPayment, 'id'>) => {
    try {
      const savedPayment = await db.addPlatformPayment(newPayment);
      setPlatformPayments([...platformPayments, savedPayment]);
    } catch (err) {
      console.error('Error adding platform payment:', err);
      alert('Failed to add platform payment. Please try again.');
    }
  };

  const handleUpdatePlatformPayment = async (updatedPayment: PlatformPayment) => {
    try {
      await db.updatePlatformPayment(updatedPayment);
      setPlatformPayments(platformPayments.map(p => p.id === updatedPayment.id ? updatedPayment : p));
    } catch (err) {
      console.error('Error updating platform payment:', err);
      alert('Failed to update platform payment. Please try again.');
    }
  };

  const handleDeletePlatformPayment = async (paymentId: string) => {
    try {
      await db.deletePlatformPayment(paymentId);
      setPlatformPayments(platformPayments.filter(p => p.id !== paymentId));
    } catch (err) {
      console.error('Error deleting platform payment:', err);
      alert('Failed to delete platform payment. Please try again.');
    }
  };

  // CRUD Handlers for Walk-in Guests
  const handleAddWalkInGuest = async (newGuest: Omit<WalkInGuest, 'id'>) => {
    try {
      const savedGuest = await db.addWalkInGuest(newGuest);
      setWalkInGuests([...walkInGuests, savedGuest]);
    } catch (err) {
      console.error('Error adding walk-in guest:', err);
      alert('Failed to add walk-in guest. Please try again.');
    }
  };

  const handleUpdateWalkInGuest = async (updatedGuest: WalkInGuest) => {
    try {
      await db.updateWalkInGuest(updatedGuest);
      setWalkInGuests(walkInGuests.map(g => g.id === updatedGuest.id ? updatedGuest : g));
    } catch (err) {
      console.error('Error updating walk-in guest:', err);
      alert('Failed to update walk-in guest. Please try again.');
    }
  };

  const handleDeleteWalkInGuest = async (guestId: string) => {
    try {
      await db.deleteWalkInGuest(guestId);
      setWalkInGuests(walkInGuests.filter(g => g.id !== guestId));
    } catch (err) {
      console.error('Error deleting walk-in guest:', err);
      alert('Failed to delete walk-in guest. Please try again.');
    }
  };
  
  // CRUD Handlers for Accommodation Bookings
  const handleAddAccommodationBooking = async (newBooking: Omit<AccommodationBooking, 'id'>) => {
    try {
      const savedBooking = await db.addAccommodationBooking(newBooking);
      setAccommodationBookings([...accommodationBookings, savedBooking]);
    } catch (err) {
      console.error('Error adding accommodation booking:', err);
      alert('Failed to add accommodation booking. Please try again.');
    }
  };

  const handleUpdateAccommodationBooking = async (updatedBooking: AccommodationBooking) => {
    try {
      await db.updateAccommodationBooking(updatedBooking);
      setAccommodationBookings(accommodationBookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    } catch (err) {
      console.error('Error updating accommodation booking:', err);
      alert('Failed to update accommodation booking. Please try again.');
    }
  };

  const handleDeleteAccommodationBooking = async (bookingId: string) => {
    try {
      await db.deleteAccommodationBooking(bookingId);
      setAccommodationBookings(accommodationBookings.filter(b => b.id !== bookingId));
    } catch (err) {
      console.error('Error deleting accommodation booking:', err);
      alert('Failed to delete accommodation booking. Please try again.');
    }
  };

  // CRUD

  const TABS: { id: View; label: string }[] = [
    { id: 'rooms', label: 'Rooms & Beds' },
    { id: 'booking', label: 'Booking' },
    { id: 'staff', label: 'Staff & HR' },
    { id: 'users', label: 'User Management' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'activities', label: 'Activities' },
  ];
  
  const visibleTabs = useMemo(() => {
    if (currentUserRole === Role.Admin) {
      return TABS;
    }
    return TABS.filter(tab => ['rooms', 'booking', 'activities', 'utilities'].includes(tab.id));
  }, [currentUserRole]);

  useEffect(() => {
      const isCurrentViewVisible = visibleTabs.some(tab => tab.id === currentView);
      if (!isCurrentViewVisible) {
          setCurrentView(visibleTabs[0].id);
      }
  }, [currentUserRole, currentView, visibleTabs]);

  const renderContent = () => {
    switch (currentView) {
      case 'rooms':
        return <RoomManagement rooms={rooms} onAddRoom={handleAddRoom} onUpdateRoom={handleUpdateRoom} onDeleteRoom={handleDeleteRoom} currentUserRole={currentUserRole} />;
      case 'booking':
        return <WalkInManagement 
                    rooms={rooms}
                    walkInGuests={walkInGuests}
                    accommodationBookings={accommodationBookings}
                    paymentTypes={paymentTypes}
                    onAddWalkInGuest={handleAddWalkInGuest}
                    onUpdateWalkInGuest={handleUpdateWalkInGuest}
                    onDeleteWalkInGuest={handleDeleteWalkInGuest}
                    onAddAccommodationBooking={handleAddAccommodationBooking}
                    onUpdateAccommodationBooking={handleUpdateAccommodationBooking}
                    onDeleteAccommodationBooking={handleDeleteAccommodationBooking}
                />;
      case 'staff':
        return currentUserRole === Role.Admin ? <StaffManagement staff={staff} shifts={shifts} tasks={tasks} absences={absences} salaryAdvances={salaryAdvances} bookings={bookings} onAddStaff={handleAddStaff} onUpdateStaff={handleUpdateStaff} onDeleteStaff={handleDeleteStaff} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onAddAbsence={handleAddAbsence} onUpdateAbsence={handleUpdateAbsence} onDeleteAbsence={handleDeleteAbsence} onAddSalaryAdvance={handleAddSalaryAdvance} onUpdateSalaryAdvance={handleUpdateSalaryAdvance} onDeleteSalaryAdvance={handleDeleteSalaryAdvance} /> : null;
      case 'users':
        return currentUserRole === Role.Admin ? <UserManagement users={users} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} /> : null;
      case 'utilities':
          return <UtilitiesManagement 
                    records={utilityRecords} 
                    onAddRecord={handleAddUtilityRecord} 
                    onUpdateRecord={handleUpdateUtilityRecord} 
                    onDeleteRecord={handleDeleteUtilityRecord}
                    utilityCategories={utilityCategories}
                    onAddCategory={handleAddUtilityCategory}
                    onDeleteCategory={handleDeleteUtilityCategory}
                    currentUserRole={currentUserRole}
                 />;
      case 'activities':
          return <ActivitiesManagement 
                    activities={activities} 
                    speedBoatTrips={speedBoatTrips} 
                    taxiBoatOptions={taxiBoatOptions}
                    extras={extras}
                    staff={staff} 
                    bookings={bookings} 
                    externalSales={externalSales}
                    platformPayments={platformPayments}
                    utilityRecords={utilityRecords}
                    salaryAdvances={salaryAdvances}
                    absences={absences}
                    walkInGuests={walkInGuests}
                    accommodationBookings={accommodationBookings}
                    rooms={rooms}
                    paymentTypes={paymentTypes}
                    onBookActivity={handleBookActivity} 
                    onBookSpeedBoat={handleBookSpeedBoatTrip} 
                    onBookPrivateTour={handleBookPrivateTour}
                    onBookStandaloneExtra={handleBookStandaloneExtra}
                    onBookTaxiBoat={handleBookTaxiBoat}
                    onUpdateBooking={handleUpdateBooking}
                    onDeleteBooking={handleDeleteBooking}
                    onAddExternalSale={handleAddExternalSale}
                    onUpdateExternalSale={handleUpdateExternalSale}
                    onDeleteExternalSale={handleDeleteExternalSale}
                    onAddPlatformPayment={handleAddPlatformPayment}
                    onUpdatePlatformPayment={handleUpdatePlatformPayment}
                    onDeletePlatformPayment={handleDeletePlatformPayment}
                    onAddSpeedBoatTrip={handleAddSpeedBoatTrip}
                    onUpdateSpeedBoatTrip={handleUpdateSpeedBoatTrip}
                    onDeleteSpeedBoatTrip={handleDeleteSpeedBoatTrip}
                    onAddActivity={handleAddActivity}
                    onUpdateActivity={handleUpdateActivity}
                    onDeleteActivity={handleDeleteActivity}
                    onAddTaxiBoatOption={handleAddTaxiBoatOption}
                    onUpdateTaxiBoatOption={handleUpdateTaxiBoatOption}
                    onDeleteTaxiBoatOption={handleDeleteTaxiBoatOption}
                    onAddExtra={handleAddExtra}
                    onUpdateExtra={handleUpdateExtra}
                    onDeleteExtra={handleDeleteExtra}
                    onAddPaymentType={handleAddPaymentType}
                    onUpdatePaymentType={handleUpdatePaymentType}
                    onDeletePaymentType={handleDeletePaymentType}
                    currentUserRole={currentUserRole}
                 />;
      default:
        return null;
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
            <p className="font-semibold">Error Loading Data</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <button 
            onClick={loadAllData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                 <h1 className="text-xl font-bold text-slate-800">Facility Management Dashboard</h1>
                 <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        <div className="text-sm text-right">
                            <div className="text-slate-500">Logged in as</div>
                            <div className="font-semibold text-slate-800">{currentUsername}</div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {currentUserRole}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                    <div id="google_translate_element"></div>
                 </div>
            </div>
            <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto -mb-px" aria-label="Tabs">
                {visibleTabs.map(tab => (
                    <button key={tab.id} onClick={() => setCurrentView(tab.id)}
                        className={`${
                            currentView === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
      </header>
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
