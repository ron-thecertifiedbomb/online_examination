import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  items: {
    type: [String],
    required: true,
  },
});

const servicesSchema = new mongoose.Schema(
  {
    services: {
      type: [categorySchema],
      required: true,
    },
    tagline: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

 const Services = mongoose.model("Services", servicesSchema);

export default Services;