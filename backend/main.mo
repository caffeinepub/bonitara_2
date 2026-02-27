import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

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

  let productsMap = Map.empty<Nat, Product>();

  // Anyone (including guests) can register
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

  // Anyone (including guests) can attempt login
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

  // Anyone (including guests) can check admin credentials
  public query ({ caller }) func adminCheck(email : Text, password : Text) : async Bool {
    Text.equal(email, adminCredentials.email) and Text.equal(password, adminCredentials.password)
  };

  // Only authenticated users can view their own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  // Only authenticated users can save their own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Users can view their own profile; admins can view any profile
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Only admins can assign roles
  public shared ({ caller }) func assignUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  // Only admins can query user roles
  public query ({ caller }) func getUserRole(user : Principal) : async AccessControl.UserRole {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can query user roles");
    };
    AccessControl.getUserRole(accessControlState, user);
  };

  // Only authenticated users can submit reviews
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

  // Anyone can read reviews
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

  // Anyone can read product average ratings
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

  // Anyone can read product rating summaries
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

  // Anyone can read product review counts
  public query func getProductReviewCount(productId : ProductId) : async Nat {
    switch (productReviewMap.get(productId)) {
      case (null) { 0 };
      case (?reviews) { reviews.size() };
    };
  };

  public type Error = {
    #error : Text;
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    sku : Text;
    stock : Nat;
    category : Text;
    imageUrl : Text;
    isVisible : Bool;
  };

  public type AddProductInput = {
    name : Text;
    description : Text;
    price : Nat;
    sku : Text;
    stock : Nat;
    category : Text;
    imageUrl : Text;
  };

  public type UpdateProductInput = {
    name : Text;
    description : Text;
    price : Nat;
    sku : Text;
    stock : Nat;
    category : Text;
    imageUrl : Text;
  };

  // Only admins can add products
  public shared ({ caller }) func addProduct(productInput : AddProductInput) : async { #ok : Nat; #err : Error } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err(#error("Unauthorized: Only admins can add products"));
    };
    let newProductId = productsMap.size() + 1;
    let newProduct : Product = {
      id = newProductId;
      name = productInput.name;
      description = productInput.description;
      price = productInput.price;
      sku = productInput.sku;
      stock = productInput.stock;
      category = productInput.category;
      imageUrl = productInput.imageUrl;
      isVisible = true;
    };

    productsMap.add(newProductId, newProduct);
    #ok(newProductId);
  };

  // Only admins can update products
  public shared ({ caller }) func updateProduct(productId : Nat, updateProductInput : UpdateProductInput) : async { #ok : Product; #err : Error } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err(#error("Unauthorized: Only admins can update products"));
    };
    switch (productsMap.get(productId)) {
      case (?product) {
        let updatedProduct = { product with
          name = updateProductInput.name;
          description = updateProductInput.description;
          price = updateProductInput.price;
          sku = updateProductInput.sku;
          stock = updateProductInput.stock;
          category = updateProductInput.category;
          imageUrl = updateProductInput.imageUrl;
        };
        productsMap.add(productId, updatedProduct);
        #ok(updatedProduct);
      };
      case (null) { #err(#error("Product not found")) };
    };
  };

  // Only admins can update product visibility
  public shared ({ caller }) func updateProductVisibility(productId : Nat, visibility : Bool) : async { #ok : Product; #err : Error } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err(#error("Unauthorized: Only admins can update product visibility"));
    };
    switch (productsMap.get(productId)) {
      case (?product) {
        let updatedProduct = { product with isVisible = visibility };
        productsMap.add(productId, updatedProduct);
        #ok(updatedProduct);
      };
      case (null) { #err(#error("Product not found")) };
    };
  };

  // Only admins can delete products
  public shared ({ caller }) func deleteProduct(productId : Nat) : async { #ok : Nat; #err : Error } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err(#error("Unauthorized: Only admins can delete products"));
    };
    switch (productsMap.get(productId)) {
      case (?product) {
        let updatedProduct = { product with isVisible = false };
        productsMap.add(productId, updatedProduct);
        #ok(productId);
      };
      case (null) { #err(#error("Product not found")) };
    };
  };

  // Only admins can view all products (including hidden ones)
  public query ({ caller }) func getAllProductsAdmin() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all products");
    };
    productsMap.values().toArray();
  };

  // Anyone can view visible products
  public query func getAllProducts() : async [Product] {
    productsMap.toArray().filter(func((_, p)) { p.isVisible }).map(func((_, p)) { p });
  };

  // Anyone can view visible products by category
  public query func getProductsByCategory(category : Text) : async [Product] {
    productsMap.toArray().filter(
      func((_, p)) {
        Text.equal(p.category, category) and p.isVisible;
      }
    ).map(
      func((_, p)) { p }
    );
  };

  // Anyone can view a visible product by ID; admins can view hidden products too
  public query ({ caller }) func getProductById(productId : Nat) : async ?Product {
    switch (productsMap.get(productId)) {
      case (null) { null };
      case (?product) {
        if (product.isVisible or AccessControl.isAdmin(accessControlState, caller)) {
          ?product;
        } else {
          null;
        };
      };
    };
  };

  public type Category = {
    #candleMaking;
    #soapMaking;
    #fragrance;
    #resinArt;
  };

  public type AdminAddProductInput = {
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    stock : Nat;
    imageUrl : Text;
  };

  public type CategoryMapping = {
    category : Category;
    textValue : Text;
  };

  // Category mapping function
  func categoryMappingFunction(category : Category) : CategoryMapping {
    let textValue = switch (category) {
      case (#candleMaking) { "candleMaking" };
      case (#soapMaking) { "soapMaking" };
      case (#fragrance) { "fragrance" };
      case (#resinArt) { "resinArt" };
    };
    { category; textValue };
  };

  // Only admins can add products using the "Add New Product" form
  public shared ({ caller }) func adminAddProduct(input : AdminAddProductInput) : async { #ok : Product; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only admins can add products");
    };

    let categoryMapping = categoryMappingFunction(input.category);

    // Use categoryMapping.textValue as needed

    let newProductId = productsMap.size() + 1;
    let newProduct : Product = {
      id = newProductId;
      name = input.name;
      description = input.description;
      price = input.price;
      sku = "SKU_" # newProductId.toText();
      stock = input.stock;
      category = categoryMapping.textValue;
      imageUrl = input.imageUrl;
      isVisible = true;
    };

    productsMap.add(newProductId, newProduct);
    #ok(newProduct);
  };
};
