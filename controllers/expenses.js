const Expense = require("../models/Expense");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ createdBy: req.user.userId }).sort(
      "createdAt"
    );
    res.status(StatusCodes.OK).json({ expenses, count: expenses.length });
  } catch (error) {
    next(error);
  }
};

const getExpense = async (req, res, next) => {
  try {
    const {
      user: { userId },
      params: { id: expenseId },
    } = req;
    const expense = await Expense.findOne({
      _id: expenseId,
      createdBy: userId,
    });
    if (!expense) {
      throw new NotFoundError(`No expense with id ${expenseId}`);
    }
    res.status(StatusCodes.OK).json({ expense });
  } catch (error) {
    next(error);
  }
};

const createExpense = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.userId;
    const expense = await Expense.create(req.body);
    res.status(StatusCodes.CREATED).json({ expense });
  } catch (error){
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const { title, amount, date, description, mainCategory, subCategory } =
      req.body;
    const { userId } = req.user;
    const { id: expenseId } = req.params;

    if (!title || !amount || !mainCategory || !subCategory) {
      throw new BadRequestError(
        "Title, amount, mainCategory, or subCategory can not be empty"
      );
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: expenseId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      throw new NotFoundError(`No expense with the id ${expenseId}`);
    }

    res.status(StatusCodes.OK).json({ updatedExpense });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const {
      user: { userId },
      params: { id: expenseId },
    } = req;

    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      createdBy: userId,
    });
    if (!expense) {
      throw new NotFoundError(`No expense with the id ${expenseId}`);
    }

    res.status(StatusCodes.OK).json({ msg: "The entry was deleted." });
  } catch (error){
    next(error)
  }
};

module.exports = {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};
