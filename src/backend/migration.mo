import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type VehicleType = { #scooter; #motorcycle };
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

  type OldActor = { bookings : Map.Map<Text, Booking> };
  type NewActor = { bookings : Map.Map<Text, Booking> };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
