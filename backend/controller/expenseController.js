const xlsx = require("xlsx")
const Expense = require("../models/Expense")

//add expense source
exports.addExpense = async (req, res) => {
    // From protect middleware
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        //validation.check for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields required" })
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        })

        //Save to MongoDB
        await newExpense.save();
        res.status(200).json(newExpense)
    } catch (err) {
        res.status(500).json({ message: "server Error" })
    }
}

//get all expense source
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 })
        res.json(expense)
    } catch (err) {
        res.status(500).json({ message: "server Error" })
    }
}

//delete expense source
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: "server Error" })
    }
}

//download expense in excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch and sort records 
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Map to plain objects for the sheet
        const data = expense.map(item => ({
            category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        // Create a new workbook & worksheet
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");

        // Write to a file on the server
        xlsx.writeFile(wb, "Expense_details.xlsx");

        // Send it as a download response
        res.download("Expense_details.xlsx");
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};
