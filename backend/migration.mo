import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  type OldActor = {
    adminUsername : Text;
    adminPassword : Text;
    userProfiles : Map.Map<Principal, { name : Text; email : Text }>;
    productReviewMap : Map.Map<Nat, List.List<{ id : Nat; author : Text; title : Text; body : Text; rating : Nat; timestamp : Int }>>;
    nextReviewId : Nat;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text; email : Text }>;
    productReviewMap : Map.Map<Nat, List.List<{ id : Nat; author : Text; title : Text; body : Text; rating : Nat; timestamp : Int }>>;
    nextReviewId : Nat;
    credentialsMap : Map.Map<Text, { email : Text; password : Text; name : Text }>;
    adminCredentials : { email : Text; password : Text; name : Text };
  };

  public func run(old : OldActor) : NewActor {
    let credentialsMap = Map.empty<Text, { email : Text; password : Text; name : Text }>();
    {
      old with
      credentialsMap;
      adminCredentials = {
        email = "admin";
        password = "Bonitara@2024";
        name = "admin";
      };
    };
  };
};
