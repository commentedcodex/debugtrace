# DebugTrace for Dart

**Say goodbye to manual print statements and hello to efficient debugging**

DebugTrace is a VS Code extension that supercharges your Dart debugging by automatically generating contextual debug statements.

### Basic Usage
1. **Place cursor** on any variable in your Dart file
2. `Ctrl+L` / `Cmd+L` for instant log insertion

## 🎮 Commands & Shortcuts

| Command | Shortcut | Description |
|---------|----------|-------------|
| `DebugTrace: Insert Log` | `Ctrl+L` / `Cmd+L` | Generate debug log for variable at cursor |
| `DebugTrace: Insert Log with Message` | `Ctrl+Shift+L` / `Cmd+Shift+L` | Generate debug log with custom message |
| `DebugTrace: Delete All Logs` | `Ctrl+Alt+L` / `Cmd+Alt+L` | Remove all DebugTrace logs from file |
| `DebugTrace: Comment All Logs` | `Ctrl+Alt+C` / `Cmd+Alt+C` | Comment out all DebugTrace logs |
| `DebugTrace: Uncomment All Logs` | `Ctrl+Alt+U` / `Cmd+Alt+U` | Uncomment all DebugTrace logs |

## 🎯 Quick Start

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
