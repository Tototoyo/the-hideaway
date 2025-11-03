import { supabase } from './supabaseClient';
import type { 
  Staff, Room, Bed, Task, Shift, UtilityRecord, Absence, SalaryAdvance,
  Activity, SpeedBoatTrip, TaxiBoatOption, Extra, Booking, 
  ExternalSale, PlatformPayment, WalkInGuest, AccommodationBooking, PaymentType, User
} from '../types';

// Helper to convert snake_case to camelCase
const toCamelCase = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

// Helper to convert camelCase to snake_case
const toSnakeCase = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }
  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

// ======================
// STAFF
// ======================
export const fetchStaff = async (): Promise<Staff[]> => {
  const { data, error } = await supabase.from('staff').select('*').order('name');
  if (error) throw error;
  return toCamelCase(data) as Staff[];
};

export const addStaff = async (staff: Omit<Staff, 'id'>): Promise<Staff> => {
  const { data, error } = await supabase.from('staff').insert([toSnakeCase(staff)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as Staff;
};

export const updateStaff = async (staff: Staff): Promise<Staff> => {
  const { data, error } = await supabase.from('staff').update(toSnakeCase(staff)).eq('id', staff.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as Staff;
};

export const deleteStaff = async (id: string): Promise<void> => {
  const { error } = await supabase.from('staff').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// SHIFTS
// ======================
export const fetchShifts = async (): Promise<Shift[]> => {
  const { data, error } = await supabase.from('shifts').select('*').order('date', { ascending: false });
  if (error) throw error;
  return toCamelCase(data) as Shift[];
};

// ======================
// TASKS
// ======================
export const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase.from('tasks').select('*').order('due_date');
  if (error) throw error;
  return toCamelCase(data) as Task[];
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const { data, error } = await supabase.from('tasks').insert([toSnakeCase(task)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as Task;
};

export const updateTask = async (task: Task): Promise<Task> => {
  const { data, error } = await supabase.from('tasks').update(toSnakeCase(task)).eq('id', task.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as Task;
};

export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// ABSENCES
// ======================
export const fetchAbsences = async (): Promise<Absence[]> => {
  const { data, error } = await supabase.from('absences').select('*').order('date', { ascending: false });
  if (error) throw error;
  return toCamelCase(data) as Absence[];
};

export const addAbsence = async (absence: Omit<Absence, 'id'>): Promise<Absence> => {
  const { data, error } = await supabase.from('absences').insert([toSnakeCase(absence)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as Absence;
};

export const updateAbsence = async (absence: Absence): Promise<Absence> => {
  const { data, error } = await supabase.from('absences').update(toSnakeCase(absence)).eq('id', absence.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as Absence;
};

export const deleteAbsence = async (id: string): Promise<void> => {
  const { error } = await supabase.from('absences').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// SALARY ADVANCES
// ======================
export const fetchSalaryAdvances = async (): Promise<SalaryAdvance[]> => {
  const { data, error } = await supabase.from('salary_advances').select('*').order('date', { ascending: false });
  if (error) throw error;
  return toCamelCase(data) as SalaryAdvance[];
};

export const addSalaryAdvance = async (advance: Omit<SalaryAdvance, 'id'>): Promise<SalaryAdvance> => {
  const { data, error } = await supabase.from('salary_advances').insert([toSnakeCase(advance)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as SalaryAdvance;
};

export const updateSalaryAdvance = async (advance: SalaryAdvance): Promise<SalaryAdvance> => {
  const { data, error } = await supabase.from('salary_advances').update(toSnakeCase(advance)).eq('id', advance.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as SalaryAdvance;
};

export const deleteSalaryAdvance = async (id: string): Promise<void> => {
  const { error } = await supabase.from('salary_advances').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// UTILITY RECORDS
// ======================
export const fetchUtilityRecords = async (): Promise<UtilityRecord[]> => {
  const { data, error } = await supabase.from('utility_records').select('*').order('date', { ascending: false });
  if (error) throw error;
  return toCamelCase(data) as UtilityRecord[];
};

export const addUtilityRecord = async (record: Omit<UtilityRecord, 'id'>): Promise<UtilityRecord> => {
  const { data, error } = await supabase.from('utility_records').insert([toSnakeCase(record)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as UtilityRecord;
};

export const updateUtilityRecord = async (record: UtilityRecord): Promise<UtilityRecord> => {
  const { data, error } = await supabase.from('utility_records').update(toSnakeCase(record)).eq('id', record.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as UtilityRecord;
};

export const deleteUtilityRecord = async (id: string): Promise<void> => {
  const { error } = await supabase.from('utility_records').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// UTILITY CATEGORIES
// ======================
export const fetchUtilityCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase.from('utility_categories').select('name').order('name');
  if (error) throw error;
  return data.map(c => c.name);
};

export const addUtilityCategory = async (name: string): Promise<void> => {
  const { error } = await supabase.from('utility_categories').insert([{ name }]);
  if (error) throw error;
};

export const deleteUtilityCategory = async (name: string): Promise<void> => {
  const { error } = await supabase.from('utility_categories').delete().eq('name', name);
  if (error) throw error;
};

// ======================
// ROOMS & BEDS
// ======================
export const fetchRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('rooms')
    .select(`
      *,
      beds (*)
    `)
    .order('name');
  
  if (error) throw error;
  return toCamelCase(data) as Room[];
};

export const addRoom = async (room: Omit<Room, 'id'>): Promise<Room> => {
  const { beds, ...roomData } = room;
  const { data: newRoom, error: roomError } = await supabase
    .from('rooms')
    .insert([toSnakeCase(roomData)])
    .select()
    .single();
  
  if (roomError) throw roomError;

  // Add beds
  if (beds && beds.length > 0) {
    const bedsToInsert = beds.map(bed => ({
      ...toSnakeCase(bed),
      room_id: newRoom.id,
      id: undefined // Let DB generate
    }));
    const { error: bedsError } = await supabase.from('beds').insert(bedsToInsert);
    if (bedsError) throw bedsError;
  }

  return fetchRoomById(newRoom.id);
};

export const updateRoom = async (room: Room): Promise<Room> => {
  const { beds, ...roomData } = room;
  const { error: roomError } = await supabase
    .from('rooms')
    .update(toSnakeCase(roomData))
    .eq('id', room.id);
  
  if (roomError) throw roomError;

  // Update beds
  if (beds) {
    for (const bed of beds) {
      const { error: bedError } = await supabase
        .from('beds')
        .update(toSnakeCase(bed))
        .eq('id', bed.id);
      if (bedError) throw bedError;
    }
  }

  return fetchRoomById(room.id);
};

export const deleteRoom = async (id: string): Promise<void> => {
  const { error } = await supabase.from('rooms').delete().eq('id', id);
  if (error) throw error;
};

const fetchRoomById = async (id: string): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .select(`*, beds (*)`)
    .eq('id', id)
    .single();
  if (error) throw error;
  return toCamelCase(data) as Room;
};

// ======================
// ACTIVITIES
// ======================
export const fetchActivities = async (): Promise<Activity[]> => {
  const { data, error } = await supabase.from('activities').select('*').order('name');
  if (error) throw error;
  return toCamelCase(data) as Activity[];
};

export const addActivity = async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
  const { data, error } = await supabase.from('activities').insert([toSnakeCase(activity)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as Activity;
};

export const updateActivity = async (activity: Activity): Promise<Activity> => {
  const { data, error } = await supabase.from('activities').update(toSnakeCase(activity)).eq('id', activity.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as Activity;
};

export const deleteActivity = async (id: string): Promise<void> => {
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// SPEED BOAT TRIPS
// ======================
export const fetchSpeedBoatTrips = async (): Promise<SpeedBoatTrip[]> => {
  const { data, error } = await supabase.from('speed_boat_trips').select('*').order('route');
  if (error) throw error;
  return toCamelCase(data) as SpeedBoatTrip[];
};

export const addSpeedBoatTrip = async (trip: Omit<SpeedBoatTrip, 'id'>): Promise<SpeedBoatTrip> => {
  const { data, error } = await supabase.from('speed_boat_trips').insert([toSnakeCase(trip)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as SpeedBoatTrip;
};

export const updateSpeedBoatTrip = async (trip: SpeedBoatTrip): Promise<SpeedBoatTrip> => {
  const { data, error } = await supabase.from('speed_boat_trips').update(toSnakeCase(trip)).eq('id', trip.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as SpeedBoatTrip;
};

export const deleteSpeedBoatTrip = async (id: string): Promise<void> => {
  const { error } = await supabase.from('speed_boat_trips').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// TAXI BOAT OPTIONS
// ======================
export const fetchTaxiBoatOptions = async (): Promise<TaxiBoatOption[]> => {
  const { data, error } = await supabase.from('taxi_boat_options').select('*').order('name');
  if (error) throw error;
  return toCamelCase(data) as TaxiBoatOption[];
};

export const addTaxiBoatOption = async (option: Omit<TaxiBoatOption, 'id'>): Promise<TaxiBoatOption> => {
  const { data, error } = await supabase.from('taxi_boat_options').insert([toSnakeCase(option)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as TaxiBoatOption;
};

export const updateTaxiBoatOption = async (option: TaxiBoatOption): Promise<TaxiBoatOption> => {
  const { data, error } = await supabase.from('taxi_boat_options').update(toSnakeCase(option)).eq('id', option.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as TaxiBoatOption;
};

export const deleteTaxiBoatOption = async (id: string): Promise<void> => {
  const { error } = await supabase.from('taxi_boat_options').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// EXTRAS
// ======================
export const fetchExtras = async (): Promise<Extra[]> => {
  const { data, error } = await supabase.from('extras').select('*').order('name');
  if (error) throw error;
  return toCamelCase(data) as Extra[];
};

export const addExtra = async (extra: Omit<Extra, 'id'>): Promise<Extra> => {
  const { data, error } = await supabase.from('extras').insert([toSnakeCase(extra)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as Extra;
};

export const updateExtra = async (extra: Extra): Promise<Extra> => {
  const { data, error } = await supabase.from('extras').update(toSnakeCase(extra)).eq('id', extra.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as Extra;
};

export const deleteExtra = async (id: string): Promise<void> => {
  const { error } = await supabase.from('extras').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// BOOKINGS
// ======================
export const fetchBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase.from('bookings').select('*').order('booking_date', { ascending: false });
  if (error) throw error;
  return toCamelCase(data) as Booking[];
};

export const addBooking = async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
  const { data, error } = await supabase.from('bookings').insert([toSnakeCase(booking)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as Booking;
};

export const updateBooking = async (booking: Booking): Promise<Booking> => {
  const { data, error } = await supabase.from('bookings').update(toSnakeCase(booking)).eq('id', booking.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as Booking;
};

export const deleteBooking = async (id: string): Promise<void> => {
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// EXTERNAL SALES
// ======================
export const fetchExternalSales = async (): Promise<ExternalSale[]> => {
  const { data, error } = await supabase.from('external_sales').select('*').order('date', { ascending: false });
  if (error) throw error;
  return toCamelCase(data) as ExternalSale[];
};

export const addExternalSale = async (sale: Omit<ExternalSale, 'id'>): Promise<ExternalSale> => {
  const { data, error } = await supabase.from('external_sales').insert([toSnakeCase(sale)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as ExternalSale;
};

export const updateExternalSale = async (sale: ExternalSale): Promise<ExternalSale> => {
  const { data, error } = await supabase.from('external_sales').update(toSnakeCase(sale)).eq('id', sale.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as ExternalSale;
};

export const deleteExternalSale = async (id: string): Promise<void> => {
  const { error } = await supabase.from('external_sales').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// PLATFORM PAYMENTS
// ======================
export const fetchPlatformPayments = async (): Promise<PlatformPayment[]> => {
  const { data, error } = await supabase.from('platform_payments').select('*').order('date', { ascending: false });
  if (error) throw error;
  return toCamelCase(data) as PlatformPayment[];
};

export const addPlatformPayment = async (payment: Omit<PlatformPayment, 'id'>): Promise<PlatformPayment> => {
  const { data, error } = await supabase.from('platform_payments').insert([toSnakeCase(payment)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as PlatformPayment;
};

export const updatePlatformPayment = async (payment: PlatformPayment): Promise<PlatformPayment> => {
  const { data, error } = await supabase.from('platform_payments').update(toSnakeCase(payment)).eq('id', payment.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as PlatformPayment;
};

export const deletePlatformPayment = async (id: string): Promise<void> => {
  const { error } = await supabase.from('platform_payments').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// WALK-IN GUESTS
// ======================
export const fetchWalkInGuests = async (): Promise<WalkInGuest[]> => {
  const { data, error } = await supabase.from('walk_in_guests').select('*').order('check_in_date', { ascending: false });
  if (error) throw error;
  return toCamelCase(data) as WalkInGuest[];
};

export const addWalkInGuest = async (guest: Omit<WalkInGuest, 'id'>): Promise<WalkInGuest> => {
  const { data, error } = await supabase.from('walk_in_guests').insert([toSnakeCase(guest)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as WalkInGuest;
};

export const updateWalkInGuest = async (guest: WalkInGuest): Promise<WalkInGuest> => {
  const { data, error } = await supabase.from('walk_in_guests').update(toSnakeCase(guest)).eq('id', guest.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as WalkInGuest;
};

export const deleteWalkInGuest = async (id: string): Promise<void> => {
  const { error } = await supabase.from('walk_in_guests').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// ACCOMMODATION BOOKINGS
// ======================
export const fetchAccommodationBookings = async (): Promise<AccommodationBooking[]> => {
  const { data, error } = await supabase.from('accommodation_bookings').select('*').order('check_in_date', { ascending: false });
  if (error) throw error;
  return toCamelCase(data) as AccommodationBooking[];
};

export const addAccommodationBooking = async (booking: Omit<AccommodationBooking, 'id'>): Promise<AccommodationBooking> => {
  const { data, error } = await supabase.from('accommodation_bookings').insert([toSnakeCase(booking)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as AccommodationBooking;
};

export const updateAccommodationBooking = async (booking: AccommodationBooking): Promise<AccommodationBooking> => {
  const { data, error } = await supabase.from('accommodation_bookings').update(toSnakeCase(booking)).eq('id', booking.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as AccommodationBooking;
};

export const deleteAccommodationBooking = async (id: string): Promise<void> => {
  const { error } = await supabase.from('accommodation_bookings').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// PAYMENT TYPES
// ======================
export const fetchPaymentTypes = async (): Promise<PaymentType[]> => {
  const { data, error } = await supabase.from('payment_types').select('*').order('name');
  if (error) throw error;
  return toCamelCase(data) as PaymentType[];
};

export const addPaymentType = async (paymentType: Omit<PaymentType, 'id'>): Promise<PaymentType> => {
  const { data, error } = await supabase.from('payment_types').insert([toSnakeCase(paymentType)]).select().single();
  if (error) throw error;
  return toCamelCase(data) as PaymentType;
};

export const updatePaymentType = async (paymentType: PaymentType): Promise<PaymentType> => {
  const { data, error } = await supabase.from('payment_types').update(toSnakeCase(paymentType)).eq('id', paymentType.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as PaymentType;
};

export const deletePaymentType = async (id: string): Promise<void> => {
  const { error } = await supabase.from('payment_types').delete().eq('id', id);
  if (error) throw error;
};

// ======================
// USERS (for login management)
// ======================
export const fetchUsers = async (): Promise<import('../types').User[]> => {
  const { data, error } = await supabase.from('users').select('*').order('username');
  if (error) throw error;
  return toCamelCase(data) as import('../types').User[];
};

export const addUser = async (user: Omit<import('../types').User, 'id' | 'createdAt'>): Promise<import('../types').User> => {
  const userData = {
    ...toSnakeCase(user),
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from('users').insert([userData]).select().single();
  if (error) throw error;
  return toCamelCase(data) as import('../types').User;
};

export const updateUser = async (user: import('../types').User): Promise<import('../types').User> => {
  const { data, error } = await supabase.from('users').update(toSnakeCase(user)).eq('id', user.id).select().single();
  if (error) throw error;
  return toCamelCase(data) as import('../types').User;
};

export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
};

