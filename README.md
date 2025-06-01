# DebugTrace for Dart

**Fast and intelligent debugging for Dart developers**

DebugTrace is a VS Code extension that supercharges your Dart debugging workflow by automatically generating contextual debug statements. Say goodbye to manual print statements and hello to efficient debugging.

## 🚀 Features

### Smart Variable Detection
- **Automatic Variable Recognition**: Place your cursor on any variable and instantly generate debug logs
- **Contextual Information**: Includes file name, line number, and variable values
- **Multi-line Statement Support**: Intelligently handles complex objects, arrays, and function calls

### Customizable Output
- **Two Log Types**: Choose between `print()` for console output or `debugPrint()` for Flutter apps
- **Custom Prefixes**: Personalize your debug messages with emojis or text
- **Flexible Formatting**: Control message wrapping and separator lines

### Bulk Operations
- **Mass Management**: Comment, uncomment, or delete all DebugTrace logs at once
- **Clean Workflow**: Easily remove debug statements before production

## 📦 Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "DebugTrace"
4. Click Install

## 🎯 Quick Start

### Basic Usage
1. **Place cursor** on any variable in your Dart file
2. **Open Command Palette** (Ctrl+Shift+P / Cmd+Shift+P)
3. **Run** `DebugTrace: Insert Log`
4. **Debug statement** appears below the variable

### Example
```dart
String userName = "Alice";
int userAge = 25;
```

After using DebugTrace with `print()`:
```dart
String userName = "Alice";
print('DebugTrace🔎: [main.dart:1] userName: ${userName}');
int userAge = 25;
print('DebugTrace🔎: [main.dart:3] userAge: ${userAge}');
```

After using DebugTrace with `debugPrint()`:
```dart
String userName = "Alice";
debugPrint('DebugTrace🔎: [main.dart:1] userName: ${userName}');
int userAge = 25;
debugPrint('DebugTrace🔎: [main.dart:3] userAge: ${userAge}');
```

## ⚙️ Configuration

Customize DebugTrace through VS Code settings:

```json
{
  "debugtrace.logType": "print",           // "print" | "debugPrint"
  "debugtrace.logMessagePrefix": "DebugTrace🔎:",     // Custom prefix
  "debugtrace.includeFileInfo": true,      // Include [file:line]
  "debugtrace.addSeparatorLine": false     // Add separator after logs
}
```

### Log Types Explained

| Log Type | Best For | Description |
|----------|----------|-------------|
| `print()` | Console Dart apps, simple debugging | Standard Dart console output |
| `debugPrint()` | Flutter apps | Throttled output, debug-mode only, better for Flutter |

**When to use `debugPrint()`:**
- Building Flutter applications
- Heavy debug output (prevents message dropping)
- Want logs automatically removed in release builds
- Working with Flutter's logging system

**When to use `print()`:**
- Simple Dart console applications
- Basic debugging needs
- Want output in all build modes

## 🎮 Commands & Shortcuts

| Command | Shortcut | Description |
|---------|----------|-------------|
| `DebugTrace: Insert Log` | `Ctrl+L` / `Cmd+L` | Generate debug log for variable at cursor |
| `DebugTrace: Insert Log with Message` | `Ctrl+Shift+L` / `Cmd+Shift+L` | Generate debug log with custom message |
| `DebugTrace: Delete All Logs` | `Ctrl+Alt+L` / `Cmd+Alt+L` | Remove all DebugTrace logs from file |
| `DebugTrace: Comment All Logs` | `Ctrl+Alt+C` / `Cmd+Alt+C` | Comment out all DebugTrace logs |
| `DebugTrace: Uncomment All Logs` | `Ctrl+Alt+U` / `Cmd+Alt+U` | Uncomment all DebugTrace logs |

### 🎯 Quick Access
- **Most used**: `Ctrl+L` / `Cmd+L` for instant log insertion
- **Custom messages**: `Ctrl+Shift+L` / `Cmd+Shift+L` for logs with your own text
- **Bulk cleanup**: `Ctrl+Alt+L` / `Cmd+Alt+L` to remove all logs before commit

## 🔧 Smart Insertion

DebugTrace intelligently analyzes your code structure:

### Complex Objects
```dart
Map<String, dynamic> user = {
  'name': 'John',
  'age': 30,
  'email': 'john@example.com'
};
// Log inserted here ✅
```

### Function Calls
```dart
List<String> result = processData(
  param1,
  param2,
  param3
);
// Log inserted here ✅
```

## 🎨 Why DebugTrace?

### The Problem
- **Manual debugging is slow**: Writing `print()` statements by hand
- **Inconsistent format**: Different developers use different debug styles  
- **Context missing**: Hard to track which file/line generated the output
- **Cleanup overhead**: Manually removing debug statements before commit

### The Solution
- **⚡ Fast insertion**: One command generates perfect debug statements
- **📍 Rich context**: Always know the source of your debug output
- **🎛️ Consistent format**: Team-wide standardized debug messages
- **🧹 Easy cleanup**: Remove all debug logs with one command

## 🏆 Best Practices

### Development Workflow
1. **Debug with DebugTrace** during development
2. **Use bulk comment** for temporary disable
3. **Bulk delete** before committing to version control
4. **Configure team settings** for consistent output

### Performance Tips
- Use `debugPrint()` for Flutter apps (throttled output, debug-mode only)
- Use `print()` for simple Dart console apps (works everywhere)
- Enable file info during development, disable for production logs

## 📋 Requirements

- **VS Code**: Version 1.74.0 or higher
- **Dart files**: Extension only activates in `.dart` files
- **Dart SDK**: Any version (extension doesn't require specific Dart version)

## 🤝 Contributing

Found a bug or have a feature request? 

1. [Open an issue](https://github.com/commentedcodex/debugtrace/issues)
2. [Submit a pull request](https://github.com/commentedcodex/debugtrace/pulls)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Happy Debugging! 🐛➡️✨**
