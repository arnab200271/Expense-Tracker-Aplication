 "use client";
// import React, { createContext, useContext, useEffect, useState } from "react";

// // Type definition
// type Curencycontexttype = {
//   curency: string;
//   setCurency: (value: string) => void;
//   symbol: string;
//   rate: number;
//   setCurrencyData: (selected: string) => void;
// };

// // Create context
// const Curencycontext = createContext<Curencycontexttype | undefined>(undefined);

// export const CurencyProvider = ({ children }: { children: React.ReactNode }) => {
//   const [curency, setCurency] = useState("INR");
//   const [symbol, setSymbol] = useState("₹");
//   const [rate, setRate] = useState(1);

//   //  Function to change currency
//   const setCurrencyData = (selected: string) => {
//     setCurency(selected);
//     localStorage.setItem("selectedCurrency", selected);

//     switch (selected) {
//       case "USD":
//         setSymbol("$");
//         setRate(0.012);
//         break;
//       case "EUR":
//         setSymbol("€");
//         setRate(0.011);
//         break;
//       case "GBP":
//         setSymbol("£");
//         setRate(0.0095);
//         break;
//       case "JPY":
//         setSymbol("¥");
//         setRate(1.58);
//         break;
//       case "AUD":
//         setSymbol("A$");
//         setRate(0.018);
//         break;
//       default:
//         setSymbol("₹");
//         setRate(1);
//     }
//   };

//   //  Load saved currency when app starts
//   useEffect(() => {
//     const saved = localStorage.getItem("selectedCurrency");
//     if (saved) {
//       setCurency(saved);
//       setCurrencyData(saved); 
//     }
//   }, []);

//   //  Provide all values
//   return (
//     <Curencycontext.Provider
//       value={{ curency, setCurency, symbol, rate, setCurrencyData }}
//     >
//       {children}
//     </Curencycontext.Provider>
//   );
// };

// //  Custom hook
// export const useCurrency = () => {
//   const context = useContext(Curencycontext);
//   if (!context) throw new Error("useCurrency must be used inside CurencyProvider");
//   return context;
// };
// Curencycontext.tsx
import React, { createContext, useState, useEffect } from "react";

type CurrencyContextType = {
  curency: string;
  symbol: string;
  rate: number;
  setCurrencyData: (selected: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [curency, setCurency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [rate, setRate] = useState(1);

  const fetchRate = async (base: string, target: string) => {
    try {
      const resp = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
      const data = await resp.json();
      const r = data.rates[target];
      if (r) {
        return r as number;
      }
    } catch (err) {
      console.error("Failed to fetch currency rate", err);
    }
    return null;
  };

  const setCurrencyData = async (selected: string) => {
    setCurency(selected);
    localStorage.setItem("selectedCurrency", selected);

    // symbol set
    switch (selected) {
      case "USD": setSymbol("$"); break;
      case "EUR": setSymbol("€"); break;
      case "GBP": setSymbol("£"); break;
      case "JPY": setSymbol("¥"); break;
      // add others...
      default: setSymbol("₹");
    }

    // rate fetch
    const fetchedRate = await fetchRate("INR", selected);
    if (fetchedRate !== null) {
      setRate(fetchedRate);
    } else {
      setRate(1); // fallback
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("selectedCurrency");
    if (saved) {
      setCurrencyData(saved);
    }
  }, []);

  return (
    <CurrencyContext.Provider value={{ curency, symbol, rate, setCurrencyData }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = React.useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used inside CurrencyProvider");
  return context;
};

