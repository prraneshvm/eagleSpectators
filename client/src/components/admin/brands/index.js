import React, { Fragment, createContext, useReducer } from "react";
import AdminLayout from "../layout";
import { brandsReducer, brandsState } from "./BrandsContext";
import BrandsMenu from "./BrandsMenu";
import AllBrands from "./AllBrands";

/* This context manage all of the caregories component's data */
export const BrandsContext = createContext();

const BrandsComponent = () => {
  return (
    <div className="grid grid-cols-1 space-y-4 p-4">
      <BrandsMenu />
      <AllBrands />
    </div>
  );
};

const Brands = (props) => {
  const [data, dispatch] = useReducer(brandsReducer, brandsState);
  return (
    <Fragment>
      <BrandsContext.Provider value={{ data, dispatch }}>
        <AdminLayout children={<BrandsComponent />} />
      </BrandsContext.Provider>
    </Fragment>
  );
};

export default Brands;
