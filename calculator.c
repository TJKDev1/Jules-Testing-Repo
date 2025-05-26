#include <stdio.h>
#include <math.h> // For NAN

// Function declarations for calculator operations
double add(double a, double b);
double subtract(double a, double b);
double multiply(double a, double b);
double divide(double a, double b);

int main() {
    char operator;
    double num1, num2, result;

    printf("Welcome to the C Calculator!\n");

    // Get input from the user
    printf("Enter first number: ");
    scanf("%lf", &num1);

    printf("Enter operator (+, -, *, /): ");
    scanf(" %c", &operator); // Note the space before %c to consume any leftover newline

    printf("Enter second number: ");
    scanf("%lf", &num2);

    // Call the appropriate function based on the operator
    switch (operator) {
        case '+':
            result = add(num1, num2);
            break;
        case '-':
            result = subtract(num1, num2);
            break;
        case '*':
            result = multiply(num1, num2);
            break;
        case '/':
            if (num2 == 0) { // Pre-check for division by zero to avoid calling divide with zero divisor directly if preferred
                fprintf(stderr, "Error: Division by zero is not allowed.\n");
                return 1; // Indicate an error
            }
            result = divide(num1, num2);
            // Post-check for NAN if divide itself handles returning NAN
            // For this implementation, we'll let divide print the error and return NAN,
            // and main will check for NAN.
            if (isnan(result)) {
                 // The error message is already printed by the divide function.
                 // Depending on desired behavior, main could print an additional message
                 // or just not print the result.
                return 1; // Indicate an error
            }
            break;
        default:
            printf("Error: Invalid operator\n");
            return 1; // Indicate an error
    }

    // Print the result
    printf("Result: %lf\n", result);

    return 0;
}

// Function definitions for calculator operations
double add(double a, double b) {
    return a + b;
}

double subtract(double a, double b) {
    return a - b;
}

double multiply(double a, double b) {
    return a * b;
}

double divide(double a, double b) {
    if (b == 0) {
        fprintf(stderr, "Error: Cannot divide by zero.\n");
        return NAN; // Return Not-a-Number
    }
    return a / b;
}
