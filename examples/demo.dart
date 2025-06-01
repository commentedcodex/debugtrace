// DebugTrace Extension Demo
// This file demonstrates the capabilities of the DebugTrace extension

void main() {
  // Basic variable types
  String message = "Hello Dart";
  int count = 42;
  double price = 19.99;
  bool isActive = true;
  
  // Collections
  List<String> languages = ["Dart", "Flutter", "JavaScript"];
  Map<String, int> scores = {
    "Alice": 95,
    "Bob": 87,
    "Charlie": 92
  };
  
  // Complex object
  User user = User(
    name: "John Doe",
    email: "john@example.com",
    age: 30
  );
  
  // Usage examples:
  // 1. Place cursor on any variable above
  // 2. Use Command Palette: "DebugTrace: Insert Log"
  // 3. Or "DebugTrace: Insert Log with Message" for custom messages
  
  processData(message, count, languages);
  calculateScore(user, scores);
}

void processData(String msg, int num, List<String> items) {
  // Place cursor on parameters to test logging
  print("Processing: $msg with $num items");
  for (String item in items) {
    print("- $item");
  }
}

double calculateScore(User user, Map<String, int> scores) {
  int baseScore = scores[user.name] ?? 0;
  double multiplier = user.age > 25 ? 1.2 : 1.0;
  return baseScore * multiplier;
}

class User {
  final String name;
  final String email;
  final int age;
  
  User({required this.name, required this.email, required this.age});
  
  @override
  String toString() => 'User(name: $name, email: $email, age: $age)';
}
