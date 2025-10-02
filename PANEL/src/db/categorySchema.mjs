import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{type:String,required:true},
    parentId:{type:mongoose.Schema.Types.ObjectId,ref:"Category",default:null}
});
export const Category = mongoose.model("Category",categorySchema);