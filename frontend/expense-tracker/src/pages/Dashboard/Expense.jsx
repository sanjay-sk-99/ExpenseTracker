import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosinstance'
import { API_PATHS } from '../../utils/apipath'
import toast from 'react-hot-toast'
import ExpenseOverview from '../../components/expense/ExpenseOverview'
import AddExpenseForm from '../../components/expense/AddExpenseForm'
import Model from '../../components/Model'
import ExpenseList from '../../components/expense/ExpenseList'
import DeleteAlert from '../../components/DeleteAlert'


const Expense = () => {

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })
  const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false)

  //Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`);

      if (response.data) {
        setExpenseData(response.data)
      }

    } catch (error) {
      console.log("something went wrong. Please try again.", error)
    } finally {
      setLoading(false);
    }
  }

  //Handle Add Income
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    //Validation Checks
    if (!category.trim()) {
      toast.error("Category is Requiered")
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0")
      return;
    }

    if (!date) {
      toast.error("Date is required")
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon
      })

      setOpenAddExpenseModel(false)
      toast.success("Expense added successfully")
      fetchExpenseDetails();
    } catch (error) {
      console.error("error adding expense:", error.response?.data?.message || error.message)
    }

  }


  //Delete Expense
  const deleteExpense = async (id) => { 
    try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({show:false,data:null})
      toast.success("Expense details Deletd successfully");
      fetchExpenseDetails();
    }catch(error){
      console.error(
        "Error deleting Expense",
        error.response?.data?.message || error.message
      );
    }
  }


  //handle download expense Details
  const handleDownloadExpenseDetails = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {responseType:"blob"}
      );

      //create url for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link=document.createElement("a")
      link.href=url
      link.setAttribute("download","expense_details.xlsx")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    }catch(error){
      console.error("Error downloading expense details",error)
      toast.error("Failed to download expense details. Please try again later")
    }
   }

  useEffect(() => {
    fetchExpenseDetails();
  }, [])
  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className="grid grid-cols-1 gap-6">
          <div className=''>
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModel(true)}
            />
          </div>
          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id })
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

         <Model
          isOpen={openAddExpenseModel}
          onClose={() => setOpenAddExpenseModel(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Model>

        <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense ?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Model>
      </div>
    </DashboardLayout>
  )
}

export default Expense
