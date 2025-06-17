const xlsx = require("xlsx")
const Income = require("../models/Income")

//add income source
exports.addIncome = async (req, res) => {
    // From protect middleware
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        //validation check for missing fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields required" })
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        })

        //Save to MongoDB
        await newIncome.save();

        res.status(200).json(newIncome)
    } catch (err) {
        res.status(500).json({ message: "server Error" })
    }
}

//get all income source
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 })
        res.json(income)
    } catch (err) {
        res.status(500).json({ message: "server Error" })
    }
}

//delete income source
exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: "server Error" })
    }
}

//download income in excel
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch and sort records 
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Map to plain objects for the sheet
    const data = income.map(item => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    // Create a new workbook & worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    // Write to a file on the server
    xlsx.writeFile(wb, "income_details.xlsx");

    // Send it as a download response
    res.download("income_details.xlsx");
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
