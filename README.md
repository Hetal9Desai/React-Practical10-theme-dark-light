## React Practical-10 Add support for dark theme in Practical-05 and deploy it

In this practical, add a toggle switch to your Todo App that you've created under 5th Practical. You may want to place it at bottom right corner of the screen. Please not that it needs to be sticky.

To support the dark theme App wide, you may want to use "context". Additionally, you have to create a custom hook called "useTheme" that returns 2 things:

The current theme (dark/light) A toggle function that doesn't take parameter but when invoked, toggles the theme (i.e from dark to light or from dark to light)
