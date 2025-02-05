Functional Programming Spreadsheet

An advanced, lightweight spreadsheet application built with vanilla JavaScript, HTML, and CSS. This project showcases functional programming techniques to create a dynamic, interactive spreadsheet that supports formulas, arithmetic operations, and custom functions.

🚀 Features

Dynamic Spreadsheet Grid – Automatically generates labeled rows (1-99) and columns (A-J).

Formula Evaluation – Supports basic arithmetic operations (+, -, *, /).

Built-in Functions:

sum(range): Calculates the sum of numbers in a given range.

average(range): Computes the average.

median(range): Finds the median value.

increment(range): Increments each number in the range.

random(x, y): Generates a random number between x and y.

Range Selection – Allows referencing cell ranges (e.g., =sum(A1:A5)).

Recursive Formula Resolution – Formulas can reference other cells, and they update dynamically.

🛠️ Technologies Used

JavaScript (ES6+) – Functional programming for formula parsing and evaluation.

HTML & CSS (Grid Layout) – Structuring and styling the spreadsheet.

📂 Project Structure

📦 functional-spreadsheet
├── 📄 index.html       # Main HTML structure
├── 🎨 styles.css       # Styles using CSS Grid
└── 📜 script.js        # JavaScript logic for formulas & interactions

🖥️ Demo (How to Use)

Open index.html in your browser.

Click on any cell and enter a value (numbers or formulas starting with =).

Use functions like =sum(A1:A5), =average(B2:B10), etc.

Press Enter to evaluate the formula and see the result.

⚙️ Setup & Installation

This project is completely client-side and requires no setup:

# Clone the repository
$ git clone https://github.com/yourusername/functional-spreadsheet.git

# Navigate into the project folder
$ cd functional-spreadsheet

# Open index.html in a browser

📌 Future Enhancements

Support for more advanced functions (e.g., min, max, standard deviation).

Enhanced UI/UX – Dark mode, better styling, and animations.

CSV Import/Export – Save and load spreadsheet data.

📜 License

This project is open-source and available under the MIT License.

⭐ If you find this project useful, consider giving it a star on GitHub! 🚀

