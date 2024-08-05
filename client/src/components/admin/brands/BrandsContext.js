export const brandsState = {
  brands: [],
  addBrandsModal: false,
  editBrandsModal: {
    modal: false,
    cId: null,
    des: "",
    status: "",
  },
  loading: false,
};

export const brandsReducer = (state, action) => {
  console.log('action', action.type, state, action.payload)
  switch (action.type) {
    /* Get all category */
    case "fetchBrandsAndChangeState":
      return {
        ...state,
        brands: action.payload,
      };
    /* Create a category */
    case "addBrandsModal":
      return {
        ...state,
        addBrandsModal: action.payload,
      };
    /* Edit a category */
    case "editBrandsModalOpen":
      return {
        ...state,
        editBrandsModal: {
          modal: true,
          cId: action.cId,
          des: action.des,
          status: action.status,
        },
      };
    case "editBrandsModalClose":
      return {
        ...state,
        editBrandsModal: {
          modal: false,
          cId: null,
          des: "",
          status: "",
        },
      };
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};
