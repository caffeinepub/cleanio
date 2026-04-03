import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";



actor {
  type VehicleType = { #scooter; #motorcycle; #electric };
  type Capacity = { #upTo200cc; #above200cc };
  type ServiceType = { #fullService; #repair; #cleaning };
  type CleaningSubOption = { #colourFoamWashing : Nat; #normalFoamWashing : Nat };
  type Status = { #pending; #confirmed; #completed };

  type Booking = {
    id : Text;
    customerName : Text;
    phoneNumber : Text;
    address : Text;
    vehicleType : VehicleType;
    capacity : Capacity;
    serviceType : ServiceType;
    cleaningSubOption : ?CleaningSubOption;
    repairDetails : ?Text;
    status : Status;
    mechanicName : ?Text;
  };

  stable var bookings = Map.empty<Text, Booking>();

  // Create a new booking with error checks
  public shared ({ caller }) func createBooking(
    id : Text,
    customerName : Text,
    phoneNumber : Text,
    address : Text,
    vehicleType : VehicleType,
    capacity : Capacity,
    serviceType : ServiceType,
    repairDetails : ?Text,
    cleaningSubOption : ?CleaningSubOption,
  ) : async () {
    if (bookings.containsKey(id)) {
      Runtime.trap("Booking ID already exists");
    };

    let finalCleaningSubOption = switch (serviceType, cleaningSubOption) {
      case (#cleaning, null) { Runtime.trap("Cleaning sub-option required for cleaning service") };
      case (#cleaning, option) { option };
      case (_, _) { null };
    };

    let newBooking : Booking = {
      id;
      customerName;
      phoneNumber;
      address;
      vehicleType;
      capacity;
      serviceType;
      cleaningSubOption = finalCleaningSubOption;
      repairDetails;
      status = #pending;
      mechanicName = null;
    };

    bookings.add(id, newBooking);
  };

  // Query all bookings
  public query ({ caller }) func getBookings() : async [Booking] {
    bookings.values().toArray();
  };

  // Query single booking by ID
  public query ({ caller }) func getBooking(id : Text) : async ?Booking {
    bookings.get(id);
  };

  // Update the status of a booking
  public shared ({ caller }) func updateBookingStatus(id : Text, newStatus : Status) : async () {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = { booking with status = newStatus };
        bookings.add(id, updatedBooking);
      };
    };
  };

  // Assign a mechanic to a booking
  public shared ({ caller }) func assignMechanic(id : Text, mechanicName : Text) : async () {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = { booking with mechanicName = ?mechanicName };
        bookings.add(id, updatedBooking);
      };
    };
  };
};
