# Simple C Calculator

## Description

This is a basic command-line calculator program written in C. It allows users to perform simple arithmetic operations: addition, subtraction, multiplication, and division on two numbers.

The program prompts the user to enter two numbers and an operator, then displays the result.

## Prerequisites

- A C compiler (e.g., GCC)
- Make

These are typically available on most Linux distributions and macOS.

## Compilation

To compile the program, navigate to the root directory of the project in your terminal and run the `make` command:

```bash
make
```

This will use the provided `Makefile` to compile the source code and create an executable file named `calculator`.

## Running the Program

After successful compilation, you can run the program from the root directory using:

```bash
./calculator
```

The program will then prompt you to enter the first number, an operator (+, -, *, /), and the second number.

Example:
```
Welcome to the C Calculator!
Enter first number: 10
Enter operator (+, -, *, /): +
Enter second number: 5
Result: 15.000000
```

### Division by Zero

If you attempt to divide by zero, the program will display an error message:
```
Welcome to the C Calculator!
Enter first number: 10
Enter operator (+, -, *, /): /
Enter second number: 0
Error: Division by zero is not allowed.
```
Or, if the `divide` function itself handles it (which it does):
```
Welcome to the C Calculator!
Enter first number: 10
Enter operator (+, -, *, /): /
Enter second number: 0
Error: Division by zero is not allowed. 
```
*(Note: The exact error message might vary slightly based on where the check occurs, but division by zero is handled).*

## Cleaning Build Files

To remove the compiled executable (`calculator`) and any object files (`*.o`) that were generated during compilation, you can use the `make clean` command:

```bash
make clean
```

This will restore the directory to a clean state, leaving only the source code and `Makefile`.
