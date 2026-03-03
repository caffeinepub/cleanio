import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";



actor {
  type VehicleType = {
    #scooter;
    #motorcycle;
  };

  type Capacity = {
    #upTo200cc;
    #above200cc;
  };

  type ServiceType = {
    #fullService;
    #repair;
    #cleaning;
  };

  type CleaningSubOption = {
    #colourFoamWashing : Nat; // Price in INR
    #normalFoamWashing : Nat; // Price in INR
  };

  type Status = {
    #pending;
    #confirmed;
    #completed;
  };

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

  module Booking {
    public func compare(b1 : Booking, b2 : Booking) : Order.Order {
      Text.compare(b1.id, b2.id);
    };
  };

  stable var bookings = Map.empty<Text, Booking>();

  // Create Booking with Cleaning Sub-Option
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
      Runtime.trap("Booking already exists");
    };

    // Enforce valid cleaning sub-option if service type is cleaning
    let validCleaningSubOption = switch (serviceType) {
      case (#cleaning) {
        switch (cleaningSubOption) {
          case (null) { Runtime.trap("Cleaning sub-option must be provided for cleaning service") };
          case (?_) { cleaningSubOption };
        };
      };
      case (_) { null }; // For non-cleaning services, sub-option should be null
    };

    let newBooking : Booking = {
      id;
      customerName;
      phoneNumber;
      address;
      vehicleType;
      capacity;
      serviceType;
      cleaningSubOption = validCleaningSubOption;
      repairDetails;
      status = #pending;
      mechanicName = null; // Initialize as null, admin can assign later
    };

    bookings.add(id, newBooking);
  };

  // Get all Bookings
  public query ({ caller }) func getBookings() : async [Booking] {
    bookings.values().toArray().sort();
  };

  // Update Booking Status
  public shared ({ caller }) func updateBookingStatus(
    id : Text,
    newStatus : Status,
  ) : async () {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = {
          booking with status = newStatus;
        };
        bookings.add(id, updatedBooking);
      };
    };
  };

  // Assign Mechanic to Booking
  public shared ({ caller }) func assignMechanic(
    id : Text,
    mechanicName : Text,
  ) : async () {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = {
          booking with mechanicName = ?mechanicName;
        };
        bookings.add(id, updatedBooking);
      };
    };
  };

  // Get single booking with mechanic name (for confirmation page)
  public query ({ caller }) func getBooking(id : Text) : async ?Booking {
    bookings.get(id);
  };
};

