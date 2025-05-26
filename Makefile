# Compiler and Compiler Flags
CC = gcc
# CFLAGS: C compiler flags
# -Wall: Enable all common warnings
# -Wextra: Enable extra warnings (not covered by -Wall)
# -pedantic: Issue all warnings demanded by strict ISO C
# -std=c99: Use the C99 standard (for NAN, isnan from math.h)
# -g: Add debugging information
CFLAGS = -Wall -Wextra -pedantic -std=c99 -g
# LDFLAGS: Linker flags
# -lm: Link with the math library (required for NAN, isnan)
LDFLAGS = -lm

# Target executable name
TARGET = calculator

# Source files
# In this simple case, we only have one source file.
# For multiple files, you would list them e.g., SRCS = main.c utils.c
SRCS = calculator.c

# Object files (not strictly necessary for a single source file build, but good practice)
# This pattern substitution replaces .c with .o
OBJS = $(SRCS:.c=.o)

# Default rule: 'all'
# This is the rule that will be executed if you just type 'make'
# It depends on the target executable.
.PHONY: all
all: $(TARGET)

# Rule to link the executable
# For a single source file, we can compile and link in one step.
# If we had multiple object files, the rule would be:
# $(TARGET): $(OBJS)
#	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS)
# Where $^ are the prerequisites (object files) and $@ is the target.
$(TARGET): $(SRCS)
	$(CC) $(CFLAGS) $(SRCS) -o $(TARGET) $(LDFLAGS)

# Rule to compile .c files to .o files (object files)
# This rule is implicitly used if $(OBJS) were prerequisites for $(TARGET)
# $< is the first prerequisite (the .c file)
# $@ is the target (the .o file)
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

# Clean rule: 'clean'
# Removes the target executable and object files.
.PHONY: clean
clean:
	@echo "Cleaning up project..."
	rm -f $(TARGET) $(OBJS)
	@echo "Done."
