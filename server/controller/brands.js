const { toTitleCase } = require("../config/function");
const brandsModel = require("../models/brands");
const fs = require("fs");

class Brands {
  async getAllBrands(req, res) {
    try {
      let brands = await brandsModel.find({}).sort({ _id: -1 });
      if (brands) {
        return res.json({ brands });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async postAddBrands(req, res) {
    let { cName, cDescription, cStatus } = req.body;
    let cImage = req.file.filename;
    const filePath = `../server/public/uploads/brands/${cImage}`;

    if (!cName || !cDescription || !cStatus || !cImage) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
        return res.json({ error: "All filled must be required" });
      });
    } else {
      cName = toTitleCase(cName);
      try {
        let checkBrandExists = await brandsModel.findOne({ cName: cName });
        if (checkBrandExists) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
            return res.json({ error: "Brand already exists" });
          });
        } else {
          let newBrands = new brandsModel({
            cName,
            cDescription,
            cStatus,
            cImage,
          });
          await newBrands.save((err) => {
            if (!err) {
              return res.json({ success: "Brand created successfully" });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postEditBrands(req, res) {
    let { cId, cDescription, cStatus } = req.body;
    if (!cId || !cDescription || !cStatus) {
      return res.json({ error: "All filled must be required" });
    }
    try {
      let editBrands = brandsModel.findByIdAndUpdate(cId, {
        cDescription,
        cStatus,
        updatedAt: Date.now(),
      });
      let edit = await editBrands.exec();
      if (edit) {
        return res.json({ success: "Brand edit successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getDeleteBrand(req, res) {
    let { cId } = req.body;
    if (!cId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deletedBrandsFile = await brandsModel.findById(cId);
        const filePath = `../server/public/uploads/brands/${deletedBrandsFile.cImage}`;

        let deleteBrands = await brandModel.findByIdAndDelete(cId);
        if (deleteBrands) {
          // Delete Image from uploads -> categories folder 
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
            return res.json({ success: "Brand deleted successfully" });
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

const brandsController = new Brands();
module.exports = brandsController;
