import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Map "mo:core/Map";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Credentials = {
    email : Text;
    password : Text;
    name : Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public type ProductId = Nat;
  public type Rating = Nat;

  public type Review = {
    id : Nat;
    author : Text;
    title : Text;
    body : Text;
    rating : Rating;
    timestamp : Time.Time;
  };

  public type ReviewInput = {
    author : Text;
    title : Text;
    body : Text;
    rating : Rating;
  };

  public type ProductReviews = {
    reviews : [Review];
    averageRating : ?Rating;
    reviewCount : Nat;
  };

  let productReviewMap = Map.empty<ProductId, List.List<Review>>();
  var nextReviewId = 0;

  let credentialsMap = Map.empty<Text, Credentials>();
  let adminCredentials : Credentials = {
    email = "admin";
    password = "Bonitara@2024";
    name = "admin";
  };

  public type RegistrationInput = {
    name : Text;
    email : Text;
    password : Text;
  };

  public shared ({ caller }) func registerUser(input : RegistrationInput) : async Bool {
    switch (credentialsMap.get(input.email)) {
      case (null) {};
      case (?_) { return false };
    };

    let newCredentials : Credentials = {
      email = input.email;
      password = input.password;
      name = input.name;
    };

    credentialsMap.add(input.email, newCredentials);

    let userProfile : UserProfile = {
      name = input.name;
      email = input.email;
    };
    userProfiles.add(Principal.anonymous(), userProfile);

    true;
  };

  public query ({ caller }) func loginUser(email : Text, password : Text) : async Bool {
    switch (credentialsMap.get(email)) {
      case (?creds) {
        if (Text.equal(password, creds.password)) { true } else {
          false;
        };
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func adminCheck(email : Text, password : Text) : async Bool {
    Text.equal(email, adminCredentials.email) and Text.equal(password, adminCredentials.password)
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func assignUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func getUserRole(user : Principal) : async AccessControl.UserRole {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can query user roles");
    };
    AccessControl.getUserRole(accessControlState, user);
  };

  public shared ({ caller }) func submitReview(productId : ProductId, reviewInput : ReviewInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can submit reviews");
    };
    assert reviewInput.rating >= 1 and reviewInput.rating <= 5;

    let review : Review = {
      id = nextReviewId;
      author = reviewInput.author;
      title = reviewInput.title;
      body = reviewInput.body;
      rating = reviewInput.rating;
      timestamp = Time.now();
    };

    switch (productReviewMap.get(productId)) {
      case (null) {
        let reviews = List.empty<Review>();
        reviews.add(review);
        productReviewMap.add(productId, reviews);
      };
      case (?reviews) {
        reviews.add(review);
      };
    };
    nextReviewId += 1;
  };

  public query func getReviews(productId : ProductId) : async ProductReviews {
    let reviews = switch (productReviewMap.get(productId)) {
      case (null) { List.empty<Review>() };
      case (?r) { r };
    };

    let reviewArray = reviews.toArray();
    let reviewCount = reviewArray.size();

    let averageRating = if (reviewCount == 0) {
      null;
    } else {
      var sum = 0;
      for (review in reviewArray.values()) {
        sum += review.rating;
      };
      ?(sum / reviewCount);
    };

    {
      reviews = reviewArray;
      averageRating;
      reviewCount;
    };
  };

  public query func getAllProductAverageRatings() : async [(ProductId, ?Rating)] {
    let entries = productReviewMap.toArray();
    entries.map<(ProductId, List.List<Review>), (ProductId, ?Rating)>(
      func((productId, reviews)) {
        let reviewArray = reviews.toArray();
        let reviewCount = reviewArray.size();

        let averageRating = if (reviewCount == 0) {
          null;
        } else {
          var sum = 0;
          for (review in reviewArray.values()) {
            sum += review.rating;
          };
          ?(sum / reviewCount);
        };
        (productId, averageRating);
      }
    );
  };

  public query func getProductRatingSummary(productId : ProductId) : async ?ProductReviews {
    switch (productReviewMap.get(productId)) {
      case (null) { null };
      case (?reviews) {
        let reviewArray = reviews.toArray();
        let reviewCount = reviewArray.size();

        let averageRating = if (reviewCount == 0) {
          null;
        } else {
          var sum = 0;
          for (review in reviewArray.values()) {
            sum += review.rating;
          };
          ?(sum / reviewCount);
        };

        ?{
          reviews = reviewArray;
          averageRating;
          reviewCount;
        };
      };
    };
  };

  public query func getProductReviewCount(productId : ProductId) : async Nat {
    switch (productReviewMap.get(productId)) {
      case (null) { 0 };
      case (?reviews) { reviews.size() };
    };
  };
};
