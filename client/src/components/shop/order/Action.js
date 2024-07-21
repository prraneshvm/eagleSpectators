import { createOrder } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchbrainTree = async (getBrainTreeToken, setState) => {
  try {
    let responseData = await getBrainTreeToken();
    if (responseData && responseData) {
      setState({
        clientToken: responseData.clientToken,
        success: responseData.success,
      });
      console.log(responseData);
    }
  } catch (error) {
    console.log(error);
  }
};

// export const pay = async (
//   data,
//   dispatch,
//   state,
//   setState,
//   getPaymentProcess,
//   totalCost,
//   history
// ) => {

//   console.log(state);

//   console.log(state);
//   if (!state.address) {
//     setState({ ...state, error: "Please provide your address" });
//   } else if (!state.phone) {
//     setState({ ...state, error: "Please provide your phone number" });
//   } else {
//     let nonce;
//     state.instance
//       .requestPaymentMethod()
//       .then((data) => {
//         dispatch({ type: "loading", payload: true });
//         nonce = data.nonce;
//         let paymentData = {
//           amountTotal: totalCost(),
//           paymentMethod: nonce,
//         };
//         getPaymentProcess(paymentData)
//           .then(async (res) => {
//             if (res) {
//               let orderData = {
//                 allProduct: JSON.parse(localStorage.getItem("cart")),
//                 user: JSON.parse(localStorage.getItem("jwt")).user._id,
//                 amount: res.transaction.amount,
//                 transactionId: res.transaction.id,
//                 address: state.address,
//                 phone: state.phone,
//               };
//               try {
//                 let resposeData = await createOrder(orderData);
//                 if (resposeData.success) {
//                   localStorage.setItem("cart", JSON.stringify([]));
//                   dispatch({ type: "cartProduct", payload: null });
//                   dispatch({ type: "cartTotalCost", payload: null });
//                   dispatch({ type: "orderSuccess", payload: true });
//                   setState({ clientToken: "", instance: {} });
//                   dispatch({ type: "loading", payload: false });
//                   return history.push("/");
//                 } else if (resposeData.error) {
//                   console.log(resposeData.error);
//                 }
//               } catch (error) {
//                 console.log(error);
//               }
//             }
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       })
//       .catch((error) => {
//         console.log(error);
//         setState({ ...state, error: error.message });
//       });
//   }
// };

function shuffleString(str) {
  const array = str.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

function generateTransactionID(username) {
  // Get the current date and time
  const now = new Date();

  // Format date and time components
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  // Create the base string to be shuffled
  const baseString = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${username}`;

  // Shuffle the base string
  const shuffledString = shuffleString(baseString);

  return shuffledString;
}

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  history,
  totalCost
) => {
  if (!state.address) {
    setState({ ...state, error: "Please provide your address" });
  } else if (!state.phone) {
    setState({ ...state, error: "Please provide your phone number" });
  } else {
    dispatch({ type: "loading", payload: true });

    const usernameid = localStorage.getItem("jwt")
      ? JSON.parse(localStorage.getItem("jwt")).user._id
      : "";

    const transactionID = generateTransactionID(usernameid);

    let id;
    if (state?.paymentType === "prepaid") {
      id = `PRE_${transactionID}`;
    } else {
      id = `POST_${transactionID}`;
    }

    let orderData = {
      allProduct: JSON.parse(localStorage.getItem("cart")),
      user: JSON.parse(localStorage.getItem("jwt")).user._id,
      amount: totalCost(),
      address: state.address,
      phone: state.phone,
      paymentMethod: "COD",
      transactionId: id,
      referenceNumber: state?.referenceNumber
    };

    try {
      let resposeData = await createOrder(orderData);
      if (resposeData.success) {
        localStorage.setItem("cart", JSON.stringify([]));
        dispatch({ type: "cartProduct", payload: null });
        dispatch({ type: "cartTotalCost", payload: null });
        dispatch({ type: "orderSuccess", payload: true });
        setState({ address: "", phone: "" });
        dispatch({ type: "loading", payload: false });
        return history.push("/");
      } else if (resposeData.error) {
        console.log(resposeData.error);
        dispatch({ type: "loading", payload: false });
        setState({ ...state, error: resposeData.error });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "loading", payload: false });
      setState({ ...state, error: error.message });
    }
  }
};
