"use client";
import { Transaction } from "@/app/transaction/page";
import { showAlert } from "@/Utils/alret";
import { useCurrency } from "@/Utils/CurencyContext/Curencycontext";
import { convertCurrency } from "@/Utils/CurencyConverter/Converter";
import { supabase } from "@/Utils/supabaseClient";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

type TableProps = {
  transaction?: Transaction[];
  filteredIds?: number[];
  searchQuery?: string;
};

const Table: React.FC<TableProps> = ({
  transaction: propTransactions = [],
  filteredIds = [],
  searchQuery = "",
}) => {
  const lowerQuery = searchQuery.toLowerCase();
  const [transactions, setTransactions] =
    useState<Transaction[]>(propTransactions);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editRow, setEditRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Partial<Transaction>>({});
  const [oldcategory, setoldcategory] = useState<string | null>(null);
  const [CategoryList, setCategoryList] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  const { curency, symbol, rate } = useCurrency();
  useEffect(() => {
    setTransactions(propTransactions);
    setLoading(false);
  }, [propTransactions]);
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
    };

    loadUser();
  }, []);
  useEffect(() => {
    if (propTransactions.length === 0) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("transactions").select("*");
      if (error) throw error;
      setTransactions(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleEdit = (id: number) => {
  //   const transaction = transactions.find((t) => t.id === id);
  //   setEditRow(id);
  //   setEditedData(transaction || {});
  //   if (transaction) {
  //     setoldcategory(transaction.category);
  //   }
  // };

  const handleChange = (field: keyof Transaction, value: any) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };
  const handleEdit = (id: number) => {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

   const convertedAmount = Number((transaction.amount * rate).toFixed(2));


    setEditRow(id);
    setEditedData({
      ...transaction,
      amount: Number(convertedAmount.toFixed(2)),
    });

    setoldcategory(transaction.category);
  };

  // const handleSave = async (id: number) => {
  //   const { error } = await supabase
  //     .from("transactions")
  //     .update(editedData)
  //     .eq("id", id);

  //   if (error) {
  //     showAlert("Oops! Something went wrong", "error");
  //     return;
  //   }

  //   showAlert("Updated successfully!", "success");

  //   const newCat = editedData.category?.trim();
  //   if (!newCat) {
  //     setEditRow(null);
  //     fetchTransactions();
  //     return;
  //   }

  //   if (oldcategory && oldcategory !== newCat) {
  //     await supabase
  //       .from("budgets")
  //       .update({ category: newCat })
  //       .eq("category", oldcategory)
  //       .eq("user_id", user.id);
  //   }

  //   setEditRow(null);
  //   fetchTransactions();
  // };
  const handleSave = async (id: number) => {
    try {
      const finalAmount =
        editedData.amount && curency !== "INR"
          ? convertCurrency(Number(editedData.amount), curency, "INR")
          : editedData.amount;

      const updatedData = {
        ...editedData,
        amount: finalAmount,
      };

      const { error } = await supabase
        .from("transactions")
        .update(updatedData)
        .eq("id", id);

      if (error) {
        showAlert("Oops! Something went wrong ", "error");
        return;
      }

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === id
            ? ({
                ...t,
                ...updatedData,
              } as Transaction)
            : t
        )
      );

      showAlert("Transaction updated successfully ", "success");
      setEditRow(null);
    } catch (err) {
      showAlert("Unexpected error occurred!", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete? ⚠️");
    if (!confirmDelete) return;

    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) showAlert("Delete Faild !", "error");
    else {
      showAlert("Deleted successfully!", "success");
      //alert(" Deleted successfully!");
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="container flex lg:justify-end items-center mb-6">
      <div className="w-full overflow-x-auto rounded">
        <table className="min-w-[1180px] text-sm border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-right">Type</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item) => {
              const isMatched =
                lowerQuery &&
                (item.category.toLowerCase().includes(lowerQuery) ||
                  item.description?.toLowerCase().includes(lowerQuery) ||
                  item.payment_mode.toLowerCase().includes(lowerQuery));

              const isHighlighted = filteredIds.includes(item.id) || isMatched;
              return (
                <tr
                  key={item.id}
                  className={`border-b border-gray-700 ${
                    isHighlighted
                      ? "bg-yellow-200 dark:bg-yellow-600"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {/* Date */}
                  <td className="p-3 text-dark">
                    {editRow === item.id ? (
                      <input
                        type="date"
                        value={editedData.date || ""}
                        onChange={(e) => handleChange("date", e.target.value)}
                        className="p-1 rounded text-black"
                      />
                    ) : (
                      item.date
                    )}
                  </td>

                  {/* Category */}
                  <td className="p-3 text-dark">
                    {editRow === item.id ? (
                      <input
                        type="text"
                        value={editedData.category || ""}
                        onChange={(e) =>
                          handleChange("category", e.target.value)
                        }
                        className="p-1 rounded text-black"
                      />
                    ) : (
                      item.category
                    )}
                  </td>

                  {/* Payment */}
                  <td className="p-3 text-dark">
                    {editRow === item.id ? (
                      <select
                        value={editedData.payment_mode || ""}
                        onChange={(e) =>
                          handleChange("payment_mode", e.target.value)
                        }
                        className="p-1 rounded text-black"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Credit Card">Credit Card</option>
                      </select>
                    ) : (
                      item.payment_mode
                    )}
                  </td>

                  {/* Description */}
                  <td className="p-3 text-dark">
                    {editRow === item.id ? (
                      <input
                        type="text"
                        value={editedData.description || ""}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        className="p-1 rounded text-black"
                      />
                    ) : (
                      item.description
                    )}
                  </td>

                  {/* Amount */}
                  <td
                    className={`p-3 text-right font-medium ${
                      item.type === "income" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {editRow === item.id ? (
                      <input
                        type="number"
                        value={editedData.amount || ""}
                        onChange={(e) =>
                          handleChange("amount", +e.target.value)
                        }
                        className="p-1 rounded text-black w-20 text-right"
                      />
                    ) : (
                      // `${curency} ${item.amount}`

                      `${symbol} ${(item.amount * rate).toFixed(2)}`
                    )}
                  </td>
                 

                  <td
                    className={`p-3 text-right font-medium ${
                      item.type === "income" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {item.type}
                  </td>
                  {/* Actions */}
                  <td className="p-3 text-center text-white">
                    {editRow === item.id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleSave(item.id)}
                          className="bg-green-600 hover:bg-green-700 p-2 rounded"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => setEditRow(null)}
                          className="bg-gray-600 hover:bg-gray-700 p-2 rounded"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700 p-2 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
