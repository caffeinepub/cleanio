import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  // Old types (from previous version — no timeSlot, no createdAt)
  type OldVehicleType = { #scooter; #motorcycle; #electric };
  type OldCapacity = { #upTo200cc; #above200cc };
  type OldServiceType = { #fullService; #repair; #cleaning };
  type OldCleaningSubOption = { #colourFoamWashing : Nat; #normalFoamWashing : Nat };
  type OldStatus = { #pending; #confirmed; #completed };

  type OldBooking = {
    id : Text;
    customerName : Text;
    phoneNumber : Text;
    address : Text;
    vehicleType : OldVehicleType;
    capacity : OldCapacity;
    serviceType : OldServiceType;
    cleaningSubOption : ?OldCleaningSubOption;
    repairDetails : ?Text;
    timeSlot : ?Text;
    status : OldStatus;
    mechanicName : ?Text;
    createdAt : Int;
  };

  // New types (current version — adds timeSlot and createdAt)
  type NewVehicleType = { #scooter; #motorcycle; #electric };
  type NewCapacity = { #upTo200cc; #above200cc };
  type NewServiceType = { #fullService; #repair; #cleaning };
  type NewCleaningSubOption = { #colourFoamWashing : Nat; #normalFoamWashing : Nat };
  type NewStatus = { #pending; #confirmed; #completed };

  type NewBooking = {
    id : Text;
    customerName : Text;
    phoneNumber : Text;
    address : Text;
    vehicleType : NewVehicleType;
    capacity : NewCapacity;
    serviceType : NewServiceType;
    cleaningSubOption : ?NewCleaningSubOption;
    repairDetails : ?Text;
    timeSlot : ?Text;
    status : NewStatus;
    mechanicName : ?Text;
    createdAt : Int;
  };

  type OldActor = {
    bookings : Map.Map<Text, OldBooking>;
  };

  type NewActor = {
    bookings : Map.Map<Text, NewBooking>;
  };

  public func run(old : OldActor) : NewActor {
    let newBookings = old.bookings.map<Text, OldBooking, NewBooking>(
      func(_id, b) {
        {
          id = b.id;
          customerName = b.customerName;
          phoneNumber = b.phoneNumber;
          address = b.address;
          vehicleType = b.vehicleType;
          capacity = b.capacity;
          serviceType = b.serviceType;
          cleaningSubOption = b.cleaningSubOption;
          repairDetails = b.repairDetails;
          timeSlot = b.timeSlot;
          status = b.status;
          mechanicName = b.mechanicName;
          createdAt = b.createdAt;
        }
      }
    );
    { bookings = newBookings };
  };
};
