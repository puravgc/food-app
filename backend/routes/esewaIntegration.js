const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const createSignature = (message) => {
  const secret = "8gBm/:&EnhH.1/q";
  // Create an HMAC-SHA256 hash
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);

  // Get the digest in base64 format
  const hashInBase64 = hmac.digest("base64");
  return hashInBase64;
};

const handleEsewaSuccess = async (req, res, next) => {
  try {
    const { data } = req.query;
    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );
    console.log(decodedData);

    if (decodedData.status !== "COMPLETE") {
      return res.status(400).json({ messgae: "errror" });
    }
    const message = decodedData.signed_field_names
      .split(",")
      .map((field) => `${field}=${decodedData[field] || ""}`)
      .join(",");
    console.log(message);
    const signature = createSignature(message);

    if (signature !== decodedData.signature) {
      res.json({ message: "integrity error" });
    }

    req.transaction_uuid = decodedData.transaction_uuid;
    req.transaction_code = decodedData.transaction_code;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
};

router.post("/createesewaorder", async (req, res) => {
  try {
    const { totalPrice, orderId } = req.body;

    const signature = createSignature(
      `total_amount=${totalPrice},transaction_uuid=${orderId},product_code=EPAYTEST`
    );
    const formData = {
      amount: totalPrice,
      failure_url: "http://localhost:5173/myorders",
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: "EPAYTEST",
      signature: signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: "http://localhost:5173/myorders",
      tax_amount: "0",
      total_amount: totalPrice,
      transaction_uuid: orderId,
    };
    res.json({
      message: "Order Created Sucessfully",
      orderId,
      payment_method: "esewa",
      formData,
    });
  } catch (err) {
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
});

router.get("/esewasuccess", handleEsewaSuccess);

module.exports = router;
