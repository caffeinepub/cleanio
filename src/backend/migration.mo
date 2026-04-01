import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type OldVehicleType = { #scooter; #motorcycle };
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
    status : OldStatus;
    mechanicName : ?Text;
  };

  type OldActor = { bookings : Map.Map<Text, OldBooking> };

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
    status : NewStatus;
    mechanicName : ?Text;
  };

  type NewActor = { bookings : Map.Map<Text, NewBooking> };

  public func run(old : OldActor) : NewActor {
    let newBookings = old.bookings.map<Text, OldBooking, NewBooking>(
      func(_id, oldBooking) { oldBooking },
    );
    { bookings = newBookings };
  };
};
